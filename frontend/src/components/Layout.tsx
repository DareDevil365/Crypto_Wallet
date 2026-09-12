import { NavLink, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DemoReset from "./DemoReset";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";
import {
  IconHome,
  IconSend,
  IconReceive,
  IconPlus,
  IconBank,
  IconPassbook,
  IconShield,
  IconWaterDrop,
  IconScan,
  IconQrCode,
  IconCopy,
  IconCheck,
} from "./Icons";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", Icon: IconHome },
  { to: "/send", label: "Scan & Pay", Icon: IconSend },
  { to: "/receive", label: "Receive QR", Icon: IconReceive },
  { to: "/mint", label: "Add Money", Icon: IconPlus },
  { to: "/redeem", label: "Withdraw", Icon: IconBank },
  { to: "/activity", label: "Passbook", Icon: IconPassbook },
  { to: "/risk", label: "Reserve Shield", Icon: IconShield, highlight: "AI 150%" },
  { to: "/faucet", label: "Reload Balance", Icon: IconWaterDrop },
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
    toast.success("UPI ID copied: yasharth@liquidrs");
  };

  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* ── Mobile Top Header (Apple iOS Style) ────────────────────────────── */}
      <header
        className="mobile-only"
        style={{
          padding: "12px 16px",
          background: "rgba(12, 16, 26, 0.78)",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
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
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#FFFFFF",
              boxShadow: "0 2px 10px rgba(16, 185, 129, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            YA
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#00E575",
                border: "2px solid #080A10",
              }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                Yasharth
              </span>
              <span className="badge badge-success" style={{ fontSize: 9, padding: "1px 6px" }}>
                <IconCheck size={10} strokeWidth={2.5} /> VERIFIED
              </span>
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
              <IconCopy size={11} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        {/* Right: Quick action vector buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate("/send")}
            className="apple-glass-subtle"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Scan QR"
          >
            <IconScan size={17} />
          </button>
          <button
            onClick={() => navigate("/receive")}
            className="apple-glass-subtle"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="My QR"
          >
            <IconQrCode size={17} />
          </button>
        </div>
      </header>

      {/* ── Desktop Sidebar (Apple Frosted Glass) ───────────────────────────── */}
      <aside
        className="app-sidebar desktop-only apple-glass-card"
        style={{
          width: 260,
          minWidth: 260,
          borderRight: "1px solid var(--glass-border)",
          borderTop: "none",
          borderBottom: "none",
          borderLeft: "none",
          borderRadius: 0,
          flexDirection: "column",
          padding: "24px 0 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: "0 24px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
                fontWeight: 900,
                color: "#031408",
                boxShadow: "0 4px 16px var(--upi-green-glow)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              ₹
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 19,
                  letterSpacing: "-0.03em",
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
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                L₹S CRYPTO · UPI 2.0
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div
          onClick={handleCopyUpiId}
          className="apple-glass-subtle"
          style={{
            margin: "0 16px 20px",
            padding: "10px 12px",
            borderRadius: 14,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          title="Click to copy your UPI ID"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#ffffff",
                fontWeight: 800,
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
              }}
            >
              YA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
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
                <IconCopy size={11} color="var(--text-muted)" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.Icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 12,
                  marginBottom: 3,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#00E575" : "var(--text-secondary)",
                  background: isActive ? "rgba(0, 229, 117, 0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(0, 229, 117, 0.22)" : "1px solid transparent",
                  boxShadow: isActive ? "inset 0 1px 0 rgba(255, 255, 255, 0.1)" : "none",
                  transition: "all 0.15s ease",
                })}
              >
                <Icon size={18} strokeWidth={1.8} />
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
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.highlight}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Wallet / Demo State */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {isDemo ? (
            <div
              className="apple-glass-subtle"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#00E575" }}>●</span>
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
                className="btn-secondary"
                style={{
                  padding: "4px 8px",
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 6,
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "relative", zIndex: 1, minHeight: "100%" }}
        >
          {children}
        </motion.div>
      </main>

      {/* ── PhonePe / super.money Apple Frosted Bottom Dock (<=768px) ───────── */}
      <nav className="fintech-bottom-dock mobile-only">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <IconHome size={20} strokeWidth={1.8} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/activity"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <IconPassbook size={20} strokeWidth={1.8} />
          <span>Passbook</span>
        </NavLink>

        {/* Center Prominent Glowing Scan & Pay Button with Vector Icon */}
        <NavLink
          to="/send"
          className="dock-scan-btn"
          title="Scan & Pay UPI"
        >
          <IconScan size={24} color="#031408" strokeWidth={2.2} />
        </NavLink>

        <NavLink
          to="/mint"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <IconPlus size={20} strokeWidth={2} />
          <span>Add ₹</span>
        </NavLink>

        <NavLink
          to="/risk"
          className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}
        >
          <IconShield size={20} strokeWidth={1.8} />
          <span>Shield</span>
        </NavLink>
      </nav>

      {/* Floating Demo Reset Button */}
      <DemoReset />
    </div>
  );
}
