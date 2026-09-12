import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";

const FLOAT_SYMBOLS = ["₹", "₹", "◈", "✦", "₹", "◉", "₹", "✦", "₹"];

export default function Landing() {
  const { isConnected } = useDemoAccount();
  const { enableDemo } = useDemoContext();
  const navigate = useNavigate();

  // Auto-redirect after connect or demo activation
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
        background: "linear-gradient(135deg, #020810 0%, #0B1F3A 50%, #020810 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient floating rupee symbols */}
      {FLOAT_SYMBOLS.map((sym, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.02, 0.06, 0.02],
            y: [0, -30, 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${8 + i * 11}%`,
            top: `${10 + (i % 4) * 20}%`,
            fontSize: 80 + (i % 3) * 40,
            color: "#C9A84C",
            fontWeight: 900,
            userSelect: "none",
            pointerEvents: "none",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {sym}
        </motion.div>
      ))}

      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ textAlign: "center", zIndex: 10, maxWidth: 560, padding: "0 24px" }}
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #C9A84C 0%, #e8d48e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 900,
            color: "#060d1a",
            margin: "0 auto 24px",
            boxShadow: "0 0 60px rgba(201,168,76,0.4)",
          }}
        >
          ₹
        </motion.div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 12,
            background: "linear-gradient(135deg, #C9A84C 0%, #e8d48e 40%, #C9A84C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LiquidRS
        </h1>

        <p
          style={{
            fontSize: 13,
            letterSpacing: "3px",
            fontWeight: 700,
            color: "#10b981",
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          ● UPI 2.0 DIGITAL RUPEE PROTOCOL
        </p>

        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            marginBottom: 36,
            lineHeight: 1.6,
            maxWidth: 440,
            margin: "0 auto 36px",
          }}
        >
          Instant ₹ transfers to any UPI ID or phone number, 100% backed by
          digital reserves on global rails.
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 36,
            flexWrap: "wrap",
          }}
        >
          {[
            "⚡ Instant UPI (<1s)",
            "🛡️ 150% Reserve Backed",
            "🤖 AI Peg Defense",
          ].map((feat) => (
            <span
              key={feat}
              style={{
                padding: "7px 14px",
                borderRadius: 100,
                border: "1px solid rgba(201,168,76,0.25)",
                background: "rgba(201,168,76,0.06)",
                fontSize: 12,
                color: "rgba(201,168,76,0.9)",
                fontWeight: 600,
              }}
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: "100%",
          }}
        >
          {/* Primary Pitch Button: One-click demo launch */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(201,168,76,0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLaunchDemo}
            style={{
              width: "100%",
              maxWidth: 380,
              padding: "16px 28px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #C9A84C 0%, #f3e5ab 50%, #C9A84C 100%)",
              color: "#060d1a",
              fontWeight: 800,
              fontSize: 16,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 0 25px rgba(201,168,76,0.3)",
              letterSpacing: "0.2px",
            }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
            <span>Launch Live Demo (No Wallet Needed)</span>
          </motion.button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              maxWidth: 380,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.15)" }} />
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              or connect web3
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.15)" }} />
          </div>

          {/* Secondary: Standard Wallet Connect */}
          <ConnectButton label="Connect MetaMask / Wallet" showBalance={false} />
        </div>

        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Pre-seeded with 10,000 USDT for instant live presentation · Zero latency
        </p>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: "absolute",
          bottom: 24,
          display: "flex",
          gap: 32,
          color: "var(--text-muted)",
          fontSize: 12,
        }}
      >
        <span>Built with Solidity + React</span>
        <span>·</span>
        <span>Hackathon Demo 2024</span>
        <span>·</span>
        <span>LRS = ₹1.00</span>
      </motion.div>
    </div>
  );
}
