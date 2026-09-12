// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LiquidRS.sol";

/**
 * @title Vault
 * @notice Collateralized vault: lock USDT → mint LRS (INR-pegged stablecoin).
 *         Burn LRS → redeem USDT collateral.
 *
 * ARCHITECTURE:
 * - pegPrice: mock INR/USD rate (e.g., 8300 = ₹83.00, 2-decimal precision)
 *   This is what the "AI layer" updates dynamically in the roadmap.
 *   For the demo it is owner-settable, simulating an AI risk engine update.
 *
 * - collateralRatio: basis points (15000 = 150%). The AI Risk Monitor UI
 *   shows this being "AI-recommended" at runtime. In production this would
 *   come from a trained volatility model.
 *
 * - paused: emergency circuit breaker. Demo story: "AI detects de-peg → 
 *   auto-pauses minting until risk normalises."
 *
 * FUTURE WORK (out of scope for hackathon demo):
 * - Real Chainlink oracle for INR/USD price
 * - Liquidation engine for undercollateralised positions
 * - Multi-collateral support (ETH, BTC)
 * - Governance-controlled parameter updates (not owner-only)
 * - Mainnet deployment and real-money custody
 * - Real trained AI/ML model for collateral ratio + de-peg prediction
 */
contract Vault is Ownable, ReentrancyGuard {
    // ── State ────────────────────────────────────────────────────────────────

    LiquidRS public immutable lrs;
    IERC20 public immutable usdt;
    IERC20 public immutable usdc;

    /// @notice Mock INR/USD rate. 8300 = ₹83.00 (2 decimal precision).
    ///         In production: replaced by a Chainlink INR/USD price feed.
    ///         In the AI roadmap: updated by a risk engine watching FX volatility.
    uint256 public pegPrice = 8300;

    /// @notice Collateral ratio in basis points. 15000 = 150%.
    ///         In the AI roadmap: dynamically adjusted by volatility model.
    uint256 public collateralRatio = 15000;

    /// @notice Emergency pause. Owner (or future AI risk engine) can flip this.
    ///         Demo story: AI detects de-peg → pauses minting automatically.
    bool public paused = false;

    /// @notice Collateral balances per user (USDT only for demo simplicity)
    mapping(address => uint256) public collateralOf;

    /// @notice LRS minted per user
    mapping(address => uint256) public lrsMintedOf;

    // ── Events ───────────────────────────────────────────────────────────────

    event Minted(address indexed user, uint256 collateralAmount, uint256 lrsAmount);
    event Redeemed(address indexed user, uint256 lrsAmount, uint256 collateralReturned);
    event PegPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event CollateralRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event PausedToggled(bool paused);

    // ── Errors ───────────────────────────────────────────────────────────────

    error VaultPaused();
    error ZeroAmount();
    error InsufficientCollateral();
    error InsufficientLRS();

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _lrs,
        address _usdt,
        address _usdc
    ) Ownable(msg.sender) {
        lrs = LiquidRS(_lrs);
        usdt = IERC20(_usdt);
        usdc = IERC20(_usdc);
    }

    // ── Core: Mint ────────────────────────────────────────────────────────────

    /**
     * @notice Lock USDT collateral and mint LRS stablecoins.
     * @param collateralAmount Amount of USDT (6 decimals) to lock as collateral.
     *
     * Formula (derivation):
     *   Human: lrs = collateral_usd * pegPrice_inr_per_usd / collateralRatio_pct
     *   Raw:   lrs_wei = (collateralAmount * pegPrice * 100 * 1e18) / (collateralRatio * 1e6)
     *
     *   Where:
     *     collateralAmount = USDT in 6-decimal raw units (100 USDT = 100_000_000)
     *     pegPrice = INR per USD × 100 (₹83.00 = 8300)
     *     collateralRatio = basis points × 100 (150% = 15000 → factor of 10000 cancel)
     *     The ×100 in numerator cancels the /100 in pegPrice decimal precision
     *     divided by 1e6 to remove USDT decimal scaling
     *
     * Example: 100 USDT at ₹83/USD, 150% ratio:
     *   = (100_000_000 * 8300 * 100 * 1e18) / (15000 * 1e6)
     *   = (100 * 8300 * 100 / 15000) * 1e18
     *   = 5533.33 LRS (worth ₹5,533 — correctly under-collateralised by 1.5×)
     */
    function lockAndMint(uint256 collateralAmount) external nonReentrant {
        if (paused) revert VaultPaused();
        if (collateralAmount == 0) revert ZeroAmount();

        // Transfer USDT from user to vault
        usdt.transferFrom(msg.sender, address(this), collateralAmount);

        // Calculate LRS to mint
        // The ×100 accounts for basis-point collateralRatio (15000 = 150.00%)
        // This correctly gives ~5533 LRS for 100 USDT at ₹83/USD, 150% ratio
        uint256 lrsAmount = (collateralAmount * pegPrice * 100 * 1e18) /
            (collateralRatio * 1e6);

        // Track user position
        collateralOf[msg.sender] += collateralAmount;
        lrsMintedOf[msg.sender] += lrsAmount;

        // Mint LRS to user
        lrs.mint(msg.sender, lrsAmount);

        emit Minted(msg.sender, collateralAmount, lrsAmount);
    }

    /**
     * @notice Preview how much LRS a given collateral amount would mint.
     *         Used by the frontend for live preview — pure, no state change.
     */
    function previewMint(uint256 collateralAmount) external view returns (uint256) {
        return (collateralAmount * pegPrice * 100 * 1e18) / (collateralRatio * 1e6);
    }

    // ── Core: Redeem ──────────────────────────────────────────────────────────

    /**
     * @notice Burn LRS and redeem proportional USDT collateral.
     * @param lrsAmount Amount of LRS (18 decimals) to burn.
     */
    function burnAndRedeem(uint256 lrsAmount) external nonReentrant {
        if (lrsAmount == 0) revert ZeroAmount();
        if (lrs.balanceOf(msg.sender) < lrsAmount) revert InsufficientLRS();
        if (lrsMintedOf[msg.sender] < lrsAmount) revert InsufficientCollateral();

        // Proportional collateral = (lrsAmount / lrsMinted) * collateralDeposited
        uint256 collateralToReturn = (lrsAmount * collateralOf[msg.sender]) /
            lrsMintedOf[msg.sender];

        // Update user position
        lrsMintedOf[msg.sender] -= lrsAmount;
        collateralOf[msg.sender] -= collateralToReturn;

        // Burn LRS from user
        lrs.burn(msg.sender, lrsAmount);

        // Return collateral
        usdt.transfer(msg.sender, collateralToReturn);

        emit Redeemed(msg.sender, lrsAmount, collateralToReturn);
    }

    /**
     * @notice Preview how much USDT would be returned for burning lrsAmount.
     */
    function previewRedeem(address user, uint256 lrsAmount) external view returns (uint256) {
        if (lrsMintedOf[user] == 0) return 0;
        return (lrsAmount * collateralOf[user]) / lrsMintedOf[user];
    }

    // ── Admin: Risk Engine Hooks ──────────────────────────────────────────────

    /**
     * @notice Update the mock INR/USD peg price.
     *         AI roadmap hook: in production, this is called by a risk engine
     *         monitoring live FX data and de-peg indicators.
     */
    function updatePegPrice(uint256 newPrice) external onlyOwner {
        emit PegPriceUpdated(pegPrice, newPrice);
        pegPrice = newPrice;
    }

    /**
     * @notice Update the collateral ratio.
     *         AI roadmap hook: in production, called by volatility model
     *         to dynamically tighten/loosen collateral requirements.
     */
    function updateCollateralRatio(uint256 newRatio) external onlyOwner {
        emit CollateralRatioUpdated(collateralRatio, newRatio);
        collateralRatio = newRatio;
    }

    /**
     * @notice Toggle emergency pause.
     *         AI roadmap hook: in production, triggered automatically when
     *         de-peg risk score exceeds threshold.
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedToggled(_paused);
    }

    /**
     * @notice Owner can drain vault in emergency (demo safety net only).
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
}
