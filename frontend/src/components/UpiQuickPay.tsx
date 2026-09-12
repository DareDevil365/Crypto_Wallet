import { motion } from "framer-motion";

export interface UpiContact {
  id: string;
  name: string;
  upiId: string;
  address: `0x${string}`;
  initials: string;
  color: string;
  recentAmount?: string;
  isMerchant?: boolean;
}

export const UPI_CONTACTS: UpiContact[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    upiId: "priya@liquidrs",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    initials: "PS",
    color: "#6366F1",
    recentAmount: "₹500",
  },
  {
    id: "c2",
    name: "Rahul Verma",
    upiId: "rahul@liquidrs",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    initials: "RV",
    color: "#00E575",
    recentAmount: "₹1,200",
  },
  {
    id: "c3",
    name: "Chai Point",
    upiId: "chaipoint@liquidrs",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    initials: "CP",
    color: "#F59E0B",
    recentAmount: "₹80",
    isMerchant: true,
  },
  {
    id: "c4",
    name: "Ananya Sen",
    upiId: "ananya@liquidrs",
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    initials: "AS",
    color: "#EC4899",
    recentAmount: "₹2,500",
  },
  {
    id: "c5",
    name: "Rohit Mehra",
    upiId: "rohit@liquidrs",
    address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
    initials: "RM",
    color: "#38BDF8",
    recentAmount: "₹350",
  },
];

interface UpiQuickPayProps {
  onSelectContact: (contact: UpiContact) => void;
  selectedUpiId?: string;
}

export default function UpiQuickPay({
  onSelectContact,
  selectedUpiId,
}: UpiQuickPayProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          Recent Transfers
        </span>
        <span style={{ fontSize: 11, color: "var(--upi-green)", fontWeight: 600 }}>
          Tap to Pay
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 6,
          scrollbarWidth: "none",
        }}
      >
        {UPI_CONTACTS.map((contact) => {
          const isSelected = selectedUpiId === contact.upiId;
          return (
            <motion.button
              key={contact.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectContact(contact)}
              className="apple-glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: isSelected
                  ? "rgba(0, 229, 117, 0.12)"
                  : "rgba(255, 255, 255, 0.03)",
                border: isSelected
                  ? "1px solid #00E575"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: "12px 10px",
                minWidth: 84,
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                transition: "all 0.2s",
              }}
            >
              {contact.isMerchant && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    fontSize: 8,
                    fontWeight: 800,
                    background: "rgba(245, 158, 11, 0.2)",
                    color: "#F59E0B",
                    padding: "1px 4px",
                    borderRadius: 4,
                    letterSpacing: "0.5px",
                  }}
                >
                  SHOP
                </span>
              )}

              {/* Monogram circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${contact.color}22, ${contact.color}55)`,
                  border: `1.5px solid ${contact.color}88`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: 6,
                  boxShadow: `0 4px 12px ${contact.color}22`,
                }}
              >
                {contact.initials}
              </div>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 72,
                }}
              >
                {contact.name.split(" ")[0]}
              </span>

              <span
                style={{
                  fontSize: 9,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {contact.recentAmount}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
