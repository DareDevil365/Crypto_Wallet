/**
 * useContracts.ts
 *
 * All contract hooks. When DemoContext.isDemo is true, every hook returns
 * mock data from DemoContext.state instead of hitting wagmi/viem.
 * Write hooks (mint, redeem, send, faucet) call demoWrite() which
 * applies a state updater and resolves after ~1 second.
 */

import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { LiquidRS_ABI, MockUSDT_ABI, MockUSDC_ABI, Vault_ABI } from "../constants/abis";
import addresses from "../constants/addresses.json";
import { useDemoContext } from "../context/DemoContext";

// ── Typed contract addresses ────────────────────────────────────────────────

const ADDRESSES = {
  LiquidRS: addresses.LiquidRS as `0x${string}`,
  MockUSDT: addresses.MockUSDT as `0x${string}`,
  MockUSDC: addresses.MockUSDC as `0x${string}`,
  Vault: addresses.Vault as `0x${string}`,
};

export { ADDRESSES };

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Returns { data: T | undefined, refetch: () => void } shaped like useReadContract */
function mockRead<T>(value: T) {
  return { data: value, isLoading: false, refetch: async () => {} } as const;
}

// ── LRS Balance ──────────────────────────────────────────────────────────────

export function useLRSBalance() {
  const { isDemo, state } = useDemoContext();
  const { address } = useAccount();
  const result = useReadContract({
    address: ADDRESSES.LiquidRS,
    abi: LiquidRS_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !isDemo && !!address, refetchInterval: 5000 },
  });
  if (isDemo) return mockRead(state.lrsBalance);
  return { ...result, data: result.data as bigint | undefined };
}

// ── USDT Balance ─────────────────────────────────────────────────────────────

export function useUSDTBalance() {
  const { isDemo, state } = useDemoContext();
  const { address } = useAccount();
  const result = useReadContract({
    address: ADDRESSES.MockUSDT,
    abi: MockUSDT_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !isDemo && !!address, refetchInterval: 5000 },
  });
  if (isDemo) return mockRead(state.usdtBalance);
  return { ...result, data: result.data as bigint | undefined };
}

// ── USDC Balance ─────────────────────────────────────────────────────────────

export function useUSDCBalance() {
  const { isDemo, state } = useDemoContext();
  const { address } = useAccount();
  const result = useReadContract({
    address: ADDRESSES.MockUSDC,
    abi: MockUSDC_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !isDemo && !!address, refetchInterval: 5000 },
  });
  if (isDemo) return mockRead(state.usdcBalance);
  return { ...result, data: result.data as bigint | undefined };
}

// ── Vault State ──────────────────────────────────────────────────────────────

export function useVaultState() {
  const { isDemo, state } = useDemoContext();
  const pegPrice = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "pegPrice",
    query: { enabled: !isDemo, refetchInterval: 10000 },
  });
  const collateralRatio = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "collateralRatio",
    query: { enabled: !isDemo, refetchInterval: 10000 },
  });
  const paused = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "paused",
    query: { enabled: !isDemo, refetchInterval: 5000 },
  });

  if (isDemo) {
    return {
      pegPrice: state.pegPrice,
      collateralRatio: state.collateralRatio,
      paused: state.paused,
      isLoading: false,
    };
  }
  return {
    pegPrice: pegPrice.data as bigint | undefined,
    collateralRatio: collateralRatio.data as bigint | undefined,
    paused: (paused.data as boolean | undefined) ?? false,
    isLoading: pegPrice.isLoading || collateralRatio.isLoading,
  };
}

// ── User Vault Position ──────────────────────────────────────────────────────

export function useUserPosition() {
  const { isDemo, state } = useDemoContext();
  const { address } = useAccount();
  const collateral = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "collateralOf",
    args: [address!],
    query: { enabled: !isDemo && !!address, refetchInterval: 5000 },
  });
  const lrsMinted = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "lrsMintedOf",
    args: [address!],
    query: { enabled: !isDemo && !!address, refetchInterval: 5000 },
  });

  if (isDemo) {
    return { collateral: state.collateral, lrsMinted: state.lrsMinted };
  }
  return {
    collateral: (collateral.data as bigint | undefined) ?? 0n,
    lrsMinted: (lrsMinted.data as bigint | undefined) ?? 0n,
  };
}

// ── Preview Mint ─────────────────────────────────────────────────────────────

export function usePreviewMint(collateralUSDT: string) {
  const { isDemo, state } = useDemoContext();
  const amount = parseUSDT(collateralUSDT);

  // Demo: replicate the Vault formula client-side
  if (isDemo) {
    const preview =
      amount > 0n
        ? (amount * state.pegPrice * 100n * 10n ** 18n) /
          (state.collateralRatio * 10n ** 6n)
        : undefined;
    return mockRead(preview);
  }

  const result = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "previewMint",
    args: [amount],
    query: { enabled: amount > 0n },
  });
  return { ...result, data: result.data as bigint | undefined };
}

// ── Preview Redeem ───────────────────────────────────────────────────────────

export function usePreviewRedeem(lrsAmount: string) {
  const { isDemo, state } = useDemoContext();
  const { address } = useAccount();
  const amount = parseLRS(lrsAmount);

  if (isDemo) {
    // proportional redeem: burn lrsAmount / lrsMinted * collateral
    const preview =
      amount > 0n && state.lrsMinted > 0n
        ? (amount * state.collateral) / state.lrsMinted
        : undefined;
    return mockRead(preview);
  }

  const result = useReadContract({
    address: ADDRESSES.Vault,
    abi: Vault_ABI,
    functionName: "previewRedeem",
    args: [address!, amount],
    query: { enabled: !!address && amount > 0n },
  });
  return { ...result, data: result.data as bigint | undefined };
}

