import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";

const FLOAT_SYMBOLS = ["₹", "₹", "⚡", "₹", "🛡️", "₹", "⚡", "₹"];

export default function Landing() {
  const { isConnected } = useDemoAccount();
  const { enableDemo } = useDemoContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) navigate("/dashboard");
  }, [isConnected, navigate]);

  const handleLaunchDemo = () => {
    enableDemo();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #111827 0%, #090C15 60%, #06080E 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      {/* Ambient floating symbols */}
      {FLOAT_SYMBOLS.map((sym, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
            y: [0, -25, 0],
            rotate: [0, i % 2 === 0 ? 8 : -8, 0],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${10 + i * 11}%`,
            top: `${12 + (i % 4) * 20}%`,
            fontSize: 70 + (i % 3) * 35,
            color: "#00E575",
            fontWeight: 900,
            userSelect: "none",
            pointerEvents: "none",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {sym}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ textAlign: "center", zIndex: 10, maxWidth: 540, width: "100%" }}
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: 76,
            height: 76,
            borderRadius: 24,
            background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 900,
            color: "#05140A",
            margin: "0 auto 20px",
            boxShadow: "0 10px 30px var(--upi-green-glow)",
          }}
        >
          ₹
        </motion.div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: "-1px",
            marginBottom: 8,
            color: "#FFFFFF",
          }}
        >
          Liquid<span style={{ color: "#00E575" }}>RS</span>
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 20,
            background: "rgba(0, 229, 117, 0.12)",
            border: "1px solid rgba(0, 229, 117, 0.3)",
            fontSize: 11,
            fontWeight: 800,
            color: "#00E575",
            letterSpacing: "0.8px",
            marginBottom: 16,
          }}
        >
          ● NEXT-GEN UPI 2.0 PROTOCOL
        </div>

        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            marginBottom: 28,
            lineHeight: 1.6,
            maxWidth: 420,
            margin: "0 auto 28px",
          }}
        >
          Instant ₹ UPI transfers with 100% digital USD reserves, sub-second finality, and zero gas friction.
        </p>

        {/* Feature badges */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
          {[
            "⚡ Instant UPI (<1s)",
            "🛡️ 150% Over-Collateralised",
            "🇮🇳 1 LRS = ₹1.00 Pegged",
          ].map((feat) => (
            <span
              key={feat}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: "var(--surface-1)",
                border: "1px solid var(--border-subtle)",
                fontSize: 12,
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Action button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLaunchDemo}
            className="btn-primary"
            style={{
              width: "100%",
              maxWidth: 380,
              padding: "16px 28px",
              fontSize: 16,
              borderRadius: 16,
            }}
          >
            <span>⚡</span>
            <span>Open UPI App (Instant Demo)</span>
          </motion.button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 380 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              or connect wallet
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          </div>

          <ConnectButton label="Connect Web3 Wallet" showBalance={false} />
        </div>
      </motion.div>
    </div>
  );
}
