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
import { IconPlus, IconCheck, IconShield } from "../components/Icons";

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
    toast.success("USD collateral deposit authorized");
    return hash;
  };

  const handleMint = async () => {
    if (collateralBigInt === 0n) return;
    const hash = await lockAndMint(collateralBigInt);
    await refetchLRS();
    await refetchUSDT();
    setCollateralInput("");
    setApprovedAmount(0n);
    toast.success(`₹${formatLRS(previewAmount)} L₹S minted to your wallet!`);
    return hash;
  };

  return (
    <div className="page-container" style={{ maxWidth: 560, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: "var(--upi-green)",
              background: "rgba(0, 229, 117, 0.1)",
              border: "1px solid rgba(0, 229, 117, 0.25)",
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            SMART CONTRACT ISSUANCE
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
          Mint Liquid RS (L₹S)
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          Lock digital USD reserves to mint 100% backed INR-pegged cryptocurrency
        </p>
      </div>

      {/* ── Available Balance Banner (Apple Glass) ────────────────────────────────────────── */}
      <div
        className="apple-glass-card"
        style={{
          padding: "16px 20px",
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Available USD Reserves
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#FFFFFF", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
            ${formatUSDT(usdtBalance)} USDT
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Guaranteed FX Peg
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#00E575", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
            1 USD = {pegDisplay}
          </div>
        </div>
      </div>

      {/* ── Deposit Amount Input Card (Apple Glass) ───────────────────────────────────────── */}
      <div className="apple-glass-card" style={{ padding: "26px 22px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Collateral Deposit (USDT)
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#00E575" }}>$</span>
          <input
            type="number"
            placeholder="0"
            value={collateralInput}
            onChange={(e) => setCollateralInput(e.target.value)}
            style={{
              fontSize: 44,
              fontWeight: 800,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontVariantNumeric: "tabular-nums",
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              outline: "none",
              width: "100%",
              letterSpacing: "-0.03em",
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
              className="btn-pill"
              style={{
                background: collateralInput === preset ? "rgba(0, 229, 117, 0.16)" : "rgba(255, 255, 255, 0.04)",
                borderColor: collateralInput === preset ? "#00E575" : "rgba(255, 255, 255, 0.08)",
                color: collateralInput === preset ? "#00E575" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: 12,
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
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            You will mint in Liquid RS (L₹S) cryptocurrency:
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#00E575",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.03em",
              marginTop: 4,
            }}
          >
            ₹{formatLRS(previewAmount)}{" "}
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>L₹S</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Backed at 150% reserve ratio · 1 L₹S = ₹1.00 Pegged
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", gap: 12 }}>
          {!hasApproval ? (
            <TxButton
              label="Authorize USDT Collateral"
              onClick={handleApprove}
              disabled={collateralBigInt === 0n}
              style={{ width: "100%", padding: "14px", borderRadius: 14 }}
            />
          ) : (
            <TxButton
              label="Mint Liquid RS (L₹S)"
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
