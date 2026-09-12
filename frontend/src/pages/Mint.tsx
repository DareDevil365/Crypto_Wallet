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
import { PageHeader } from "../components/TxButton";
import TxButton from "../components/TxButton";

const USD_PRESETS = ["50", "100", "250", "500"];

export default function Mint() {
  const [collateralInput, setCollateralInput] = useState("");
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
    <div className="page-container" style={{ maxWidth: 640 }}>
      <PageHeader
        title="Add Money"
        subtitle="Top up your Liquid Rupee (₹) wallet backed 100% by digital reserves"
      />

      {/* Available reserve funds */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          border: "1px solid rgba(201, 168, 76, 0.2)",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Available USD Reserves
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
            ${formatUSDT(usdtBalance)} USDT
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Exchange Peg
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>
            1 USD = {pegDisplay}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: "28px 32px" }}>
        {/* Input amount */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 8,
            }}
          >
            Amount to Deposit (USDT)
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 22,
                fontWeight: 800,
                color: "#C9A84C",
              }}
            >
              $
            </span>
            <input
              className="input-field"
              type="number"
              placeholder="100.00"
              value={collateralInput}
              onChange={(e) => setCollateralInput(e.target.value)}
              style={{
                paddingLeft: 40,
                fontSize: 24,
                fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
          </div>

          {/* Quick USD presets */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {USD_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCollateralInput(preset)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  background:
                    collateralInput === preset
                      ? "rgba(201, 168, 76, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                  border:
                    collateralInput === preset
                      ? "1px solid #C9A84C"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  color: collateralInput === preset ? "#C9A84C" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {/* You receive preview */}
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(6, 13, 26, 0.6)",
            borderRadius: 14,
            border: "1px solid rgba(201, 168, 76, 0.15)",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            You will receive in wallet:
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#10b981",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ₹{formatLRS(previewAmount)}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Backed at 150% collateral safety ratio · 1 LRS = ₹1.00
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          {!hasApproval ? (
            <TxButton
              label="Authorize Deposit"
              onClick={handleApprove}
              disabled={collateralBigInt === 0n}
              style={{ flex: 1, padding: "14px" }}
            />
          ) : (
            <TxButton
              label="Complete ₹ Top-Up"
              onClick={handleMint}
              disabled={collateralBigInt === 0n}
              style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
            />
          )}
        </div>

        {/* Backing explanation */}
        <div
          style={{
            marginTop: 20,
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          💡 <strong>How it works:</strong> Your USD is held safely in the LiquidRS smart reserve vault. For every $1 deposited at ₹83 peg, ₹55.33 is issued to ensure 150% over-collateralisation. You can withdraw your USD anytime.
        </div>
      </div>
    </div>
  );
}
