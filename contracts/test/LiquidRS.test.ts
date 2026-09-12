import { expect } from "chai";
import { ethers } from "hardhat";
import { LiquidRS, MockUSDT, MockUSDC, Vault } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LiquidRS Protocol", function () {
  let lrs: LiquidRS;
  let usdt: MockUSDT;
  let usdc: MockUSDC;
  let vault: Vault;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  const USDT_DECIMALS = 6;
  const LRS_DECIMALS = 18;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy
    usdt = await (await ethers.getContractFactory("MockUSDT")).deploy();
    usdc = await (await ethers.getContractFactory("MockUSDC")).deploy();
    lrs = await (
      await ethers.getContractFactory("LiquidRS")
    ).deploy(owner.address);
    vault = await (
      await ethers.getContractFactory("Vault")
    ).deploy(
      await lrs.getAddress(),
      await usdt.getAddress(),
      await usdc.getAddress()
    );

    // Grant vault MINTER_ROLE
    const MINTER_ROLE = await lrs.MINTER_ROLE();
    await lrs.grantRole(MINTER_ROLE, await vault.getAddress());

    // Give user 100,000 USDT
    await usdt.mint(user.address, ethers.parseUnits("100000", USDT_DECIMALS));
  });

  // ── Faucet ────────────────────────────────────────────────────────────────

  describe("MockUSDT faucet", function () {
    it("mints 10,000 USDT to caller", async function () {
      const before = await usdt.balanceOf(user.address);
      await usdt.connect(user).faucet();
      const after = await usdt.balanceOf(user.address);
      expect(after - before).to.equal(ethers.parseUnits("10000", USDT_DECIMALS));
    });
  });

  // ── Mint Flow ─────────────────────────────────────────────────────────────

  describe("lockAndMint", function () {
    it("mints correct LRS for 100 USDT at 150% ratio and ₹83 peg", async function () {
      const collateral = ethers.parseUnits("100", USDT_DECIMALS);
      await usdt.connect(user).approve(await vault.getAddress(), collateral);
      await vault.connect(user).lockAndMint(collateral);

      // Formula: (collateralAmount * pegPrice * 100 * 1e18) / (collateralRatio * 1e6)
      // collateralAmount = 100 USDT = 100_000_000 (6 decimals)
      // = (100_000_000 * 8300 * 100 * 1e18) / (15000 * 1e6)
      // = (100 * 8300 * 100 / 15000) * 1e18
      // = 5533.33 LRS in 18-decimal format
      const lrsBalance = await lrs.balanceOf(user.address);
      // Verify it's between 5533 and 5534 LRS (18-decimal wei)
      const lowerBound = 5533n * 10n ** 18n;
      const upperBound = 5534n * 10n ** 18n;
      expect(lrsBalance).to.be.gte(lowerBound);
      expect(lrsBalance).to.be.lte(upperBound);
    });

    it("tracks collateral and LRS minted per user", async function () {
      const collateral = ethers.parseUnits("500", USDT_DECIMALS);
      await usdt.connect(user).approve(await vault.getAddress(), collateral);
      await vault.connect(user).lockAndMint(collateral);

      expect(await vault.collateralOf(user.address)).to.equal(collateral);
      expect(await vault.lrsMintedOf(user.address)).to.be.gt(0);
    });

    it("reverts when paused", async function () {
      await vault.connect(owner).setPaused(true);
      const collateral = ethers.parseUnits("100", USDT_DECIMALS);
      await usdt.connect(user).approve(await vault.getAddress(), collateral);
      await expect(
        vault.connect(user).lockAndMint(collateral)
      ).to.be.revertedWithCustomError(vault, "VaultPaused");
    });

    it("reverts on zero amount", async function () {
      await expect(
        vault.connect(user).lockAndMint(0)
      ).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

    it("emits Minted event", async function () {
      const collateral = ethers.parseUnits("100", USDT_DECIMALS);
      await usdt.connect(user).approve(await vault.getAddress(), collateral);
      const tx = vault.connect(user).lockAndMint(collateral);
      await expect(tx).to.emit(vault, "Minted").withArgs(
        user.address,
        collateral,
        await vault.previewMint(collateral)
      );
    });
  });

  // ── Redeem Flow ───────────────────────────────────────────────────────────

  describe("burnAndRedeem", function () {
    beforeEach(async function () {
      // Mint some LRS first
      const collateral = ethers.parseUnits("1000", USDT_DECIMALS);
      await usdt.connect(user).approve(await vault.getAddress(), collateral);
      await vault.connect(user).lockAndMint(collateral);
    });

    it("returns proportional USDT when burning LRS", async function () {
      const lrsBalance = await lrs.balanceOf(user.address);
      const usdtBefore = await usdt.balanceOf(user.address);
      const collateralBefore = await vault.collateralOf(user.address);

      // Burn half
      const burnAmount = lrsBalance / 2n;
      await lrs.connect(user).approve(await vault.getAddress(), burnAmount);

      // Need to approve the vault to burn — actually vault calls lrs.burn directly
      // The user needs to call burnAndRedeem which internally calls lrs.burn(from, amount)
      // lrs.burn requires MINTER_ROLE — vault has it
      // But we need the user to approve vault to spend their LRS first
      // Actually looking at our Vault: lrs.burn(msg.sender, lrsAmount) — the vault burns FROM the sender
      // This requires LRS to allow vault to burn — our LRS.burn takes an address param
      // The vault calls lrs.burn(msg.sender, lrsAmount) — this works because vault has MINTER_ROLE

      await vault.connect(user).burnAndRedeem(burnAmount);

      const usdtAfter = await usdt.balanceOf(user.address);
      expect(usdtAfter).to.be.gt(usdtBefore);

      // Should get back approximately half the collateral
      const expectedReturn = collateralBefore / 2n;
      expect(usdtAfter - usdtBefore).to.be.closeTo(
        expectedReturn,
        ethers.parseUnits("1", USDT_DECIMALS)
      );
    });

    it("reverts if LRS balance insufficient", async function () {
      const lrsBalance = await lrs.balanceOf(user.address);
      await expect(
        vault.connect(user).burnAndRedeem(lrsBalance + 1n)
      ).to.be.revertedWithCustomError(vault, "InsufficientLRS");
    });

    it("emits Redeemed event", async function () {
      const lrsBalance = await lrs.balanceOf(user.address);
      const tx = vault.connect(user).burnAndRedeem(lrsBalance);
      await expect(tx).to.emit(vault, "Redeemed");
    });
  });

  // ── Admin: Pause & Parameters ─────────────────────────────────────────────

  describe("admin controls", function () {
    it("owner can pause and unpause", async function () {
      await vault.connect(owner).setPaused(true);
      expect(await vault.paused()).to.be.true;
      await vault.connect(owner).setPaused(false);
      expect(await vault.paused()).to.be.false;
    });

    it("owner can update peg price", async function () {
      await vault.connect(owner).updatePegPrice(8500);
      expect(await vault.pegPrice()).to.equal(8500);
    });

    it("owner can update collateral ratio", async function () {
      await vault.connect(owner).updateCollateralRatio(17000);
      expect(await vault.collateralRatio()).to.equal(17000);
    });

    it("non-owner cannot pause", async function () {
      await expect(
        vault.connect(user).setPaused(true)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  // ── Preview Functions ─────────────────────────────────────────────────────

  describe("preview functions", function () {
    it("previewMint returns same amount as actual mint", async function () {
      const collateral = ethers.parseUnits("200", USDT_DECIMALS);
      const preview = await vault.previewMint(collateral);

      await usdt.connect(user).approve(await vault.getAddress(), collateral);
      await vault.connect(user).lockAndMint(collateral);

      expect(await lrs.balanceOf(user.address)).to.equal(preview);
    });
  });
});
