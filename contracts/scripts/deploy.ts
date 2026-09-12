import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying LiquidRS contracts with:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  // 1. Deploy MockUSDT
  console.log("\n1️⃣  Deploying MockUSDT...");
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("   MockUSDT deployed to:", await usdt.getAddress());

  // 2. Deploy MockUSDC
  console.log("\n2️⃣  Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  console.log("   MockUSDC deployed to:", await usdc.getAddress());

  // 3. Deploy LiquidRS
  console.log("\n3️⃣  Deploying LiquidRS...");
  const LiquidRS = await ethers.getContractFactory("LiquidRS");
  const lrs = await LiquidRS.deploy(deployer.address);
  await lrs.waitForDeployment();
  console.log("   LiquidRS deployed to:", await lrs.getAddress());

  // 4. Deploy Vault
  console.log("\n4️⃣  Deploying Vault...");
  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(
    await lrs.getAddress(),
    await usdt.getAddress(),
    await usdc.getAddress()
  );
  await vault.waitForDeployment();
  console.log("   Vault deployed to:", await vault.getAddress());

  // 5. Grant Vault MINTER_ROLE on LiquidRS
  console.log("\n5️⃣  Granting MINTER_ROLE to Vault...");
  const MINTER_ROLE = await lrs.MINTER_ROLE();
  await lrs.grantRole(MINTER_ROLE, await vault.getAddress());
  console.log("   ✅ MINTER_ROLE granted");

  // 6. Write addresses to frontend
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    LiquidRS: await lrs.getAddress(),
    MockUSDT: await usdt.getAddress(),
    MockUSDC: await usdc.getAddress(),
    Vault: await vault.getAddress(),
  };

  // Write to frontend constants
  const frontendDir = path.join(__dirname, "../../frontend/src/constants");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(frontendDir, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n📝 Addresses written to frontend/src/constants/addresses.json");

  // Also write locally
  fs.writeFileSync(
    path.join(__dirname, "../deployed-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n✅ Deployment complete!");
  console.log("─────────────────────────────────────────");
  console.log("LiquidRS:", await lrs.getAddress());
  console.log("MockUSDT:", await usdt.getAddress());
  console.log("MockUSDC:", await usdc.getAddress());
  console.log("Vault:   ", await vault.getAddress());
  console.log("─────────────────────────────────────────");
  console.log("\nNext: run `npx hardhat run scripts/seed.ts --network localhost`");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
