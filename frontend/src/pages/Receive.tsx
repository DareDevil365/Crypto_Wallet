import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useDemoAccount } from "../hooks/useContracts";
import { PageHeader } from "../components/TxButton";

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
    toast.success("Wallet address copied!", { icon: "📋" });
  };

  return (
    <div className="page-container" style={{ maxWidth: 520 }}>
      <PageHeader
        title="Receive Money"
        subtitle="Share your personal UPI QR or UPI ID to get paid instantly"
      />

      <div
        className="glass-card"
        style={{
          padding: "32px 28px",
          textAlign: "center",
          borderRadius: 24,
          position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.1)",
        }}
      >
        {/* UPI Standee Header */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(201, 168, 76, 0.12)",
            border: "1px solid rgba(201, 168, 76, 0.3)",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 13 }}>🇮🇳</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#C9A84C",
              letterSpacing: "0.5px",
            }}
          >
            LIQUIDRS UPI QR
          </span>
        </div>

        {/* QR Code Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "inline-block",
            padding: 20,
            background: "#ffffff",
            borderRadius: 20,
            marginBottom: 20,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          <QRCodeSVG
            value={upiUri}
            size={220}
            bgColor="#ffffff"
            fgColor="#0B1F3A"
            level="H"
            includeMargin={false}
          />
        </motion.div>

        {/* QR Amount tag if set */}
        {customAmount && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#10b981",
              marginBottom: 16,
            }}
          >
            Requesting ₹{customAmount}
          </div>
        )}

        {/* UPI ID Pill with Copy */}
        <div
          onClick={handleCopyUpiId}
          style={{
            padding: "14px 18px",
            background: "rgba(6, 13, 26, 0.7)",
            borderRadius: 12,
            border: "1px solid rgba(201, 168, 76, 0.25)",
            marginBottom: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Your UPI ID
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", fontFamily: "monospace" }}>
              {upiId}
            </div>
          </div>
          <button
            type="button"
            style={{
              background: copied ? "#10b981" : "rgba(201, 168, 76, 0.15)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              color: copied ? "#ffffff" : "#C9A84C",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {copied ? "Copied! ✓" : "Copy"}
          </button>
        </div>

        {/* Set Specific Amount Toggle */}
        <div style={{ marginBottom: 20 }}>
          {!showAmountInput ? (
            <button
              type="button"
              onClick={() => setShowAmountInput(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#C9A84C",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Set specific amount to collect
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                placeholder="Enter amount (₹)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="input-field"
                style={{ flex: 1, padding: "8px 12px" }}
              />
              <button
                type="button"
                onClick={() => {
                  setShowAmountInput(false);
                  setCustomAmount("");
                }}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  color: "var(--text-secondary)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Underlying on-chain address link */}
        <details
          style={{
            textAlign: "left",
            fontSize: 11,
            color: "var(--text-muted)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 8,
            padding: "8px 12px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <summary style={{ cursor: "pointer", color: "var(--text-secondary)" }}>
            View underlying EVM blockchain address
          </summary>
          <div
            onClick={handleCopyAddress}
            style={{
              marginTop: 6,
              fontFamily: "monospace",
              fontSize: 10,
              wordBreak: "break-all",
              color: "#60a5fa",
              cursor: "pointer",
            }}
          >
            {effectiveAddress} 📋
          </div>
        </details>
      </div>
    </div>
  );
}
