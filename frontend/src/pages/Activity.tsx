import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_RESET_EVENT } from "../components/DemoReset";
import { useLRSBalance, formatLRS } from "../hooks/useContracts";

type FilterType = "ALL" | "PAID" | "RECEIVED" | "DEPOSIT";

interface PassbookItem {
  id: string;
  type: "DEBIT" | "CREDIT" | "DEPOSIT";
  title: string;
  upiId: string;
  amount: string;
  time: string;
  status: "SUCCESS" | "PENDING";
  upiRef: string;
  txHash: string;
  avatar: string;
  avatarBg: string;
}

const SEED_PASSBOOK: PassbookItem[] = [
  {
    id: "p1",
    type: "DEBIT",
    title: "Paid to Priya Sharma",
    upiId: "priya@liquidrs",
    amount: "-₹500.00",
    time: "Today, 2:14 PM",
    status: "SUCCESS",
    upiRef: "UPI/948201948201",
    txHash: "0x7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    avatar: "PS",
    avatarBg: "#EC4899",
  },
  {
    id: "p2",
    type: "DEPOSIT",
    title: "Added Money (USD Reserve)",
    upiId: "vault.reserve@liquidrs",
    amount: "+₹5,533.33",
    time: "Today, 1:45 PM",
    status: "SUCCESS",
    upiRef: "UPI/829104829104",
    txHash: "0x3a4b5c6d7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
    avatar: "➕",
    avatarBg: "#00E575",
  },
  {
    id: "p3",
    type: "CREDIT",
    title: "Received from Rahul Verma",
    upiId: "rahul@liquidrs",
    amount: "+₹1,250.00",
    time: "Yesterday, 6:30 PM",
    status: "SUCCESS",
    upiRef: "UPI/719283719283",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f1a2b",
    avatar: "RV",
    avatarBg: "#3B82F6",
  },
  {
    id: "p4",
    type: "DEBIT",
    title: "Paid to Chai Point",
    upiId: "chaipoint@liquidrs",
    amount: "-₹80.00",
    time: "11 Sep 2026",
    status: "SUCCESS",
    upiRef: "UPI/610293847561",
    txHash: "0x9c0d1e2f3a4b5c6d7e8f1a2b3c4d5e6f7a8b9c0d",
    avatar: "☕",
    avatarBg: "#F59E0B",
  },
];

export default function Activity() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [items, setItems] = useState<PassbookItem[]>(SEED_PASSBOOK);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: lrsBalance } = useLRSBalance();

  useEffect(() => {
    const handler = () => setItems(SEED_PASSBOOK);
    window.addEventListener(DEMO_RESET_EVENT, handler);
    return () => window.removeEventListener(DEMO_RESET_EVENT, handler);
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "PAID") return item.type === "DEBIT";
    if (filter === "RECEIVED") return item.type === "CREDIT";
    if (filter === "DEPOSIT") return item.type === "DEPOSIT";
    return true;
  });

  return (
    <div className="page-container" style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
            UPI Passbook
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Statements, transfers & receipts
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Account Balance
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#00E575" }}>
            ₹{formatLRS(lrsBalance)}
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {[
          { id: "ALL", label: "All Statements" },
          { id: "PAID", label: "Paid ↗" },
          { id: "RECEIVED", label: "Received ↙" },
          { id: "DEPOSIT", label: "Added Money ➕" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterType)}
            className={`btn-pill ${filter === tab.id ? "active" : ""}`}
            style={{
              background: filter === tab.id ? "var(--upi-green)" : "var(--surface-2)",
              color: filter === tab.id ? "#05140A" : "var(--text-secondary)",
              border: filter === tab.id ? "none" : "1px solid var(--border-subtle)",
              fontWeight: 800,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Transaction Feed ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredItems.map((item) => {
          const isCredit = item.type === "CREDIT" || item.type === "DEPOSIT";
          const isExpanded = expandedId === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              className="fintech-card fintech-card-interactive"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              style={{
                padding: "16px 18px",
                cursor: "pointer",
                border: isExpanded ? "1px solid var(--border-focus)" : "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `${item.avatarBg}22`,
                    border: `1px solid ${item.avatarBg}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#FFFFFF",
                  }}
                >
                  {item.avatar}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 2 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{item.time}</span>
                    <span>·</span>
                    <span style={{ color: "#00E575", fontWeight: 700 }}>● {item.status}</span>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: isCredit ? "#00E575" : "#FFFFFF",
                    }}
                  >
                    {item.amount}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {isCredit ? "Credited" : "Debited"}
                  </div>
                </div>
              </div>

              {/* Expanded Receipt Breakdown */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: "1px solid var(--border-subtle)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>UPI Reference UTR:</span>
                      <span style={{ fontFamily: "monospace", color: "#FFFFFF" }}>
                        {item.upiRef}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Beneficiary UPI ID:</span>
                      <span style={{ fontFamily: "monospace", color: "#00E575" }}>
                        {item.upiId}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Payment Rails:</span>
                      <span style={{ color: "#00E575" }}>EVM L2 Smart Contract Settlement</span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        padding: "6px 10px",
                        background: "var(--surface-2)",
                        borderRadius: 8,
                        fontSize: 10,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>On-Chain Hash: </span>
                      <span style={{ color: "#60A5FA" }}>{item.txHash}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
