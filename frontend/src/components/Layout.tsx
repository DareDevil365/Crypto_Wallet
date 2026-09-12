import { NavLink, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DemoReset from "./DemoReset";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: "🏠" },
  { to: "/send", label: "Scan & Pay", icon: "⚡" },
  { to: "/receive", label: "Receive QR", icon: "📥" },
  { to: "/mint", label: "Add Money", icon: "➕" },
  { to: "/redeem", label: "Withdraw", icon: "🏦" },
  { to: "/activity", label: "Passbook", icon: "📖" },
  { to: "/risk", label: "Reserve Shield", icon: "🛡️", highlight: "AI 150%" },
  { to: "/faucet", label: "Reload Balance", icon: "💧" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { address } = useDemoAccount();
  const { isDemo, disableDemo } = useDemoContext();

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText("yasharth@liquidrs");
    toast.success("UPI ID copied: yasharth@liquidrs", { icon: "📋" });
  };

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* ── Mobile Top Header (PhonePe / super.money style) ────────────────── */}
      <header
        className="mobile-only"
        style={{
          padding: "12px 16px",
          background: "rgba(9, 12, 21, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left: Avatar with Yasharth details */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              position: "relative",
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            YA
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#00E575",
                border: "2px solid #090C15",
              }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>Yasharth</span>
              <span style={{ fontSize: 10, color: "#00E575", fontWeight: 700 }}>✓ VERIFIED</span>
            </div>
            <div
              onClick={handleCopyUpiId}
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                fontFamily: "monospace",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>yasharth@liquidrs</span>
              <span style={{ fontSize: 9 }}>📋</span>
            </div>
          </div>
        </div>

        {/* Right: Quick action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate("/send")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--surface-2)",
              border: "1px solid var(--border-subtle)",
              color: "#FFFFFF",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Scan QR"
          >
            📷
          </button>
          <button
            onClick={() => navigate("/receive")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--surface-2)",
              border: "1px solid var(--border-subtle)",
              color: "#FFFFFF",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="My QR"
          >
            📥
          </button>
        </div>
      </header>

      {/* ── Desktop Sidebar (Modern Fintech) ────────────────────────────────── */}
      <aside
        className="app-sidebar desktop-only"
        style={{
          width: 260,
          minWidth: 260,
          background: "var(--surface-1)",
          borderRight: "1px solid var(--border-subtle)",
          flexDirection: "column",
          padding: "24px 0 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                color: "#05140A",
                boxShadow: "0 4px 18px var(--upi-green-glow)",
              }}
            >
              ₹
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: "-0.5px",
                  color: "#FFFFFF",
                }}
              >
                Liquid<span style={{ color: "#00E575" }}>RS</span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#00E575",
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                }}
              >
                ● UPI 2.0 PROTOCOL
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div
          onClick={handleCopyUpiId}
          style={{
            margin: "0 16px 20px",
            padding: "12px 14px",
            borderRadius: 14,
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          title="Click to copy your UPI ID"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                color: "#ffffff",
                fontWeight: 800,
              }}
            >
              YA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                Yasharth
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#00E575",
                  fontFamily: "monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>yasharth@liquidrs</span>
                <span style={{ fontSize: 10 }}>📋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 12,
                marginBottom: 4,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#00E575" : "var(--text-secondary)",
                background: isActive ? "rgba(0, 229, 117, 0.08)" : "transparent",
                border: isActive ? "1px solid rgba(0, 229, 117, 0.2)" : "1px solid transparent",
                transition: "all 0.15s ease",
              })}
            >
              <span style={{ fontSize: 17, width: 22, textAlign: "center" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.highlight && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 9,
                    fontWeight: 800,
                    background: "rgba(0, 229, 117, 0.15)",
                    color: "#00E575",
                    padding: "2px 7px",
                    borderRadius: 6,
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.highlight}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Wallet / Demo State */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          {isDemo ? (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#00E575" }}>●</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF" }}>
                    UPI Demo Active
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x7099...79C8"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  disableDemo();
                  navigate("/");
                }}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 10,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Exit
              </button>
            </div>
          ) : (
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
          )}
        </div>
      </aside>

      {/* ── Main App Content ────────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: "relative", zIndex: 1, minHeight: "100%" }}
        >
          {children}
        </motion.div>
      </main>

      {/* ── PhonePe / super.money Mobile Bottom Dock (<=768px) ─────────────── */}
      <nav className="fintech-bottom-dock mobile-only">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <span style={{ fontSize: 20 }}>🏠</span>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/activity"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <span style={{ fontSize: 20 }}>📖</span>
          <span>Passbook</span>
        </NavLink>

        {/* Center Prominent Glowing Scan & Pay Button */}
        <NavLink
          to="/send"
          className="dock-scan-btn"
          title="Scan & Pay UPI"
        >
          ⚡
        </NavLink>

        <NavLink
          to="/mint"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <span style={{ fontSize: 20 }}>➕</span>
          <span>Add ₹</span>
        </NavLink>

        <NavLink
          to="/risk"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span>Shield</span>
        </NavLink>
      </nav>

      {/* Floating Demo Reset Button */}
      <DemoReset />
    </div>
  );
}
