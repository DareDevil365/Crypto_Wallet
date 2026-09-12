import { motion } from "framer-motion";

export interface UpiContact {
  id: string;
  name: string;
  upiId: string;
  address: `0x${string}`;
  avatar: string;
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
    avatar: "👩‍💼",
    initials: "PS",
    color: "#ec4899",
    recentAmount: "₹500",
  },
  {
    id: "c2",
    name: "Rahul Verma",
    upiId: "rahul@liquidrs",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    avatar: "👨‍💻",
    initials: "RV",
    color: "#3b82f6",
    recentAmount: "₹1,200",
  },
  {
    id: "c3",
    name: "Chai Point",
    upiId: "chaipoint@liquidrs",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    avatar: "☕",
    initials: "CP",
    color: "#f59e0b",
    recentAmount: "₹80",
    isMerchant: true,
  },
  {
    id: "c4",
    name: "Ananya Sen",
    upiId: "ananya@liquidrs",
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    avatar: "🎨",
    initials: "AS",
    color: "#8b5cf6",
    recentAmount: "₹2,500",
  },
  {
    id: "c5",
    name: "Rohit Mehra",
    upiId: "rohit@liquidrs",
    address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
    avatar: "🚀",
    initials: "RM",
    color: "#10b981",
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
          Recent People & Merchants
        </span>
        <span style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600 }}>
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
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: isSelected
                  ? "rgba(201, 168, 76, 0.15)"
                  : "rgba(255, 255, 255, 0.03)",
                border: isSelected
                  ? "1px solid #C9A84C"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 14,
                padding: "12px 10px",
                minWidth: 84,
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                transition: "border 0.2s",
              }}
            >
              {contact.isMerchant && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    fontSize: 8,
                    fontWeight: 700,
                    background: "rgba(201, 168, 76, 0.2)",
                    color: "#C9A84C",
                    padding: "1px 4px",
                    borderRadius: 4,
                  }}
                >
                  SHOP
                </span>
              )}

              {/* Avatar circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${contact.color}33, ${contact.color}88)`,
                  border: `2px solid ${contact.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 6,
                }}
              >
                {contact.avatar}
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
