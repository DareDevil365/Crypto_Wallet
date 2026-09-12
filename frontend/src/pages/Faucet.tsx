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
          toast.success("Auto-topped up with 10,000 USDT test reserves");
        })
        .catch(() => {
          // Silent — user may not have approved yet
        });
    }
  }, [usdtBalance]);

  return (
    <div className="page-container" style={{ maxWidth: 600, margin: "0 auto" }}>
      <PageHeader
        title="Reload USD Reserves"
        subtitle="Claim mock USDT & USDC collateral to mint Liquid RS (L₹S)"
      />

      {/* Current balances */}
      <div
        className="apple-glass-card"
        style={{
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Available Collateral Balances
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
              Mock USDT
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
              ${formatUSDT(usdtBalance)}
            </div>
          </div>
          <div
            style={{ width: 1, background: "rgba(255, 255, 255, 0.08)" }}
          />
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
              Mock USDC
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>
              ${formatUSDT(usdcBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Faucet cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FaucetCard
          symbol="USDT"
          name="Tether Reserve"
          amount="10,000"
          color="#26a17b"
          onClaim={async () => {
            const hash = await claimUSDT();
            await refetchUSDT();
            toast.success("10,000 USDT claimed to reserves");
            return hash;
          }}
        />
        <FaucetCard
          symbol="USDC"
          name="USD Coin Reserve"
          amount="10,000"
          color="#2775ca"
          onClaim={async () => {
            const hash = await claimUSDC();
            await refetchUSDC();
            toast.success("10,000 USDC claimed to reserves");
            return hash;
          }}
        />
      </div>

      {/* Info note */}
      <div
        className="apple-glass-subtle"
        style={{
          marginTop: 24,
          padding: "14px 18px",
          borderRadius: 14,
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        These are <strong style={{ color: "var(--text-secondary)" }}>testnet-only</strong> tokens
        with no real fiat value. Used to simulate 150% over-collateralized issuance of Liquid RS (L₹S).
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
      className="apple-glass-card"
      style={{
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        gap: 18,
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
