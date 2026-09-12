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
import { LIQ_CONTACTS, type LiqContact } from "../components/UpiQuickPay";
import { IconQrCode, IconCheck, IconArrowUpRight, IconZap } from "../components/Icons";

const AMOUNT_PRESETS = ["100", "250", "500", "1000", "2000"];

export default function Send() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recipientInput, setRecipientInput] = useState("priya@liq");
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

  const handleSelectContact = (contact: LiqContact) => {
    setRecipientInput(contact.liqId);
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
    <div className="page-container" style={{ maxWidth: 580, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              LIQ EXCHANGE · L₹S PROTOCOL
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Send Liquid RS (L₹S)
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Instant ₹-pegged crypto settlement to any Liq ID or EVM address
          </p>
        </div>
        <button
          onClick={() => navigate("/receive")}
          className="btn-secondary"
          style={{
            borderRadius: 14,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            gap: 6,
          }}
        >
          <IconQrCode size={15} color="var(--upi-green)" />
          <span>My Liq QR</span>
        </button>
      </div>

      {/* ── Recipient Card (Apple Glass Style) ──────────────────────────────────── */}
      <div
        className="apple-glass-card"
        style={{
          padding: "16px 18px",
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.1) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
            color: "#A5B4FC",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.15)",
            letterSpacing: "0.5px",
          }}
        >
          {recipientName ? recipientName.slice(0, 2).toUpperCase() : "LIQ"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
              {recipientName || "Liq ID Recipient"}
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "rgba(0, 229, 117, 0.18)",
              }}
            >
              <IconCheck size={11} color="#00E575" strokeWidth={2.5} />
            </div>
          </div>
          <input
            type="text"
            value={recipientInput}
            onChange={(e) => {
              setRecipientInput(e.target.value);
              setRecipientName(e.target.value.split("@")[0]);
            }}
            placeholder="Enter Liq ID (e.g. rahul@liq)"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontFamily: "monospace",
              width: "100%",
              outline: "none",
              marginTop: 3,
            }}
          />
        </div>

        <span className="badge badge-success" style={{ fontSize: 10, padding: "3px 8px" }}>
          LIQ ID VERIFIED
        </span>
      </div>

      {/* ── Beneficiary Row (Initials Monograms, Zero Emojis) ─────────────────────────────── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>
          Quick Select Liq Beneficiary
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {LIQ_CONTACTS.map((c) => {
            const isSelected = recipientInput === c.liqId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectContact(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 12px",
                  borderRadius: 14,
                  background: isSelected ? "rgba(0, 229, 117, 0.12)" : "rgba(255, 255, 255, 0.04)",
                  border: isSelected ? "1px solid #00E575" : "1px solid rgba(255, 255, 255, 0.08)",
                  color: isSelected ? "#00E575" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s ease",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: `${c.color}25`,
                    border: `1px solid ${c.color}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#FFFFFF",
                  }}
                >
                  {c.initials}
                </div>
                <span>{c.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Amount Input Card (Apple Frosted Glass) ───────────────────────── */}
      <div
        className="apple-glass-card"
        style={{
          padding: "26px 22px",
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Transfer Amount · Liquid RS (L₹S)
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "var(--upi-green)", fontVariantNumeric: "tabular-nums" }}>₹</span>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            style={{
              fontSize: 52,
              fontWeight: 800,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', sans-serif",
              fontVariantNumeric: "tabular-nums",
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              outline: "none",
              maxWidth: 240,
              textAlign: "left",
              letterSpacing: "-0.04em",
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            L₹S
          </span>
        </div>

        {/* Quick Amount Preset Chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {AMOUNT_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p)}
              className="btn-pill"
              style={{
                background: amount === p ? "rgba(0, 229, 117, 0.16)" : "rgba(255, 255, 255, 0.04)",
                borderColor: amount === p ? "#00E575" : "rgba(255, 255, 255, 0.08)",
                color: amount === p ? "#00E575" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              +₹{p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount(lrsBalance ? (Number(lrsBalance / 10n ** 18n)).toString() : "0")}
            className="btn-pill"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Max (₹{formattedInr})
          </button>
        </div>

        {/* Optional Note */}
        <input
          type="text"
          placeholder="Add a payment note (e.g. Dinner, Coffee, Rent)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field"
          style={{ maxWidth: 400, margin: "0 auto", textAlign: "center", fontSize: 13, padding: "10px 14px" }}
        />
      </div>

      {/* ── Debited From Account Selector (Apple Glass) ───────────────────────── */}
      <div
        className="apple-glass-card"
        style={{
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: "linear-gradient(135deg, #00E575 0%, #00B359 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "#031408",
              boxShadow: "0 2px 10px rgba(0, 229, 117, 0.3)",
            }}
          >
            ₹
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 6 }}>
              <span>Liquid RS (L₹S) Crypto Balance</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
              Available: ₹{formattedInr} L₹S · 1:1 INR Pegged
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "#00E575",
            fontWeight: 700,
            background: "rgba(0, 229, 117, 0.1)",
            padding: "3px 8px",
            borderRadius: 20,
            border: "1px solid rgba(0, 229, 117, 0.25)",
          }}
        >
          <IconCheck size={11} color="#00E575" strokeWidth={2.5} />
          <span>Active</span>
        </div>
      </div>

      {/* ── Primary Action Button ────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: canSend ? 1.015 : 1 }}
        whileTap={{ scale: canSend ? 0.985 : 1 }}
        onClick={handlePayNow}
        disabled={!canSend || loading}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "16px",
          fontSize: 15,
          fontWeight: 700,
          borderRadius: 16,
          letterSpacing: "-0.01em",
        }}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span>Settling Instant L₹S Transfer on EVM…</span>
          </>
        ) : amount ? (
          <>
            <span>Pay ₹{amount} L₹S to {recipientName.split(" ")[0]}</span>
            <IconArrowUpRight size={17} strokeWidth={2.5} />
          </>
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
        recipientLiqId={recipientInput}
        note={note}
        txHash={lastTxHash}
      />
    </div>
  );
}
