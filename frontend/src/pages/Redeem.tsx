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
import { IconBank, IconCheck, IconZap } from "../components/Icons";

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
    toast.success("Liquid RS (L₹S) redemption processed successfully!");
    return hash;
  };

  const formattedInr = formatLRS(lrsBalance);

  return (
    <div className="page-container" style={{ maxWidth: 560, margin: "0 auto" }}>
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
            SMART CONTRACT BURNING
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
          Redeem Liquid RS (L₹S)
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          Burn ₹-pegged crypto to unlock digital USD reserves at guaranteed parity
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="apple-glass-card"
            style={{ padding: 34, textAlign: "center", borderRadius: 24 }}
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
                margin: "0 auto 16px",
                boxShadow: "0 0 30px rgba(0, 229, 117, 0.4)",
              }}
            >
              <IconCheck size={32} color="#031408" strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Redemption Successful!
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              ${redeemedUSDT} USDT has been credited back to your USD reserves.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setSuccess(false);
                setLrsInput("");
              }}
              style={{ padding: "12px 28px", borderRadius: 14 }}
            >
              Make Another Redemption
            </button>
          </motion.div>
        ) : (
          <div className="apple-glass-card" style={{ padding: "26px 22px" }}>
            {/* Balance banner */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Available Liquid RS (L₹S):
              </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#00E575", fontVariantNumeric: "tabular-nums" }}>
                ₹{formattedInr} L₹S
              </span>
            </div>

            {/* Destination Selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Payout Destination
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(0, 229, 117, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconBank size={18} color="var(--upi-green)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
                      USDT Reserve Vault
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Instant Smart Contract Settlement · Zero Slippage
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#00E575",
                    fontWeight: 700,
                    background: "rgba(0, 229, 117, 0.1)",
                    padding: "3px 8px",
                    borderRadius: 20,
                  }}
                >
                  <IconCheck size={11} color="#00E575" strokeWidth={2.5} />
                  <span>Connected</span>
                </div>
              </div>
            </div>

            {/* Amount input */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Amount to Burn in L₹S (₹)
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#00E575" }}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={lrsInput}
                  onChange={(e) => setLrsInput(e.target.value)}
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
                  Withdraw Maximum (₹{formattedInr} L₹S)
                </button>
              )}
            </div>

            {/* Output estimation */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                You will receive in USD Reserves:
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  marginTop: 3,
                }}
              >
                ${previewUSDT ? formatUSDT(previewUSDT) : "0.00"} USDT
              </div>
            </div>

            {/* Confirm button */}
            <TxButton
              label={lrsInput ? `Redeem ₹${lrsInput} L₹S` : "Enter Amount to Redeem"}
              onClick={handleRedeem}
              disabled={!canRedeem}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 14,
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
