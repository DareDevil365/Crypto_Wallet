import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";
import { IconZap, IconShield, IconCheck } from "../components/Icons";

const FLOAT_SYMBOLS = ["₹", "L₹", "₹", "L₹S", "₹", "L₹", "₹"];

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
        background: "radial-gradient(ellipse at top, #0F1626 0%, #080A10 60%, #05060A 100%)",
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
            opacity: [0.02, 0.06, 0.02],
            y: [0, -25, 0],
            rotate: [0, i % 2 === 0 ? 6 : -6, 0],
          }}
          transition={{
            duration: 5 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${10 + i * 13}%`,
            top: `${14 + (i % 4) * 20}%`,
            fontSize: 60 + (i % 3) * 30,
            color: "#00E575",
            fontWeight: 900,
            userSelect: "none",
            pointerEvents: "none",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          }}
        >
          {sym}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="apple-glass-card"
        style={{
          textAlign: "center",
          zIndex: 10,
          maxWidth: 520,
          width: "100%",
          padding: "44px 36px",
          borderRadius: 32,
        }}
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 900,
            color: "#031408",
            margin: "0 auto 20px",
            boxShadow: "0 10px 30px rgba(0, 229, 117, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
          }}
        >
          ₹
        </motion.div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', sans-serif",
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            marginBottom: 6,
            color: "#FFFFFF",
          }}
        >
          Liquid<span style={{ color: "#00E575" }}>RS</span>
          <span style={{ fontSize: 20, color: "var(--text-muted)", marginLeft: 6, fontWeight: 700 }}>
            (L₹S)
          </span>
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 20,
            background: "rgba(0, 229, 117, 0.12)",
            border: "1px solid rgba(0, 229, 117, 0.28)",
            fontSize: 11,
            fontWeight: 800,
            color: "#00E575",
            letterSpacing: "0.06em",
            marginBottom: 16,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E575" }} />
          <span>INR-PEGGED STABLE CRYPTOCURRENCY</span>
        </div>

        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            marginBottom: 24,
            lineHeight: 1.6,
            maxWidth: 420,
            margin: "0 auto 26px",
          }}
        >
          Replacing legacy fiat with programmable, 100% reserve-backed Liquid Rupee <strong>(L₹S)</strong>. Sub-second finality over UPI rails with zero gas friction.
        </p>

        {/* Feature badges */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { label: "1 L₹S = ₹1.00 Pegged" },
            { label: "150% Over-Collateralized" },
            { label: "Sub-Second UPI Finality" },
          ].map((feat) => (
            <span
              key={feat.label}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: 11,
                color: "var(--text-primary)",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {feat.label}
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
              fontSize: 15,
              borderRadius: 16,
              gap: 8,
            }}
          >
            <IconZap size={16} />
            <span>Launch Liquid RS (Instant Demo)</span>
          </motion.button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 380 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.08)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              or connect web3 wallet
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.08)" }} />
          </div>

          <ConnectButton label="Connect Web3 Wallet" showBalance={false} />
        </div>
      </motion.div>
    </div>
  );
}
