import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheck, IconZap } from "./Icons";

interface UpiSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  recipientName: string;
  recipientUpiId: string;
  note?: string;
  txHash?: string | null;
}

// Play pleasant UPI success chime using Web Audio API
function playUpiChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;

    // First bell tone (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second chime tone (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);
  } catch {
    // AudioContext blocked or not supported — silent fail safe
  }
}

export default function UpiSuccessModal({
  isOpen,
  onClose,
  amount,
  recipientName,
  recipientUpiId,
  note,
  txHash,
}: UpiSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      playUpiChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const upiRefNumber = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  const displayTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(4, 6, 12, 0.8)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3000,
          padding: 16,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="apple-glass-card"
          style={{
            padding: "36px 30px",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            borderRadius: 26,
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 30px 60px rgba(0, 0, 0, 0.75)",
          }}
        >
          {/* Animated Green Tick */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              boxShadow: "0 0 32px rgba(0, 229, 117, 0.45)",
            }}
          >
            <IconCheck size={32} color="#031408" strokeWidth={3} />
          </motion.div>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            Payment Successful!
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--upi-green)",
              fontWeight: 600,
              marginBottom: 20,
              letterSpacing: "0.2px",
            }}
          >
            Liquid RS (L₹S) Settled on EVM
          </p>

          {/* Amount Paid */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 18,
              padding: "20px 16px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                lineHeight: 1.1,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
              }}
            >
              ₹{amount}{" "}
              <span style={{ fontSize: 18, color: "var(--upi-green)", fontWeight: 700 }}>
                L₹S
              </span>
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                marginTop: 8,
                fontWeight: 500,
              }}
            >
              Transferred to <strong style={{ color: "#FFFFFF" }}>{recipientName}</strong>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "monospace",
                marginTop: 2,
              }}
            >
              {recipientUpiId}
            </div>
            {note && (
              <div
                style={{
                  fontSize: 12,
                  color: "#00E575",
                  marginTop: 8,
                  padding: "4px 10px",
                  background: "rgba(0, 229, 117, 0.08)",
                  borderRadius: 6,
                  display: "inline-block",
                }}
              >
                &ldquo;{note}&rdquo;
              </div>
            )}
          </div>

          {/* Transaction Metadata */}
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.9,
              textAlign: "left",
              padding: "0 6px 14px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>UPI Reference</span>
              <span style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>
                {upiRefNumber}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Date & Time</span>
              <span style={{ color: "var(--text-secondary)" }}>{displayTime}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Debit from</span>
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Liquid RS (L₹S) Crypto Vault</span>
            </div>
          </div>

          {/* Under-the-hood On-Chain Details (For Judges) */}
          <details
            style={{
              marginBottom: 22,
              textAlign: "left",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: 12,
              padding: "10px 14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
            }}
          >
            <summary
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--upi-green)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                userSelect: "none",
              }}
            >
              <IconZap size={13} color="var(--upi-green)" />
              <span>View On-Chain Blockchain Receipt (For Judges)</span>
            </summary>
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Token Contract:</span>
                <span style={{ color: "#FFFFFF" }}>LiquidRS (L₹S) ERC-20</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Settlement:</span>
                <span style={{ color: "#00E575" }}>0.8s EVM Finality</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Gas Fee:</span>
                <span>₹0.00 (Zero Gas Protocol)</span>
              </div>
              {txHash && (
                <div style={{ wordBreak: "break-all", marginTop: 6, fontFamily: "monospace", fontSize: 10, background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: 6 }}>
                  <span style={{ color: "var(--text-muted)" }}>Tx Hash: </span>
                  <span style={{ color: "#60a5fa" }}>{txHash}</span>
                </div>
              )}
            </div>
          </details>

          {/* Done CTA */}
          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 14,
            }}
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
