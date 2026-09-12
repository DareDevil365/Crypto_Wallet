import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoAccount } from "../hooks/useContracts";
import { useDemoContext } from "../context/DemoContext";
import { PageHeader } from "../components/TxButton";
import { DEMO_RESET_EVENT } from "../components/DemoReset";

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
    amount: "₹500.00",
    time: "Today, 2:14 PM",
    status: "SUCCESS",
    upiRef: "UPI/948201948201",
    txHash: "0x7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    avatar: "PS",
    avatarBg: "#ec4899",
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
    avatarBg: "#C9A84C",
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
    avatarBg: "#3b82f6",
  },
  {
    id: "p4",
    type: "DEBIT",
    title: "Paid to Chai Point",
    upiId: "chaipoint@liquidrs",
    amount: "₹80.00",
    time: "11 Sep 2026",
    status: "SUCCESS",
    upiRef: "UPI/610293847561",
    txHash: "0x9c0d1e2f3a4b5c6d7e8f1a2b3c4d5e6f7a8b9c0d",
    avatar: "☕",
    avatarBg: "#f59e0b",
  },
];

export default function Activity() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [items, setItems] = useState<PassbookItem[]>(SEED_PASSBOOK);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Listen for demo reset
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
    <div style={{ padding: "36px 40px", maxWidth: 760 }}>
      <PageHeader
        title="Passbook & Statements"
        subtitle="Complete record of your UPI transfers, payments, and deposits"
      />

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 24,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {[
          { id: "ALL", label: "All Transactions" },
          { id: "PAID", label: "Paid ↗" },
          { id: "RECEIVED", label: "Received ↙" },
          { id: "DEPOSIT", label: "Added Money ➕" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterType)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background:
                filter === tab.id
                  ? "linear-gradient(135deg, #C9A84C 0%, #e8d48e 100%)"
                  : "rgba(255, 255, 255, 0.04)",
              border:
                filter === tab.id
                  ? "none"
                  : "1px solid rgba(255, 255, 255, 0.08)",
              color: filter === tab.id ? "#060d1a" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Passbook List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredItems.map((item) => {
          const isCredit = item.type === "CREDIT" || item.type === "DEPOSIT";
          const isExpanded = expandedId === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              className="glass-card"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              style={{
                padding: "18px 20px",
                borderRadius: 16,
                cursor: "pointer",
                border: isExpanded
                  ? "1px solid #C9A84C"
                  : "1px solid rgba(255, 255, 255, 0.06)",
                transition: "border 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: item.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#ffffff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {item.avatar}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{item.time}</span>
                    <span>·</span>
                    <span style={{ color: "#10b981", fontWeight: 600 }}>● {item.status}</span>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: isCredit ? "#10b981" : "#ffffff",
                    }}
                  >
                    {item.amount}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {isCredit ? "Credited to Wallet" : "Debited from Wallet"}
                  </div>
                </div>
              </div>

              {/* Expanded UPI & On-chain Receipt details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>UPI Reference Number:</span>
                      <span style={{ fontFamily: "monospace", color: "#ffffff" }}>
                        {item.upiRef}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Beneficiary UPI ID:</span>
                      <span style={{ fontFamily: "monospace", color: "#C9A84C" }}>
                        {item.upiId}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Payment Rails:</span>
                      <span style={{ color: "#10b981" }}>EVM L2 Smart Contract Settlement</span>
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        background: "rgba(6, 13, 26, 0.8)",
                        borderRadius: 8,
                        fontSize: 11,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>On-Chain Hash: </span>
                      <span style={{ color: "#60a5fa" }}>{item.txHash}</span>
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
