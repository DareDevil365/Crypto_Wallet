import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useLRSBalance,
  useVaultState,
  useUserPosition,
  formatLRS,
  formatUSDT,
} from "../hooks/useContracts";
import { UPI_CONTACTS, type UpiContact } from "../components/UpiQuickPay";
import {
  IconSearch,
  IconScan,
  IconPlus,
  IconSend,
  IconBank,
  IconPassbook,
  IconPhone,
  IconZap,
  IconQrCode,
  IconShield,
  IconChevronRight,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconCheck,
} from "../components/Icons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: lrsBalance } = useLRSBalance();
  const { pegPrice } = useVaultState();
  const { collateral } = useUserPosition();

  const [searchQuery, setSearchQuery] = useState("");

  const formattedInr = formatLRS(lrsBalance);

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
      {/* ── Search Bar (Apple iOS / super.money style) ───────────────────────── */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 20 }}>
        <div
          className="apple-glass-card"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            gap: 12,
            borderRadius: 16,
          }}
        >
          <IconSearch size={18} color="var(--text-muted)" strokeWidth={2} />
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
              className="btn-primary"
              style={{
                padding: "6px 14px",
                fontSize: 12,
                borderRadius: 8,
              }}
            >
              Pay
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/send")}
              className="apple-glass-subtle"
              style={{
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <IconScan size={14} />
              <span>SCAN</span>
            </button>
          )}
        </div>
      </form>

      {/* ── Apple Frosted Hero Balance Card ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="apple-glass-hero"
        style={{ padding: "28px 30px", marginBottom: 24 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Liquid RS (L₹S) Balance
              </span>
              <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 8px" }}>
                <IconCheck size={11} strokeWidth={2.5} /> 1:1 INR PEGGED
              </span>
            </div>
            <div
              style={{
                fontSize: 46,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span>₹{formattedInr}</span>
              <span style={{ fontSize: 18, color: "var(--upi-green)", fontWeight: 700, letterSpacing: "0.02em" }}>
                L₹S
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate("/risk")}
            className="apple-glass-subtle"
            style={{
              textAlign: "right",
              borderRadius: 14,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
              Peg Stability
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00E575", marginTop: 2 }}>
              1 L₹S = ₹1.00
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 22, display: "flex", alignItems: "center", gap: 6 }}>
          <span>Reserve: <strong style={{ color: "var(--text-secondary)" }}>${formatUSDT(collateral)} USDT</strong> locked</span>
          <span>·</span>
          <span style={{ color: "#00E575", fontWeight: 600 }}>150% Collateral Protection</span>
        </div>

        {/* Action pills inside Hero Card */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/mint")}
            style={{ padding: "10px 18px", fontSize: 13, borderRadius: 12 }}
          >
            <IconPlus size={16} strokeWidth={2.2} />
            <span>Add Money</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/send")}
            style={{ padding: "10px 16px", fontSize: 13, borderRadius: 12 }}
          >
            <IconSend size={15} strokeWidth={2} />
            <span>Send Money</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/redeem")}
            style={{ padding: "10px 16px", fontSize: 13, borderRadius: 12 }}
          >
            <IconBank size={15} strokeWidth={2} />
            <span>Withdraw</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/activity")}
            style={{ padding: "10px 16px", fontSize: 13, borderRadius: 12 }}
          >
            <IconPassbook size={15} strokeWidth={2} />
            <span>Passbook</span>
          </button>
        </div>
      </motion.div>

      {/* ── Transfer Money 4-Way Actions (Apple iOS Squircles) ───────────────── */}
      <div
        className="apple-glass-card"
        style={{
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
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
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.12) 100%)",
                color: "#818CF8",
              }}
            >
              <IconPhone size={22} strokeWidth={1.9} />
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
                background: "linear-gradient(135deg, rgba(0, 229, 117, 0.2) 0%, rgba(16, 185, 129, 0.12) 100%)",
                color: "#00E575",
              }}
            >
              <IconZap size={22} strokeWidth={2} />
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
                background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(37, 99, 235, 0.12) 100%)",
                color: "#38BDF8",
              }}
            >
              <IconScan size={22} strokeWidth={1.9} />
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
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.12) 100%)",
                color: "#FBBF24",
              }}
            >
              <IconQrCode size={22} strokeWidth={1.9} />
            </div>
            <span className="upi-action-label">Receive / My QR</span>
          </button>
        </div>
      </div>

      {/* ── People & Recent UPI Contacts Carousel ──────────────────────────── */}
      <div className="apple-glass-card" style={{ padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Recent Beneficiaries
          </span>
          <span style={{ fontSize: 11, color: "var(--upi-green)", fontWeight: 600 }}>
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
              className="apple-glass-subtle"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
              }}
            >
              <IconPlus size={18} strokeWidth={2} />
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
                  background: `linear-gradient(135deg, ${contact.color}22, ${contact.color}55)`,
                  border: `1.5px solid ${contact.color}88`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 12px ${contact.color}25`,
                }}
              >
                {contact.initials}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
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
        className="apple-glass-card fintech-card-interactive"
        onClick={() => navigate("/risk")}
        style={{
          padding: "18px 22px",
          marginBottom: 24,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "rgba(0, 229, 117, 0.12)",
              border: "1px solid rgba(0, 229, 117, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00E575",
            }}
          >
            <IconShield size={22} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                Reserve Shield & AI Peg Guard
              </span>
              <span className="badge badge-success" style={{ fontSize: 9, padding: "1px 6px" }}>
                ACTIVE
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              150% Over-Collateralised · Continuous On-Chain FX Volatility Audit
            </div>
          </div>
        </div>

        <IconChevronRight size={18} color="var(--upi-green)" />
      </div>

      {/* ── Recent UPI Transactions Preview ─────────────────────────────────── */}
      <div className="apple-glass-card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Recent Statements
          </span>
          <button
            onClick={() => navigate("/activity")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--upi-green)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>View All</span>
            <IconChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Priya Sharma", amount: "₹500.00", type: "DEBIT", time: "Today, 2:14 PM", initials: "PS", color: "#6366F1" },
            { name: "Minted L₹S (USD Reserve)", amount: "+₹5,533.33", type: "CREDIT", time: "Today, 1:45 PM", initials: "L₹", color: "#00E575" },
            { name: "Chai Point", amount: "₹80.00", type: "DEBIT", time: "11 Sep 2026", initials: "CP", color: "#F59E0B" },
          ].map((tx, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/activity")}
              className="apple-glass-subtle"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `${tx.color}22`,
                  border: `1px solid ${tx.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                {tx.type === "DEBIT" ? (
                  <IconArrowUpRight size={16} color={tx.color} />
                ) : (
                  <IconArrowDownLeft size={16} color={tx.color} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.01em" }}>{tx.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tx.time} · <span style={{ color: "#00E575" }}>Settled</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: tx.type === "CREDIT" ? "#00E575" : "#FFFFFF",
                    fontVariantNumeric: "tabular-nums",
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
