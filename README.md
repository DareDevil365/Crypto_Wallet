# LiquidRS — INR-Pegged Stablecoin Demo

> **Hackathon demo** — polished, not production. Runs locally in minutes.

---

## 🎬 Demo Click-Through Script

```
Connect Wallet → Dashboard → Get Test Funds → Mint LRS → 
Risk Monitor → Send → Receive → Redeem → Activity
```

**Exact steps:**

1. **Landing** — Open app, click "Connect Wallet", select MetaMask + Hardhat local network
2. **Dashboard** — Show LRS balance, USDT balance, collateral ratio, System Health badge
3. **Get Test Funds** — Click "Get 10,000 USDT" → tx confirms → balance updates live  
4. **Mint LRS** — Enter `500` USDT → preview shows ~27,666 LRS → AI Risk Check shows green → Approve → Mint
5. **Risk Monitor** — Navigate here and let it speak for itself: live chart, AI collateral gauge, event log
6. **Send** — Paste any wallet address, enter `100` LRS → Send → success screen with tx hash
7. **Receive** — Show QR code, copy address
8. **Redeem** — Enter `500` LRS → preview shows USDT back → Burn & Redeem → success
9. **Activity** — Show transaction history feed

**If asked "is the AI real?"** → Point to the yellow "UI PROTOTYPE" badge on Risk Monitor and explain this is the planned production architecture, demonstrated as a UI mock.

**If wifi fails** → You already have the local node running (see below). The deployed link is a backup.

---

## 🚀 Quick Start (Local Demo — Recommended)

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Git

### 1. Install dependencies

```bash
# Contracts
cd contracts
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start local blockchain

```bash
# Terminal 1 — keep this running
cd contracts
npx hardhat node
```

Copy one of the printed private keys and import it into MetaMask:
- Network: `localhost:8545` · Chain ID: `31337`
- Import account using private key from terminal output

### 3. Deploy contracts

```bash
# Terminal 2
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

This automatically writes contract addresses to `frontend/src/constants/addresses.json`.

### 4. (Optional) Pre-seed demo wallet

```bash
cd contracts
npx hardhat run scripts/seed.ts --network localhost
```

Seeds the second Hardhat account with 50,000 USDT + 50,000 USDC + ~5,500 LRS.

### 5. Start frontend

```bash
# Terminal 3
cd frontend
npm run dev
```

Open http://localhost:3000 — connect MetaMask to the Hardhat network.

### 6. Run tests (optional, for confidence before pitch)

```bash
cd contracts
npx hardhat test
```

---

## 🌐 Vercel Deployment (Shareable Link)

```bash
# From /frontend
npm run build
npx vercel --prod
```

The deployed version connects to Base Sepolia by default. To deploy contracts:

```bash
# 1. Copy .env.example to .env and add your private key + Sepolia ETH
cd contracts
cp .env.example .env
# Edit .env: PRIVATE_KEY=0x...

# 2. Deploy
npx hardhat run scripts/deploy.ts --network baseSepolia

# 3. Commit addresses.json, push, Vercel auto-deploys
git add ../frontend/src/constants/addresses.json
git commit -m "chore: deploy to Base Sepolia"
git push
```

Free Sepolia ETH: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 🏗️ Architecture

```
Prototype/
├── contracts/              # Hardhat + Solidity
│   ├── contracts/
│   │   ├── LiquidRS.sol    # ERC-20 stablecoin (mint/burn by Vault)
│   │   ├── MockUSDT.sol    # Test collateral with public faucet()
│   │   ├── MockUSDC.sol    # Test collateral with public faucet()
│   │   └── Vault.sol       # Core: lockAndMint / burnAndRedeem
│   ├── scripts/
│   │   ├── deploy.ts       # Deploys all 4 contracts, writes addresses.json
│   │   └── seed.ts         # Pre-funds demo wallet
│   └── test/
│       └── LiquidRS.test.ts
│
└── frontend/               # Vite + React + wagmi + RainbowKit
    └── src/
        ├── pages/
        │   ├── Landing.tsx         # Connect screen
        │   ├── Dashboard.tsx       # Balances + health
        │   ├── Faucet.tsx          # Get test tokens
        │   ├── Mint.tsx            # Collateral → LRS
        │   ├── Send.tsx            # Transfer LRS
        │   ├── Receive.tsx         # QR code
        │   ├── Redeem.tsx          # LRS → collateral
        │   ├── Activity.tsx        # Transaction history
        │   └── RiskMonitor.tsx     # AI layer UI mock
        ├── hooks/useContracts.ts   # All contract interactions
        └── constants/
            ├── abis.ts             # Contract ABIs
            └── addresses.json      # Deployed addresses (auto-generated)
```

---

## 🎨 Design System

- **Colors**: Navy `#0B1F3A` + Gold `#C9A84C` + white
- **Typography**: Inter (body) + Space Grotesk (headings/numbers)
- **Style**: Glassmorphism cards, animated transitions (Framer Motion)

---

## ⚠️ Out of Scope (Future Work — Noted in Code)

- Real fiat on/off ramps, KYC, or banking rails
- Trained AI/ML model (Risk Monitor is a UI prototype — see `RiskMonitor.tsx` comments)
- Mainnet deployment or real-money custody
- Liquidation engine for undercollateralised positions
- Governance / DAO for parameter changes

---

## 🔧 Troubleshooting

**MetaMask shows wrong network** → Switch to `localhost:8545` (chainId 31337) in MetaMask settings.

**"Nonce too high" error** → In MetaMask, go to Settings → Advanced → Reset Account.

**Contract not found** → Make sure you ran `deploy.ts` and the frontend reloaded `addresses.json`.

**RPC error during demo** → Switch to local Hardhat node (`http://127.0.0.1:8545`) in MetaMask.