// ── Write: Faucet ─────────────────────────────────────────────────────────────

export function useFaucet() {
  const { isDemo, demoWrite } = useDemoContext();
  const { writeContractAsync } = useWriteContract();

  if (isDemo) {
    return {
      claimUSDT: () =>
        demoWrite((s) => ({
          ...s,
          usdtBalance: s.usdtBalance + 10_000n * 10n ** 6n,
        })),
      claimUSDC: () =>
        demoWrite((s) => ({
          ...s,
          usdcBalance: s.usdcBalance + 10_000n * 10n ** 6n,
        })),
    };
  }

  return {
    claimUSDT: () =>
      writeContractAsync({
        address: ADDRESSES.MockUSDT,
        abi: MockUSDT_ABI,
        functionName: "faucet",
      }),
    claimUSDC: () =>
      writeContractAsync({
        address: ADDRESSES.MockUSDC,
        abi: MockUSDC_ABI,
        functionName: "faucet",
      }),
  };
}

// ── Write: Approve + Mint ─────────────────────────────────────────────────────

export function useMint() {
  const { isDemo, state, demoWrite } = useDemoContext();
  const { writeContractAsync } = useWriteContract();

  if (isDemo) {
    return {
      approve: async (_amount: bigint) =>
        "0xDemoApproveTx" as `0x${string}`,
      lockAndMint: (amount: bigint) => {
        const lrsOut =
          (amount * state.pegPrice * 100n * 10n ** 18n) /
          (state.collateralRatio * 10n ** 6n);
        return demoWrite((s) => ({
          ...s,
          usdtBalance: s.usdtBalance - amount,
          collateral: s.collateral + amount,
          lrsMinted: s.lrsMinted + lrsOut,
          lrsBalance: s.lrsBalance + lrsOut,
        }));
      },
    };
  }

  return {
    approve: (amount: bigint) =>
      writeContractAsync({
        address: ADDRESSES.MockUSDT,
        abi: MockUSDT_ABI,
        functionName: "approve",
        args: [ADDRESSES.Vault, amount],
      }),
    lockAndMint: (amount: bigint) =>
      writeContractAsync({
        address: ADDRESSES.Vault,
        abi: Vault_ABI,
        functionName: "lockAndMint",
        args: [amount],
      }),
  };
}

// ── Write: Redeem ─────────────────────────────────────────────────────────────

export function useRedeem() {
  const { isDemo, state, demoWrite } = useDemoContext();
  const { writeContractAsync } = useWriteContract();

  if (isDemo) {
    return {
      burnAndRedeem: (lrsAmount: bigint) => {
        const usdtBack =
          state.lrsMinted > 0n
            ? (lrsAmount * state.collateral) / state.lrsMinted
            : 0n;
        return demoWrite((s) => ({
          ...s,
          lrsBalance: s.lrsBalance - lrsAmount,
          lrsMinted: s.lrsMinted - lrsAmount,
          collateral: s.collateral - usdtBack,
          usdtBalance: s.usdtBalance + usdtBack,
        }));
      },
    };
  }

  return {
    burnAndRedeem: (lrsAmount: bigint) =>
      writeContractAsync({
        address: ADDRESSES.Vault,
        abi: Vault_ABI,
        functionName: "burnAndRedeem",
        args: [lrsAmount],
      }),
  };
}

// ── Write: Send LRS ───────────────────────────────────────────────────────────

export function useSendLRS() {
  const { isDemo, demoWrite } = useDemoContext();
  const { writeContractAsync } = useWriteContract();

  if (isDemo) {
    return {
      send: (to: `0x${string}`, amount: bigint) =>
        demoWrite((s) => ({
          ...s,
          lrsBalance: s.lrsBalance > amount ? s.lrsBalance - amount : 0n,
        })),
    };
  }

  return {
    send: (to: `0x${string}`, amount: bigint) =>
      writeContractAsync({
        address: ADDRESSES.LiquidRS,
        abi: LiquidRS_ABI,
        functionName: "transfer",
        args: [to, amount],
      }),
  };
}

// ── Account (demo-aware) ──────────────────────────────────────────────────────

export function useDemoAccount() {
  const { isDemo, state } = useDemoContext();
  const { address, isConnected } = useAccount();
  return {
    address: isDemo ? state.address : address,
    isConnected: isDemo ? true : isConnected,
  };
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function parseUSDT(val: string): bigint {
  try {
    if (!val || val === ".") return 0n;
    return parseUnits(val, 6);
  } catch {
    return 0n;
  }
}

export function parseLRS(val: string): bigint {
  try {
    if (!val || val === ".") return 0n;
    return parseUnits(val, 18);
  } catch {
    return 0n;
  }
}

export function formatUSDT(val: bigint | undefined): string {
  if (val === undefined) return "0.00";
  return Number(formatUnits(val, 6)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatLRS(val: bigint | undefined): string {
  if (val === undefined) return "0.00";
  return Number(formatUnits(val, 18)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function getExplorerUrl(hash: string, chainId: number): string {
  if (chainId === 31337) return `http://localhost:8545`;
  if (chainId === 84532) return `https://sepolia.basescan.org/tx/${hash}`;
  return `#`;
}
