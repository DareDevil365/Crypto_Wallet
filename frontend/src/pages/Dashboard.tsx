import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useLRSBalance,
  useUSDTBalance,
  useVaultState,
  useUserPosition,
  useDemoAccount,
  formatLRS,
  formatUSDT,
} from "../hooks/useContracts";
import UpiQuickPay, { type UpiContact } from "../components/UpiQuickPay";

export default function Dashboard() {
  const navigate = useNavigate();
  const { address } = useDemoAccount();
  const { data: lrsBalance } = useLRSBalance();
  const { data: usdtBalance } = useUSDTBalance();
  const { collateralRatio, pegPrice, paused } = useVaultState();
  const { collateral, lrsMinted } = useUserPosition();

  const formattedInr = formatLRS(lrsBalance);

  const pegDisplay = pegPrice
    ? `₹${(Number(pegPrice) / 100).toFixed(2)}`
    : "₹83.00";

  const handleSelectContact = (contact: UpiContact) => {
    navigate(`/send?to=${encodeURIComponent(contact.upiId)}&name=${encodeURIComponent(contact.name)}&addr=${contact.address}`);
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1080 }}>
      {/* UPI Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              Namaste, Yasharth 🙏
            </h1>
            <span
              style={{
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 20,
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                fontWeight: 700,
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              ● UPI ACTIVE
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>UPI ID: <strong style={{ color: "#C9A84C", fontFamily: "monospace" }}>yasharth@liquidrs</strong></span>
            <span>·</span>
            <span>Zero transfer fees</span>
          </div>
        </div>

        {/* Security / Reserve Badge */}
        <div
          onClick={() => navigate("/risk")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 12,
            background: "rgba(201, 168, 76, 0.08)",
            border: "1px solid rgba(201, 168, 76, 0.25)",
            cursor: "pointer",
          }}
          title="Click to view Reserve & Risk Monitor"
        >
          <span style={{ fontSize: 16 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C" }}>
              150% RESERVE BACKED
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
              AI Peg Guard · 1 LRS = ₹1.00
            </div>
          </div>
          <span style={{ fontSize: 12, color: "#C9A84C" }}>›</span>
        </div>
      </div>

      {/* Hero Rupee Balance Card (GPay / PhonePe style) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #071527 50%, #0B1F3A 100%)",
          border: "1px solid rgba(201, 168, 76, 0.25)",
          borderRadius: 24,
          padding: "32px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(201, 168, 76, 0.08)",
        }}
      >
        {/* Rupee watermark */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 160,
            fontWeight: 900,
            color: "rgba(201, 168, 76, 0.04)",
            userSelect: "none",
            pointerEvents: "none",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ₹
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(201, 168, 76, 0.8)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 8,
            }}
          >
            Total Available Balance
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-1px",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            ₹{formattedInr}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Digital Rupee (LRS)</span>
            <span>·</span>
            <span style={{ color: "#10b981" }}>● Live Peg: 1 LRS = ₹1.00</span>
          </div>

          {/* Quick Balance Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/mint")}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #C9A84C 0%, #e8d48e 100%)",
                border: "none",
                color: "#060d1a",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 0 20px rgba(201, 168, 76, 0.3)",
              }}
            >
              <span>➕</span>
              <span>Add Money</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/send")}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>⚡</span>
              <span>Send UPI</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/redeem")}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                background: "transparent",
                border: "1px solid rgba(201, 168, 76, 0.25)",
                color: "#C9A84C",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🏦</span>
              <span>Withdraw</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* UPI 4-Way Quick Tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Scan Any QR",
            desc: "Camera / Gallery",
            icon: "📷",
            color: "#3b82f6",
            onClick: () => navigate("/send"),
          },
          {
            label: "To UPI ID / Phone",
            desc: "Instant to any bank",
            icon: "⚡",
            color: "#10b981",
            onClick: () => navigate("/send"),
          },
          {
            label: "Receive Money",
            desc: "My UPI QR Code",
            icon: "📥",
            color: "#C9A84C",
            onClick: () => navigate("/receive"),
          },
          {
            label: "Passbook",
            desc: "View Statements",
            icon: "📖",
            color: "#a855f7",
            onClick: () => navigate("/activity"),
          },
        ].map((tile, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={tile.onClick}
            className="glass-card"
            style={{
              padding: "20px 16px",
              cursor: "pointer",
              borderRadius: 18,
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${tile.color}22, ${tile.color}44)`,
                border: `1px solid ${tile.color}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                margin: "0 auto 12px",
              }}
            >
              {tile.icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
              {tile.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {tile.desc}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Contacts Carousel */}
      <UpiQuickPay onSelectContact={handleSelectContact} />

      {/* Reserve & On-Chain Settler Card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Reserve Health Card */}
        <div
          className="glass-card"
          style={{
            padding: "20px 24px",
            border: "1px solid rgba(201, 168, 76, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Digital Reserve Vault
            </span>
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>
              ● 100% SOLVENT
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Vault USDT Collateral:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
              ${formatUSDT(usdtBalance)} USDT
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Collateral Ratio:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C" }}>
              150% Over-Collateralised
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Reserve Peg Rate:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
              {pegDisplay} / USD
            </span>
          </div>
        </div>

        {/* Instant Settlement Engine */}
        <div
          className="glass-card"
          style={{
            padding: "20px 24px",
            border: "1px solid rgba(16, 185, 129, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Settlement Engine
            </span>
            <span style={{ fontSize: 11, color: "#C9A84C", fontWeight: 700 }}>
              ⚡ SUB-SECOND
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Transfer Speed:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>
              &lt; 1 Second Finality
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Transaction Fee:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>
              ₹0.00 (Gasless)
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Rails:</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              EVM Smart Contract Rails
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
