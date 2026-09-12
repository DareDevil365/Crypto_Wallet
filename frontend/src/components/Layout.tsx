import { NavLink, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DemoReset from "./DemoReset";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: "🏠" },
  { to: "/send", label: "Pay UPI / Scan", icon: "⚡" },
  { to: "/receive", label: "Receive / QR", icon: "📥" },
  { to: "/mint", label: "Add Money", icon: "➕" },
  { to: "/redeem", label: "Withdraw", icon: "🏦" },
  { to: "/activity", label: "Passbook", icon: "📖" },
  { to: "/faucet", label: "Reload Balance", icon: "💧" },
  { to: "/risk", label: "Reserve Shield", icon: "🛡️", highlight: true, highlightText: "AI 150%" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { address } = useDemoAccount();
  const { isDemo, disableDemo } = useDemoContext();

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText("yash@liquidrs");
    toast.success("UPI ID copied: yash@liquidrs", { icon: "📋" });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--navy-900)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          minWidth: 250,
          background: "linear-gradient(180deg, #060d1a 0%, #0B1F3A 100%)",
          borderRight: "1px solid rgba(201,168,76,0.12)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C9A84C 0%, #e8d48e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
                fontWeight: 900,
                color: "#060d1a",
                boxShadow: "0 0 15px rgba(201, 168, 76, 0.3)",
              }}
            >
              ₹
            </div>
            <div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  background: "linear-gradient(135deg, #C9A84C 0%, #e8d48e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                LiquidRS
              </span>
              <div
                style={{
                  fontSize: 10,
                  color: "#10b981",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                ● UPI 2.0 DIGITAL RUPEE
              </div>
            </div>
          </div>
        </div>

        {/* User UPI Card */}
        <div
          onClick={handleCopyUpiId}
          style={{
            margin: "0 14px 18px",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(201, 168, 76, 0.06)",
            border: "1px solid rgba(201, 168, 76, 0.2)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          title="Click to copy your UPI ID"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              YS
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>
                Yash (You)
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#C9A84C",
                  fontFamily: "monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>yash@liquidrs</span>
                <span style={{ fontSize: 10 }}>📋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? "#C9A84C"
                  : item.highlight
                  ? "rgba(201,168,76,0.85)"
                  : "var(--text-secondary)",
                background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                border: isActive
                  ? "1px solid rgba(201,168,76,0.25)"
                  : "1px solid transparent",
                transition: "all 0.15s ease",
              })}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.highlight && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 9,
                    fontWeight: 700,
                    background: "rgba(201,168,76,0.18)",
                    color: "#C9A84C",
                    padding: "2px 6px",
                    borderRadius: 4,
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.highlightText}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Status / Wallet Controls */}
        <div
          style={{
            padding: "14px 16px 8px",
            borderTop: "1px solid rgba(201,168,76,0.08)",
          }}
        >
          {isDemo ? (
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12 }}>⚡</span>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#C9A84C",
                      letterSpacing: "0.5px",
                    }}
                  >
                    UPI DEMO ACTIVE
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      fontFamily: "monospace",
                    }}
                  >
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
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-secondary)",
                  borderRadius: 6,
                  padding: "3px 6px",
                  fontSize: 10,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                title="Exit Demo Mode"
              >
                Exit
              </button>
            </div>
          ) : (
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />
          )}
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "fixed",
            top: "15%",
            right: "10%",
            width: 450,
            height: 450,
            background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ position: "relative", zIndex: 1, minHeight: "100%" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating demo reset button */}
      <DemoReset />
    </div>
  );
}
