// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Test token for demo purposes only. Has a public faucet so the
 *         presenter can top up live on stage without asking anyone for funds.
 *
 * NOT for production use — no supply cap, no access control on faucet.
 */
contract MockUSDC is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 10_000 * 10 ** 6; // 10,000 USDC

    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {}

    /**
     * @notice Public faucet — mints 10,000 USDC to caller. No limits.
     *         This lets the demo presenter top up live on stage.
     */
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Owner mint for seeding demo wallets
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice USDC uses 6 decimals (matching real Circle USDC)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
