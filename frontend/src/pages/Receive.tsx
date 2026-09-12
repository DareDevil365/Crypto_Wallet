import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useDemoAccount } from "../hooks/useContracts";
import { IconCopy, IconCheck, IconShare, IconZap, IconQrCode } from "../components/Icons";

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
    toast.success("UPI ID copied: " + upiId);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(effectiveAddress);
    toast.success("EVM address copied!");
  };

  return (
    <div className="page-container" style={{ maxWidth: 460, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
            padding: "3px 10px",
            borderRadius: 20,
            background: "rgba(0, 229, 117, 0.1)",
            border: "1px solid rgba(0, 229, 117, 0.25)",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--upi-green)", letterSpacing: "0.06em" }}>
            LIQUID RS · L₹S CRYPTO QR
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
          Receive Liquid RS (L₹S)
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          Accept ₹-pegged crypto instantly via any UPI app or EVM wallet
        </p>
      </div>

      {/* ── Standee Card (Apple Frosted Glass) ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="apple-glass-card"
        style={{
          padding: "28px 24px",
          textAlign: "center",
          borderRadius: 24,
        }}
      >
        {/* UPI Protocol Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 20,
            background: "rgba(0, 229, 117, 0.12)",
            border: "1px solid rgba(0, 229, 117, 0.3)",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00E575",
              boxShadow: "0 0 8px #00E575",
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#00E575", letterSpacing: "0.06em" }}>
            BHARAT UPI · 1 L₹S = ₹1.00
          </span>
        </div>

        {/* QR Code Container */}
        <div
          style={{
            display: "inline-block",
            padding: 16,
            background: "#FFFFFF",
            borderRadius: 20,
            marginBottom: 16,
            boxShadow: "0 14px 35px rgba(0, 0, 0, 0.45)",
          }}
        >
          <QRCodeSVG
            value={upiUri}
            size={210}
            bgColor="#FFFFFF"
            fgColor="#080A10"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Name & UPI ID badge */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
            Yasharth
          </div>
          <div
            onClick={handleCopyUpiId}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 5,
              padding: "5px 12px",
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--upi-green)", fontFamily: "monospace", fontWeight: 700 }}>
              {upiId}
            </span>
            {copied ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#00E575", fontWeight: 700 }}>
                <IconCheck size={12} color="#00E575" strokeWidth={2.5} /> Copied
              </span>
            ) : (
              <IconCopy size={12} color="var(--text-muted)" />
            )}
          </div>
        </div>

        {/* Custom Amount Collector */}
        {customAmount ? (
          <div
            style={{
              padding: "7px 14px",
              borderRadius: 12,
              background: "rgba(0, 229, 117, 0.1)",
              border: "1px solid rgba(0, 229, 117, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: "#00E575" }}>
              Requesting ₹{customAmount} L₹S
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
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ) : showAmountInput ? (
          <div style={{ display: "flex", gap: 8, maxWidth: 300, margin: "0 auto 16px" }}>
            <input
              type="number"
              placeholder="Amount in L₹S (₹)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="input-field"
              style={{ padding: "8px 12px", fontSize: 13 }}
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
            style={{ flex: 1, padding: "12px", fontSize: 13, borderRadius: 14, gap: 6 }}
          >
            {copied ? <IconCheck size={14} strokeWidth={2.5} /> : <IconCopy size={14} />}
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
            style={{ flex: 1, padding: "12px", fontSize: 13, borderRadius: 14, gap: 6 }}
          >
            <IconShare size={14} />
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
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: 12,
            padding: "10px 14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <summary style={{ cursor: "pointer", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <IconZap size={13} color="var(--upi-green)" />
            <span>Underlying EVM Smart Contract Address</span>
          </summary>
          <div
            onClick={handleCopyAddress}
            style={{
              marginTop: 8,
              fontFamily: "monospace",
              fontSize: 10,
              wordBreak: "break-all",
              color: "#60A5FA",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span>{effectiveAddress}</span>
            <IconCopy size={11} color="#60A5FA" />
          </div>
        </details>
      </motion.div>
    </div>
  );
}
