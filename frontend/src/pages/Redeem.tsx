import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  useLRSBalance,
  useUSDTBalance,
  useUserPosition,
  usePreviewRedeem,
  useRedeem,
  useDemoAccount,
  parseLRS,
  formatLRS,
  formatUSDT,
} from "../hooks/useContracts";
import { PageHeader } from "../components/TxButton";
import TxButton from "../components/TxButton";

export default function Redeem() {
  const [lrsInput, setLrsInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [redeemedUSDT, setRedeemedUSDT] = useState<string | null>(null);

  const { address } = useDemoAccount();
  const { data: lrsBalance, refetch: refetchLRS } = useLRSBalance();
  const { data: usdtBalance, refetch: refetchUSDT } = useUSDTBalance();
  const { lrsMinted, collateral } = useUserPosition();
  const { data: previewUSDT } = usePreviewRedeem(lrsInput);
  const { burnAndRedeem } = useRedeem();

  const lrsBigInt = parseLRS(lrsInput);
  const canRedeem =
    lrsBigInt > 0n &&
    lrsBalance !== undefined &&
    lrsBigInt <= lrsBalance;

  const handleRedeem = async () => {
    if (!canRedeem) return;
    const previewBefore = previewUSDT;
    const hash = await burnAndRedeem(lrsBigInt);
    await refetchLRS();
    await refetchUSDT();
    setRedeemedUSDT(previewBefore ? formatUSDT(previewBefore) : "–");
    setSuccess(true);
    toast.success("Withdrawal processed successfully!", { icon: "🏦" });
    return hash;
  };

  const formattedInr = formatLRS(lrsBalance);

  return (
    <div style={{ padding: "36px 40px", maxWidth: 580 }}>
      <PageHeader
        title="Withdraw Money"
        subtitle="Cash out your Liquid Rupee (₹) back to USD or bank account"
      />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ padding: 32, textAlign: "center" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                margin: "0 auto 16px",
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#ffffff" }}>
              Withdrawal Completed!
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              ${redeemedUSDT} USDT has been credited back to your reserve account.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setSuccess(false);
                setLrsInput("");
              }}
              style={{ padding: "12px 28px" }}
            >
              Make Another Withdrawal
            </button>
          </motion.div>
        ) : (
          <div className="glass-card" style={{ padding: "28px 32px" }}>
            {/* Balance banner */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                background: "rgba(201, 168, 76, 0.08)",
                border: "1px solid rgba(201, 168, 76, 0.2)",
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Available to Withdraw:
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#C9A84C" }}>
                ₹{formattedInr}
              </span>
            </div>

            {/* Destination Selector */}
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
                Withdraw Destination
              </label>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(6, 13, 26, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🏦</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                      USD Digital Reserves (USDT)
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Instant Settlement · Zero Fee
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>
                  CONNECTED
                </span>
              </div>
            </div>

            {/* Amount input */}
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
                Amount to Withdraw (₹)
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
                  ₹
                </span>
                <input
                  className="input-field"
                  type="number"
                  placeholder="0.00"
                  value={lrsInput}
                  onChange={(e) => setLrsInput(e.target.value)}
                  style={{
                    paddingLeft: 42,
                    fontSize: 26,
                    fontWeight: 800,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                />
              </div>

              {Boolean(lrsBalance && lrsBalance > 0n) && (
                <button
                  type="button"
                  onClick={() => setLrsInput((Number(lrsBalance! / 10n ** 18n)).toString())}
                  style={{
                    marginTop: 8,
                    background: "none",
                    border: "none",
                    color: "#C9A84C",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Withdraw Maximum (₹{formattedInr})
                </button>
              )}
            </div>

            {/* Output estimation */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                background: "rgba(6, 13, 26, 0.6)",
                border: "1px solid rgba(201, 168, 76, 0.15)",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                You will receive in USD:
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffffff",
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginTop: 2,
                }}
              >
                ${previewUSDT ? formatUSDT(previewUSDT) : "0.00"} USDT
              </div>
            </div>

            {/* Confirm button */}
            <TxButton
              label={lrsInput ? `Withdraw ₹${lrsInput}` : "Enter Amount to Withdraw"}
              onClick={handleRedeem}
              disabled={!canRedeem}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: 15,
                fontWeight: 700,
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
