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
    <div className="page-container" style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
          Withdraw Money
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          Instant zero-penalty redemption back to your USD reserves
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fintech-card"
            style={{ padding: 32, textAlign: "center" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                color: "#05140A",
                margin: "0 auto 16px",
                boxShadow: "0 4px 20px var(--upi-green-glow)",
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#FFFFFF" }}>
              Withdrawal Successful!
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              ${redeemedUSDT} USDT has been returned to your reserve account.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setSuccess(false);
                setLrsInput("");
              }}
              style={{ padding: "12px 28px", borderRadius: 14 }}
            >
              Make Another Withdrawal
            </button>
          </motion.div>
        ) : (
          <div className="fintech-card" style={{ padding: "24px" }}>
            {/* Balance banner */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 14,
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Available to Withdraw:
              </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#00E575" }}>
                ₹{formattedInr}
              </span>
            </div>

            {/* Destination Selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                Payout Destination
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🏦</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF" }}>
                      USDT Reserve Vault
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Instant Settlement · Zero Fee
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "#00E575", fontWeight: 800 }}>
                  CONNECTED ✓
                </span>
              </div>
            </div>

            {/* Amount input */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                Amount to Cash Out (₹)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#00E575" }}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={lrsInput}
                  onChange={(e) => setLrsInput(e.target.value)}
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

              {Boolean(lrsBalance && lrsBalance > 0n) && (
                <button
                  type="button"
                  onClick={() => setLrsInput((Number(lrsBalance! / 10n ** 18n)).toString())}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#00E575",
                    fontSize: 12,
                    fontWeight: 700,
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
                padding: "16px 18px",
                borderRadius: 14,
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                You will receive in USD:
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#FFFFFF",
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
                fontWeight: 800,
                borderRadius: 14,
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
