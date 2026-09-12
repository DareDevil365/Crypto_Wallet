import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_RESET_EVENT } from "../components/DemoReset";
import { useLRSBalance, formatLRS } from "../hooks/useContracts";
import { IconArrowUpRight, IconArrowDownLeft, IconPlus } from "../components/Icons";

type FilterType = "ALL" | "PAID" | "RECEIVED" | "DEPOSIT";

interface PassbookItem {
  id: string;
  type: "DEBIT" | "CREDIT" | "DEPOSIT";
  title: string;
  liqId: string;
  upiId?: string;
  amount: string;
  time: string;
  status: "SUCCESS" | "PENDING";
  liqRef: string;
  txHash: string;
  avatar: string;
  avatarBg: string;
}

const SEED_PASSBOOK: PassbookItem[] = [
  {
    id: "p1",
    type: "DEBIT",
    title: "Transfer to Priya Sharma",
    liqId: "priya@liq",
    amount: "-₹500.00 L₹S",
    time: "Today, 2:14 PM",
    status: "SUCCESS",
    liqRef: "LIQ/948201948201",
    txHash: "0x7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    avatar: "PS",
    avatarBg: "#6366F1",
  },
  {
    id: "p2",
    type: "DEPOSIT",
    title: "Minted L₹S (USD Reserve Vault)",
    liqId: "vault.reserve@liq",
    amount: "+₹5,533.33 L₹S",
    time: "Today, 1:45 PM",
    status: "SUCCESS",
    liqRef: "LIQ/829104829104",
    txHash: "0x3a4b5c6d7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
    avatar: "L₹",
    avatarBg: "#00E575",
  },
  {
    id: "p3",
    type: "CREDIT",
    title: "Received from Rahul Verma",
    liqId: "rahul@liq",
    amount: "+₹1,250.00 L₹S",
    time: "Yesterday, 6:30 PM",
    status: "SUCCESS",
    liqRef: "LIQ/719283719283",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f1a2b",
    avatar: "RV",
    avatarBg: "#38BDF8",
  },
  {
    id: "p4",
    type: "DEBIT",
    title: "Merchant Payment — Chai Point",
    liqId: "chaipoint@liq",
    amount: "-₹80.00 L₹S",
    time: "11 Sep 2026",
    status: "SUCCESS",
    liqRef: "LIQ/610293847561",
    txHash: "0x9c0d1e2f3a4b5c6d7e8f1a2b3c4d5e6f7a8b9c0d",
    avatar: "CP",
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
    <div className="page-container" style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: "var(--upi-green)",
                background: "rgba(0, 229, 117, 0.1)",
                border: "1px solid rgba(0, 229, 117, 0.25)",
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              LIQ LEDGER & ON-CHAIN STATEMENTS
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Liq Exchange Activity
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Real-time transfers, mints, and EVM settlement receipts
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            L₹S Balance
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#00E575", fontVariantNumeric: "tabular-nums" }}>
            ₹{formatLRS(lrsBalance)}
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {[
          { id: "ALL", label: "All Activity" },
          { id: "PAID", label: "Transfers Sent" },
          { id: "RECEIVED", label: "Received" },
          { id: "DEPOSIT", label: "Minted L₹S" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterType)}
            className={`btn-pill ${filter === tab.id ? "active" : ""}`}
            style={{
              background: filter === tab.id ? "rgba(0, 229, 117, 0.16)" : "rgba(255, 255, 255, 0.04)",
              color: filter === tab.id ? "#00E575" : "var(--text-secondary)",
              borderColor: filter === tab.id ? "#00E575" : "rgba(255, 255, 255, 0.08)",
              fontWeight: 700,
              fontSize: 12,
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
              className="apple-glass-card fintech-card-interactive"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              style={{
                padding: "16px 18px",
                cursor: "pointer",
                borderRadius: 18,
                borderColor: isExpanded ? "rgba(0, 229, 117, 0.4)" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Monogram / Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `${item.avatarBg}20`,
                    border: `1.5px solid ${item.avatarBg}50`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    color: item.avatarBg,
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.avatar}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 2, letterSpacing: "-0.01em" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{item.time}</span>
                    <span>·</span>
                    <span style={{ color: "#00E575", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00E575", display: "inline-block" }} />
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: isCredit ? "#00E575" : "#FFFFFF",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.amount}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>
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
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.85,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Liq Reference ID:</span>
                      <span style={{ fontFamily: "monospace", color: "#FFFFFF" }}>
                        {item.liqRef}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Beneficiary Liq ID:</span>
                      <span style={{ fontFamily: "monospace", color: "#00E575" }}>
                        {item.liqId}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Settlement Layer:</span>
                      <span style={{ color: "#00E575" }}>EVM Layer 2 · 0.8s Finality</span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        padding: "8px 12px",
                        background: "rgba(0, 0, 0, 0.25)",
                        borderRadius: 10,
                        fontSize: 11,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
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
