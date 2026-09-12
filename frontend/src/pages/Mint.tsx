import { useState } from "react";
import toast from "react-hot-toast";
import {
  useLRSBalance,
  useUSDTBalance,
  useVaultState,
  usePreviewMint,
  useMint,
  parseUSDT,
  formatLRS,
  formatUSDT,
} from "../hooks/useContracts";
import TxButton from "../components/TxButton";

const USD_PRESETS = ["50", "100", "250", "500"];

export default function Mint() {
  const [collateralInput, setCollateralInput] = useState("100");
  const [approvedAmount, setApprovedAmount] = useState<bigint>(0n);

  const { data: lrsBalance, refetch: refetchLRS } = useLRSBalance();
  const { data: usdtBalance, refetch: refetchUSDT } = useUSDTBalance();
  const { pegPrice } = useVaultState();
  const { data: previewAmount } = usePreviewMint(collateralInput);
  const { approve, lockAndMint } = useMint();

  const collateralBigInt = parseUSDT(collateralInput);
  const hasApproval = approvedAmount >= collateralBigInt && collateralBigInt > 0n;

  const pegDisplay = pegPrice
    ? `₹${(Number(pegPrice) / 100).toFixed(2)}`
    : "₹83.00";

  const handleApprove = async () => {
    if (collateralBigInt === 0n) return;
    const hash = await approve(collateralBigInt);
    setApprovedAmount(collateralBigInt);
    toast.success("Deposit authorized!", { icon: "✓" });
    return hash;
  };

  const handleMint = async () => {
    if (collateralBigInt === 0n) return;
    const hash = await lockAndMint(collateralBigInt);
    await refetchLRS();
    await refetchUSDT();
    setCollateralInput("");
    setApprovedAmount(0n);
    toast.success(`₹${formatLRS(previewAmount)} added to your wallet!`, { icon: "✦" });
    return hash;
  };

  return (
    <div className="page-container" style={{ maxWidth: 580, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
          Add Money to Wallet
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          100% reserve-backed Liquid Rupee issuance
        </p>
      </div>

      {/* ── Available Balance Banner ────────────────────────────────────────── */}
      <div
        className="fintech-card"
        style={{
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--surface-1)",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Available USD Reserves
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>
            ${formatUSDT(usdtBalance)} USDT
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Guaranteed FX Peg
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#00E575", marginTop: 2 }}>
            1 USD = {pegDisplay}
          </div>
        </div>
      </div>

      {/* ── Deposit Amount Input Card ───────────────────────────────────────── */}
      <div className="fintech-card" style={{ padding: "24px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
          Deposit Amount (USDT)
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#00E575" }}>$</span>
          <input
            type="number"
            placeholder="0"
            value={collateralInput}
            onChange={(e) => setCollateralInput(e.target.value)}
            style={{
              fontSize: 36,
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {USD_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCollateralInput(preset)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: collateralInput === preset ? "rgba(0, 229, 117, 0.2)" : "var(--surface-2)",
                border: collateralInput === preset ? "1px solid #00E575" : "1px solid var(--border-subtle)",
                color: collateralInput === preset ? "#00E575" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ${preset}
            </button>
          ))}
        </div>

        {/* Instant Conversion Preview Box */}
        <div
          style={{
            padding: "16px 18px",
            background: "var(--surface-2)",
            borderRadius: 16,
            border: "1px solid var(--border-subtle)",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            You will receive in Liquid Rupee wallet:
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#00E575",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginTop: 4,
            }}
          >
            ₹{formatLRS(previewAmount)}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Backed at 150% reserve ratio · 1 LRS = ₹1.00
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", gap: 12 }}>
          {!hasApproval ? (
            <TxButton
              label="Authorize Deposit"
              onClick={handleApprove}
              disabled={collateralBigInt === 0n}
              style={{ width: "100%", padding: "14px", borderRadius: 14 }}
            />
          ) : (
            <TxButton
              label="Add ₹ to Wallet"
              onClick={handleMint}
              disabled={collateralBigInt === 0n}
              style={{ width: "100%", padding: "14px", borderRadius: 14 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
