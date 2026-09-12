import { useState } from "react";
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
import { UPI_CONTACTS, type UpiContact } from "../components/UpiQuickPay";

export default function Dashboard() {
  const navigate = useNavigate();
  const { address } = useDemoAccount();
  const { data: lrsBalance } = useLRSBalance();
  const { data: usdtBalance } = useUSDTBalance();
  const { collateralRatio, pegPrice, paused } = useVaultState();
  const { collateral, lrsMinted } = useUserPosition();

  const [searchQuery, setSearchQuery] = useState("");

  const formattedInr = formatLRS(lrsBalance);
  const pegDisplay = pegPrice
    ? `₹${(Number(pegPrice) / 100).toFixed(2)}`
    : "₹83.00";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/send?to=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectContact = (contact: UpiContact) => {
    navigate(`/send?to=${encodeURIComponent(contact.upiId)}&name=${encodeURIComponent(contact.name)}&addr=${contact.address}`);
  };

  return (
    <div className="page-container" style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* ── Search Bar (PhonePe / super.money style) ────────────────────────── */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--surface-1)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 16,
            padding: "10px 16px",
            gap: 12,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <span style={{ fontSize: 18, color: "var(--text-muted)" }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pay anyone by UPI ID, mobile number or name..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          {searchQuery ? (
            <button
              type="submit"
              style={{
                background: "var(--upi-green)",
                color: "#05140A",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Pay
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/send")}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              SCAN 📷
            </button>
          )}
        </div>
      </form>

      {/* ── Hero Balance Card (super.money / Navi style) ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fintech-hero-card"
        style={{ padding: "26px 28px", marginBottom: 24 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-secondary)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Liquid Rupee Account
              </span>
              <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 8px" }}>
                ● 100% BACKED
              </span>
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              ₹{formattedInr}
            </div>
          </div>

          <div
            onClick={() => navigate("/risk")}
            style={{
              textAlign: "right",
              background: "rgba(0, 229, 117, 0.08)",
              border: "1px solid rgba(0, 229, 117, 0.2)",
              borderRadius: 12,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Peg Stability
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00E575" }}>
              1 LRS = ₹1.00
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <span>Reserve: <strong>${formatUSDT(collateral)} USDT</strong> locked</span>
          <span>·</span>
          <span style={{ color: "#00E575" }}>150% Collateral Protection</span>
        </div>

        {/* Action pills inside Hero Card */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/mint")}
            style={{ padding: "10px 20px", fontSize: 13, borderRadius: 12 }}
          >
            <span>➕</span>
            <span>Add Money</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/send")}
            style={{ padding: "10px 18px", fontSize: 13, borderRadius: 12 }}
          >
            <span>⚡</span>
            <span>Send Money</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/redeem")}
            style={{ padding: "10px 18px", fontSize: 13, borderRadius: 12 }}
          >
            <span>🏦</span>
            <span>Withdraw</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/activity")}
            style={{ padding: "10px 18px", fontSize: 13, borderRadius: 12 }}
          >
            <span>📖</span>
            <span>Passbook</span>
          </button>
        </div>
      </motion.div>

      {/* ── Transfer Money 4-Way Quick Actions (PhonePe / Paytm Style) ─────── */}
      <div
        className="fintech-card"
        style={{
          padding: "20px 24px",
          marginBottom: 24,
          background: "var(--surface-1)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--text-muted)",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          UPI Money Transfer
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {/* Action 1: To Mobile / Contact */}
          <button
            className="upi-action-btn"
            onClick={() => navigate("/send")}
          >
            <div
              className="upi-action-icon"
              style={{
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                color: "#A78BFA",
              }}
            >
              📱
            </div>
            <span className="upi-action-label">To Mobile / Contact</span>
          </button>

          {/* Action 2: To UPI ID */}
          <button
            className="upi-action-btn"
            onClick={() => navigate("/send")}
          >
            <div
              className="upi-action-icon"
              style={{
                background: "linear-gradient(135deg, rgba(0, 229, 117, 0.22) 0%, rgba(16, 185, 129, 0.18) 100%)",
                border: "1px solid rgba(0, 229, 117, 0.4)",
                color: "#00E575",
              }}
            >
              ⚡
            </div>
            <span className="upi-action-label">To UPI ID / Bank</span>
          </button>

          {/* Action 3: Scan QR */}
          <button
            className="upi-action-btn"
            onClick={() => navigate("/send")}
          >
            <div
              className="upi-action-icon"
              style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(59, 130, 246, 0.18) 100%)",
                border: "1px solid rgba(6, 182, 212, 0.4)",
                color: "#38BDF8",
              }}
            >
              📷
            </div>
            <span className="upi-action-label">Scan Any QR</span>
          </button>

          {/* Action 4: Receive QR */}
          <button
            className="upi-action-btn"
            onClick={() => navigate("/receive")}
          >
            <div
              className="upi-action-icon"
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.18) 100%)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                color: "#FBBF24",
              }}
            >
              📥
            </div>
            <span className="upi-action-label">Receive / My QR</span>
          </button>
        </div>
      </div>

      {/* ── People & Recent UPI Contacts Carousel ──────────────────────────── */}
      <div className="fintech-card" style={{ padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase" }}>
            Recent People & Merchants
          </span>
          <span style={{ fontSize: 11, color: "#00E575", fontWeight: 700 }}>
            Tap to Pay
          </span>
        </div>

        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
          {/* Add New Contact Button */}
          <button
            onClick={() => navigate("/send")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              minWidth: 70,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--surface-2)",
                border: "1px dashed rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "var(--text-secondary)",
              }}
            >
              ➕
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
              New Pay
            </span>
          </button>

          {UPI_CONTACTS.map((contact) => (
            <motion.button
              key={contact.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectContact(contact)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                minWidth: 74,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${contact.color}33, ${contact.color}99)`,
                  border: `2px solid ${contact.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: `0 4px 12px ${contact.color}33`,
                }}
              >
                {contact.avatar}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 70,
                }}
              >
                {contact.name.split(" ")[0]}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {contact.recentAmount}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Security & Reserve Shield Banner ────────────────────────────────── */}
      <div
        className="fintech-card fintech-card-interactive"
        onClick={() => navigate("/risk")}
        style={{
          padding: "18px 22px",
          marginBottom: 24,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #101626 0%, #151D33 100%)",
          border: "1px solid rgba(0, 229, 117, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "rgba(0, 229, 117, 0.12)",
              border: "1px solid rgba(0, 229, 117, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>
                Reserve Shield & AI Peg Guard
              </span>
              <span className="badge badge-success" style={{ fontSize: 10, padding: "1px 6px" }}>
                ACTIVE
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              150% Over-Collateralised · Continuous On-Chain FX Volatility Audit
            </div>
          </div>
        </div>

        <span style={{ color: "#00E575", fontSize: 18, fontWeight: 700 }}>›</span>
      </div>

      {/* ── Recent UPI Transactions Preview ─────────────────────────────────── */}
      <div className="fintech-card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase" }}>
            Recent Passbook Activity
          </span>
          <button
            onClick={() => navigate("/activity")}
            style={{
              background: "transparent",
              border: "none",
              color: "#00E575",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View All Statements ›
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Priya Sharma", upi: "priya@liquidrs", amount: "₹500.00", type: "DEBIT", time: "Today, 2:14 PM", icon: "👩‍💼", color: "#EC4899" },
            { name: "Added Money (USD Reserve)", upi: "vault@liquidrs", amount: "+₹5,533.33", type: "CREDIT", time: "Today, 1:45 PM", icon: "➕", color: "#00E575" },
            { name: "Chai Point", upi: "chaipoint@liquidrs", amount: "₹80.00", type: "DEBIT", time: "11 Sep 2026", icon: "☕", color: "#F59E0B" },
          ].map((tx, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/activity")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 14,
                background: "var(--surface-2)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `${tx.color}22`,
                  border: `1px solid ${tx.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {tx.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>{tx.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tx.time} · <span style={{ color: "#00E575" }}>● Successful</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: tx.type === "CREDIT" ? "#00E575" : "#FFFFFF",
                  }}
                >
                  {tx.amount}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {tx.type === "CREDIT" ? "Credited" : "Debited"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
