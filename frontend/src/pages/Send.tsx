import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useLRSBalance,
  useSendLRS,
  useDemoAccount,
  parseLRS,
  formatLRS,
} from "../hooks/useContracts";
import UpiSuccessModal from "../components/UpiSuccessModal";
import { UPI_CONTACTS, type UpiContact } from "../components/UpiQuickPay";

const AMOUNT_PRESETS = ["100", "250", "500", "1000", "2000"];

export default function Send() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recipientInput, setRecipientInput] = useState("priya@liquidrs");
  const [recipientName, setRecipientName] = useState("Priya Sharma");
  const [targetAddress, setTargetAddress] = useState<`0x${string}`>("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const { address } = useDemoAccount();
  const { data: lrsBalance, refetch } = useLRSBalance();
  const { send } = useSendLRS();

  useEffect(() => {
    const toParam = searchParams.get("to");
    const nameParam = searchParams.get("name");
    const addrParam = searchParams.get("addr");

    if (toParam) setRecipientInput(toParam);
    if (nameParam) setRecipientName(nameParam);
    if (addrParam) setTargetAddress(addrParam as `0x${string}`);
  }, [searchParams]);

  const handleSelectContact = (contact: UpiContact) => {
    setRecipientInput(contact.upiId);
    setRecipientName(contact.name);
    setTargetAddress(contact.address);
  };

  const amountBigInt = parseLRS(amount);
  const canSend =
    recipientInput.trim().length > 0 &&
    amountBigInt > 0n &&
    lrsBalance !== undefined &&
    amountBigInt <= lrsBalance;

  const handlePayNow = async () => {
    if (!canSend || loading) return;
    setLoading(true);

    try {
      const hash = await send(targetAddress, amountBigInt);
      setLastTxHash(hash ?? null);
      await refetch();
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setAmount("");
    setNote("");
  };

  const formattedInr = formatLRS(lrsBalance);

  return (
    <div className="page-container" style={{ maxWidth: 620, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
            Send Money via UPI
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Instant zero-fee transfer to any bank account or UPI ID
          </p>
        </div>
        <button
          onClick={() => navigate("/receive")}
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            borderRadius: 12,
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          My QR 📥
        </button>
      </div>

      {/* ── Recipient Card (PhonePe Style) ──────────────────────────────────── */}
      <div
        className="fintech-card"
        style={{
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "var(--surface-1)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "#FFFFFF",
            boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
          }}
        >
          {recipientName ? recipientName.slice(0, 2).toUpperCase() : "UPI"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF" }}>
              {recipientName || "UPI Recipient"}
            </span>
            <span style={{ color: "#00E575", fontSize: 12 }}>✓</span>
          </div>
          <input
            type="text"
            value={recipientInput}
            onChange={(e) => {
              setRecipientInput(e.target.value);
              setRecipientName(e.target.value.split("@")[0]);
            }}
            placeholder="Enter UPI ID (e.g. rahul@liquidrs)"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontFamily: "monospace",
              width: "100%",
              outline: "none",
              marginTop: 2,
            }}
          />
        </div>

        <span className="badge badge-success" style={{ fontSize: 10 }}>
          VERIFIED
        </span>
      </div>

      {/* ── Recent Contacts Row ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
          Quick Select Beneficiary
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {UPI_CONTACTS.map((c) => {
            const isSelected = recipientInput === c.upiId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectContact(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 20,
                  background: isSelected ? "rgba(0, 229, 117, 0.15)" : "var(--surface-2)",
                  border: isSelected ? "1px solid #00E575" : "1px solid var(--border-subtle)",
                  color: isSelected ? "#00E575" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{c.avatar}</span>
                <span>{c.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Amount Input Card (super.money Hero Style) ───────────────────────── */}
      <div className="fintech-card" style={{ padding: "28px 24px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
          Enter Transfer Amount
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#00E575" }}>₹</span>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            style={{
              fontSize: 48,
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              outline: "none",
              maxWidth: 260,
              textAlign: "left",
            }}
          />
        </div>

        {/* Quick Amount Preset Chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {AMOUNT_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: amount === p ? "rgba(0, 229, 117, 0.2)" : "var(--surface-2)",
                border: amount === p ? "1px solid #00E575" : "1px solid var(--border-subtle)",
                color: amount === p ? "#00E575" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              +₹{p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount(lrsBalance ? (Number(lrsBalance / 10n ** 18n)).toString() : "0")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Max (₹{formattedInr})
          </button>
        </div>

        {/* Optional Note */}
        <input
          type="text"
          placeholder="Add a message / note (e.g. Dinner, Coffee, Rent)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field"
          style={{ maxWidth: 420, margin: "0 auto", textAlign: "center", fontSize: 13 }}
        />
      </div>

      {/* ── Debited From Account Selector ────────────────────────────────────── */}
      <div
        className="fintech-card"
        style={{
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--surface-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#05140A",
            }}
          >
            ₹
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
              Paying from Liquid Rupee Wallet
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Available: ₹{formattedInr} · 100% Backed
            </div>
          </div>
        </div>

        <span style={{ fontSize: 11, color: "#00E575", fontWeight: 700 }}>
          SELECTED ✓
        </span>
      </div>

      {/* ── Primary Action Button ────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: canSend ? 1.02 : 1 }}
        whileTap={{ scale: canSend ? 0.98 : 1 }}
        onClick={handlePayNow}
        disabled={!canSend || loading}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "16px",
          fontSize: 16,
          fontWeight: 800,
          borderRadius: 16,
        }}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span>Processing Instant UPI Transfer…</span>
          </>
        ) : amount ? (
          <span>Pay ₹{amount} to {recipientName.split(" ")[0]} ⚡</span>
        ) : (
          <span>Enter Amount to Pay</span>
        )}
      </motion.button>

      {/* ── Success Modal with Audio Chime ───────────────────────────────────── */}
      <UpiSuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        amount={amount}
        recipientName={recipientName}
        recipientUpiId={recipientInput}
        note={note}
        txHash={lastTxHash}
      />
    </div>
  );
}
