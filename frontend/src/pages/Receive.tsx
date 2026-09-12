import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useDemoAccount } from "../hooks/useContracts";

export default function Receive() {
  const { address } = useDemoAccount();
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false);

  const upiId = "yasharth@liquidrs";
  const effectiveAddress = address ?? "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  // Standard UPI URI format
  const upiUri = customAmount
    ? `upi://pay?pa=${upiId}&pn=Yasharth&am=${customAmount}&cu=INR&tr=${effectiveAddress}`
    : `upi://pay?pa=${upiId}&pn=Yasharth&cu=INR&tr=${effectiveAddress}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied: " + upiId, { icon: "📋" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(effectiveAddress);
    toast.success("EVM address copied!", { icon: "📋" });
  };

  return (
    <div className="page-container" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>
          Receive Money
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          Scan to pay with any UPI app (GPay, PhonePe, Paytm, Navi)
        </p>
      </div>

      {/* ── Standee Card (Paytm / PhonePe Style) ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fintech-card"
        style={{
          padding: "28px 24px",
          textAlign: "center",
          borderRadius: 24,
          background: "linear-gradient(180deg, #131A2B 0%, #0F1424 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* UPI Header Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(0, 229, 117, 0.12)",
            border: "1px solid rgba(0, 229, 117, 0.3)",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 14 }}>🇮🇳</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#00E575", letterSpacing: "0.5px" }}>
            BHARAT UPI · LIQUIDRS
          </span>
        </div>

        {/* QR Code */}
        <div
          style={{
            display: "inline-block",
            padding: 18,
            background: "#FFFFFF",
            borderRadius: 20,
            marginBottom: 16,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          }}
        >
          <QRCodeSVG
            value={upiUri}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#0A0D15"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Name & UPI ID badge */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
            Yasharth
          </div>
          <div
            onClick={handleCopyUpiId}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
              padding: "4px 12px",
              borderRadius: 20,
              background: "var(--surface-2)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 12, color: "#00E575", fontFamily: "monospace", fontWeight: 700 }}>
              {upiId}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {copied ? "Copied! ✓" : "📋"}
            </span>
          </div>
        </div>

        {/* Custom Amount Collector */}
        {customAmount ? (
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              background: "rgba(0, 229, 117, 0.1)",
              border: "1px solid rgba(0, 229, 117, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: "#00E575" }}>
              Requesting ₹{customAmount}
            </span>
            <button
              onClick={() => {
                setCustomAmount("");
                setShowAmountInput(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✕
            </button>
          </div>
        ) : showAmountInput ? (
          <div style={{ display: "flex", gap: 8, maxWidth: 300, margin: "0 auto 16px" }}>
            <input
              type="number"
              placeholder="Amount to collect (₹)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="input-field"
              style={{ padding: "8px 12px", fontSize: 14 }}
              autoFocus
            />
            <button
              className="btn-secondary"
              onClick={() => setShowAmountInput(false)}
              style={{ padding: "8px 12px", fontSize: 12 }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setShowAmountInput(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#00E575",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Set Specific Amount to Collect
            </button>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            onClick={handleCopyUpiId}
            style={{ flex: 1, padding: "12px", fontSize: 13, borderRadius: 12 }}
          >
            <span>📋</span>
            <span>{copied ? "Copied!" : "Copy UPI ID"}</span>
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Pay via UPI", text: `Pay Yasharth on UPI: ${upiId}`, url: upiUri }).catch(() => {});
              } else {
                handleCopyUpiId();
              }
            }}
            style={{ flex: 1, padding: "12px", fontSize: 13, borderRadius: 12 }}
          >
            <span>📤</span>
            <span>Share QR</span>
          </button>
        </div>

        {/* Under-the-hood EVM details (for judges) */}
        <details
          style={{
            marginTop: 18,
            textAlign: "left",
            fontSize: 11,
            color: "var(--text-muted)",
            background: "var(--surface-2)",
            borderRadius: 10,
            padding: "8px 12px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <summary style={{ cursor: "pointer", color: "var(--text-secondary)", fontWeight: 600 }}>
            ⚡ Underlying EVM Smart Contract Address
          </summary>
          <div
            onClick={handleCopyAddress}
            style={{
              marginTop: 6,
              fontFamily: "monospace",
              fontSize: 10,
              wordBreak: "break-all",
              color: "#60A5FA",
              cursor: "pointer",
            }}
          >
            {effectiveAddress} 📋
          </div>
        </details>
      </motion.div>
    </div>
  );
}
