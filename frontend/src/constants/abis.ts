// Contract ABIs — generated from Solidity contracts
// These are manually maintained for the demo; in production use TypeChain output

export const LiquidRS_ABI = [
  // ERC20 standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  // Access control
  "function MINTER_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;

export const MockUSDT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function faucet()",
  "function mint(address to, uint256 amount)",
  "function FAUCET_AMOUNT() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;

export const MockUSDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function faucet()",
  "function mint(address to, uint256 amount)",
  "function FAUCET_AMOUNT() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;

export const Vault_ABI = [
  "function lrs() view returns (address)",
  "function usdt() view returns (address)",
  "function usdc() view returns (address)",
  "function pegPrice() view returns (uint256)",
  "function collateralRatio() view returns (uint256)",
  "function paused() view returns (bool)",
  "function collateralOf(address) view returns (uint256)",
  "function lrsMintedOf(address) view returns (uint256)",
  "function lockAndMint(uint256 collateralAmount)",
  "function burnAndRedeem(uint256 lrsAmount)",
  "function previewMint(uint256 collateralAmount) view returns (uint256)",
  "function previewRedeem(address user, uint256 lrsAmount) view returns (uint256)",
  "function updatePegPrice(uint256 newPrice)",
  "function updateCollateralRatio(uint256 newRatio)",
  "function setPaused(bool _paused)",
  "event Minted(address indexed user, uint256 collateralAmount, uint256 lrsAmount)",
  "event Redeemed(address indexed user, uint256 lrsAmount, uint256 collateralReturned)",
  "event PegPriceUpdated(uint256 oldPrice, uint256 newPrice)",
  "event CollateralRatioUpdated(uint256 oldRatio, uint256 newRatio)",
  "event PausedToggled(bool paused)",
] as const;
