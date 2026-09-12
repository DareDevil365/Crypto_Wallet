import { useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  useUSDTBalance,
  useUSDCBalance,
  useFaucet,
  formatUSDT,
} from "../hooks/useContracts";
import TxButton, { PageHeader } from "../components/TxButton";

export default function Faucet() {
  const { data: usdtBalance, refetch: refetchUSDT } = useUSDTBalance();
  const { data: usdcBalance, refetch: refetchUSDC } = useUSDCBalance();
  const { claimUSDT, claimUSDC } = useFaucet();

  // Auto-claim USDT on first load if balance is zero
  // This ensures the very first screen already looks alive
  useEffect(() => {
    if (usdtBalance !== undefined && usdtBalance === 0n) {
      claimUSDT()
        .then(() => {
          refetchUSDT();
          toast.success("Auto-topped up with 10,000 USDT!", { icon: "💧" });
        })
        .catch(() => {
          // Silent — user may not have approved yet
        });
    }
  }, [usdtBalance]);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 640 }}>
      <PageHeader
        title="Get Test Funds"
        subtitle="Claim mock USDT and USDC to use as collateral in the demo"
      />

      {/* Current balances */}
      <div
        className="glass-card"
        style={{
          padding: "20px 24px",
          marginBottom: 24,
          border: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.5px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Current Balances
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
              Mock USDT
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
              ${formatUSDT(usdtBalance)}
            </div>
          </div>
          <div
            style={{ width: 1, background: "rgba(201,168,76,0.1)" }}
          />
          <div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
              Mock USDC
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
              ${formatUSDT(usdcBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Faucet cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FaucetCard
          symbol="USDT"
          name="Mock Tether"
          amount="10,000"
          color="#26a17b"
          onClaim={async () => {
            const hash = await claimUSDT();
            await refetchUSDT();
            toast.success("10,000 USDT claimed!", { icon: "💵" });
            return hash;
          }}
        />
        <FaucetCard
          symbol="USDC"
          name="Mock USD Coin"
          amount="10,000"
          color="#2775ca"
          onClaim={async () => {
            const hash = await claimUSDC();
            await refetchUSDC();
            toast.success("10,000 USDC claimed!", { icon: "🔵" });
            return hash;
          }}
        />
      </div>

      {/* Info note */}
      <div
        style={{
          marginTop: 28,
          padding: "14px 18px",
          borderRadius: 10,
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.1)",
          fontSize: 13,
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        💡 These are <strong style={{ color: "var(--text-secondary)" }}>testnet-only</strong> tokens
        with no real value. Claim as many times as you like. The faucet is a
        public contract function — no auth required.
      </div>
    </div>
  );
}

function FaucetCard({
  symbol,
  name,
  amount,
  color,
  onClaim,
}: {
  symbol: string;
  name: string;
  amount: string;
  color: string;
  onClaim: () => Promise<string | undefined>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card"
      style={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Token icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 900,
          color: "white",
          flexShrink: 0,
        }}
      >
        {symbol[0]}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 2,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Receive {amount} {symbol} per claim · unlimited
        </div>
      </div>

      <TxButton
        onClick={onClaim}
        label={`Get ${amount} ${symbol}`}
        loadingLabel="Claiming…"
        successLabel="Claimed!"
        style={{ minWidth: 160 }}
      />
    </motion.div>
  );
}
