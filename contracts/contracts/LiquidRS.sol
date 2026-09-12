// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title LiquidRS
 * @notice INR-pegged stablecoin ERC-20 token.
 *         Mint/burn is gated to the Vault contract via MINTER_ROLE.
 *
 * FUTURE WORK (out of scope for hackathon demo):
 * - Real price oracle integration (Chainlink INR/USD feed)
 * - Governance via DAO for parameter changes
 * - Mainnet deployment and real-money custody
 * - KYC / AML compliance layer
 */
contract LiquidRS is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address admin) ERC20("LiquidRS", "LRS") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /**
     * @notice Mint LRS tokens — only callable by Vault (MINTER_ROLE)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /**
     * @notice Burn LRS tokens — only callable by Vault (MINTER_ROLE)
     */
    function burn(address from, uint256 amount) external onlyRole(MINTER_ROLE) {
        _burn(from, amount);
    }

    /**
     * @notice Returns 18 decimals (standard ERC-20)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
