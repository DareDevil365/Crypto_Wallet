import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          background: "rgba(2, 8, 16, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3000,
          padding: 16,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(180deg, #0B1F3A 0%, #060D1A 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 24,
            padding: "36px 32px",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(16, 185, 129, 0.15)",
          }}
        >
          {/* Animated Green Tick */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: 4,
            }}
          >
            Payment Successful!
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#10b981",
              fontWeight: 600,
              marginBottom: 20,
              letterSpacing: "0.3px",
            }}
          >
            Instant UPI Settlement Confirmed
          </p>

          {/* Amount Paid */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "20px 16px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#f0f4ff",
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.1,
              }}
            >
              ₹{amount}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                marginTop: 8,
                fontWeight: 500,
              }}
            >
              Paid to <strong style={{ color: "#ffffff" }}>{recipientName}</strong>
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
                  color: "#C9A84C",
                  marginTop: 8,
                  padding: "4px 10px",
                  background: "rgba(201, 168, 76, 0.08)",
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
              lineHeight: 1.8,
              textAlign: "left",
              padding: "0 8px 16px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
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
              <span style={{ color: "var(--text-secondary)" }}>Liquid Rupee Wallet</span>
            </div>
          </div>

          {/* Under-the-hood On-Chain Details (For Judges) */}
          <details
            style={{
              marginBottom: 24,
              textAlign: "left",
              background: "rgba(6, 13, 26, 0.6)",
              borderRadius: 10,
              padding: "8px 12px",
              border: "1px solid rgba(201, 168, 76, 0.15)",
              cursor: "pointer",
            }}
          >
            <summary
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#C9A84C",
                display: "flex",
                alignItems: "center",
                gap: 6,
                userSelect: "none",
              }}
            >
              <span>⚡ View On-Chain Blockchain Receipt (For Judges)</span>
            </summary>
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Network:</span>
                <span>EVM Layer 2 / Local</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Settlement:</span>
                <span style={{ color: "#10b981" }}>0.8s Finality</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Gas Fee:</span>
                <span>₹0.00 (Gasless Meta-Tx)</span>
              </div>
              {txHash && (
                <div style={{ wordBreak: "break-all", marginTop: 4, fontFamily: "monospace", fontSize: 10 }}>
                  <span style={{ color: "var(--text-muted)" }}>Hash: </span>
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
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              color: "#ffffff",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
