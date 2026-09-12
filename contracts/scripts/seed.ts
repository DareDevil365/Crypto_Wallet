import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Seed script — pre-funds the demo wallet so the very first screen
 * already looks alive (non-zero balances everywhere).
 *
 * Run after deploy: npx hardhat run scripts/seed.ts --network localhost
 */
async function main() {
  const [deployer, demoWallet] = await ethers.getSigners();

  // Load deployed addresses
  const addressesPath = path.join(__dirname, "../deployed-addresses.json");
  if (!fs.existsSync(addressesPath)) {
    throw new Error("Run deploy.ts first!");
  }
  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  const usdt = await ethers.getContractAt("MockUSDT", addresses.MockUSDT);
  const usdc = await ethers.getContractAt("MockUSDC", addresses.MockUSDC);
  const lrs = await ethers.getContractAt("LiquidRS", addresses.LiquidRS);
  const vault = await ethers.getContractAt("Vault", addresses.Vault);

  console.log("🌱 Seeding demo wallet:", demoWallet.address);

  // Mint USDT to demo wallet
  const usdtAmount = 50_000n * 10n ** 6n; // 50,000 USDT
  await usdt.mint(demoWallet.address, usdtAmount);
  console.log("   ✅ 50,000 USDT minted");

  // Mint USDC to demo wallet
  const usdcAmount = 50_000n * 10n ** 6n; // 50,000 USDC
  await usdc.mint(demoWallet.address, usdcAmount);
  console.log("   ✅ 50,000 USDC minted");

  // Mint some LRS directly to demo wallet (so dashboard shows non-zero LRS balance)
  // Do this via Vault lockAndMint: approve first
  const mintCollateral = 1000n * 10n ** 6n; // 1,000 USDT as collateral
  await usdt.connect(demoWallet).approve(addresses.Vault, mintCollateral);
  await vault.connect(demoWallet).lockAndMint(mintCollateral);
  const lrsBalance = await lrs.balanceOf(demoWallet.address);
  console.log(
    "   ✅",
    ethers.formatUnits(lrsBalance, 18),
    "LRS minted to demo wallet"
  );

  console.log("\n✅ Seeding complete! Demo wallet is ready.");
  console.log("   Wallet:", demoWallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
