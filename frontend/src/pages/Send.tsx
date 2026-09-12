import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useLRSBalance,
  useSendLRS,
  useDemoAccount,
  parseLRS,
  formatLRS,
} from "../hooks/useContracts";
import { PageHeader } from "../components/TxButton";
import UpiSuccessModal from "../components/UpiSuccessModal";
import UpiQuickPay, { UPI_CONTACTS, type UpiContact } from "../components/UpiQuickPay";

const AMOUNT_PRESETS = ["100", "250", "500", "1000", "2000"];

export default function Send() {
  const [searchParams] = useSearchParams();
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

  // Read URL query params if clicked from contact list
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
    <div className="page-container" style={{ maxWidth: 640 }}>
      <PageHeader
        title="Pay via UPI"
        subtitle="Instant ₹ transfers to any UPI ID, phone number, or merchant"
      />

      {/* Available Balance pill */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          background: "rgba(201, 168, 76, 0.08)",
          borderRadius: 14,
          border: "1px solid rgba(201, 168, 76, 0.2)",
          marginBottom: 24,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Available Balance:
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#C9A84C",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ₹{formattedInr}
        </span>
      </div>

      {/* Quick Contacts */}
      <UpiQuickPay
        onSelectContact={handleSelectContact}
        selectedUpiId={recipientInput}
      />

      {/* Main Payment Form */}
      <div className="glass-card" style={{ padding: "28px 32px" }}>
        {/* Recipient Input */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Pay to (UPI ID or Mobile)
            </label>
            <button
              type="button"
              onClick={() => handleSelectContact(UPI_CONTACTS[0])}
              style={{
                background: "rgba(201, 168, 76, 0.1)",
                border: "1px solid rgba(201, 168, 76, 0.25)",
                borderRadius: 6,
                padding: "2px 8px",
                color: "#C9A84C",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ⚡ Quick Fill Priya
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
              }}
            >
              👤
            </span>
            <input
              className="input-field"
              placeholder="e.g. priya@liquidrs or 9876543210"
              value={recipientInput}
              onChange={(e) => {
                setRecipientInput(e.target.value);
                setRecipientName(e.target.value);
              }}
              style={{ paddingLeft: 44, fontSize: 15 }}
            />
          </div>
        </div>

        {/* Amount Input */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 8,
            }}
          >
            Enter Amount (₹)
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 24,
                fontWeight: 900,
                color: "#C9A84C",
              }}
            >
              ₹
            </span>
            <input
              className="input-field"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                paddingLeft: 44,
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#ffffff",
              }}
            />
          </div>

          {/* Quick Amount Chips */}
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  background:
                    amount === preset
                      ? "rgba(201, 168, 76, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                  border:
                    amount === preset
                      ? "1px solid #C9A84C"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  color: amount === preset ? "#C9A84C" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                +₹{preset}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount(lrsBalance ? (Number(lrsBalance / 10n ** 18n)).toString() : "0")}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(201, 168, 76, 0.1)",
                border: "1px solid rgba(201, 168, 76, 0.3)",
                color: "#C9A84C",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Note / Purpose Input */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 8,
            }}
          >
            Add a Note (Optional)
          </label>
          <input
            className="input-field"
            placeholder="e.g. Dinner, Chai, Split bill ☕"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ fontSize: 14 }}
          />
        </div>

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: canSend && !loading ? 1.02 : 1 }}
          whileTap={{ scale: canSend && !loading ? 0.98 : 1 }}
          onClick={handlePayNow}
          disabled={!canSend || loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            background:
              canSend && !loading
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "rgba(255, 255, 255, 0.08)",
            border: "none",
            color: canSend && !loading ? "#ffffff" : "var(--text-muted)",
            fontSize: 16,
            fontWeight: 800,
            cursor: canSend && !loading ? "pointer" : "not-allowed",
            boxShadow:
              canSend && !loading
                ? "0 0 25px rgba(16, 185, 129, 0.35)"
                : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            letterSpacing: "0.3px",
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span>Processing UPI Payment...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>
                {amount ? `Pay ₹${amount} Now` : "Enter Amount to Pay"}
              </span>
            </>
          )}
        </motion.button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 16,
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <span>🔒</span>
          <span>Zero Transfer Fees · Settled on EVM L2 in &lt;1 second</span>
        </div>
      </div>

      {/* Success Modal */}
      <UpiSuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        amount={amount}
        recipientName={recipientName || "Recipient"}
        recipientUpiId={recipientInput}
        note={note}
        txHash={lastTxHash}
      />
    </div>
  );
}
