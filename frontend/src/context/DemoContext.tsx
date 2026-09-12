/**
 * DemoContext.tsx
 *
 * Provides a fake "connected wallet" state for live demos.
 * When DEMO_MODE is active:
 *   - All contract reads return pre-seeded mock balances
 *   - All writes show a realistic ~900ms "pending" then "success" state
 *   - No MetaMask / wallet extension needed
 *   - Persisted in sessionStorage across page refreshes
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ── Demo wallet state ──────────────────────────────────────────────────────

export interface DemoState {
  lrsBalance: bigint;
  usdtBalance: bigint;
  usdcBalance: bigint;
  collateral: bigint;
  lrsMinted: bigint;
  pegPrice: bigint;
  collateralRatio: bigint;
  paused: boolean;
  address: `0x${string}`;
}

// Well-formed 40-char EVM address for demo mode
export const DEMO_WALLET_ADDRESS =
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;

const INITIAL_DEMO_STATE: DemoState = {
  lrsBalance: 25_000n * 10n ** 18n, // ₹25,000 pre-seeded for instant UPI transfer demo
  usdtBalance: 10_000n * 10n ** 6n,  // 10,000 USDT pre-seeded
  usdcBalance: 5_000n * 10n ** 6n,   // 5,000 USDC pre-seeded
  collateral: 450n * 10n ** 6n,     // 450 USDT locked
  lrsMinted: 25_000n * 10n ** 18n,  // 25,000 LRS minted
  pegPrice: 8300n,                   // ₹83.00
  collateralRatio: 15000n,           // 150%
  paused: false,
  address: DEMO_WALLET_ADDRESS,
};

// ── Context ────────────────────────────────────────────────────────────────

interface DemoContextType {
  isDemo: boolean;
  state: DemoState;
  enableDemo: () => void;
  disableDemo: () => void;
  /** Simulate a write: waits ~900ms, applies updater, resolves with fake hash */
  demoWrite: (
    updater: (prev: DemoState) => DemoState
  ) => Promise<`0x${string}`>;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("liquidrs_demo") === "true";
    } catch {
      return false;
    }
  });

  const [state, setState] = useState<DemoState>(INITIAL_DEMO_STATE);

  // Listen for reset demo event
  useEffect(() => {
    const handleReset = () => {
      setState(INITIAL_DEMO_STATE);
    };
    window.addEventListener("liquidrs:demo-reset", handleReset);
    return () => window.removeEventListener("liquidrs:demo-reset", handleReset);
  }, []);

  const enableDemo = useCallback(() => {
    setIsDemo(true);
    try {
      sessionStorage.setItem("liquidrs_demo", "true");
    } catch {}
    setState(INITIAL_DEMO_STATE);
  }, []);

  const disableDemo = useCallback(() => {
    setIsDemo(false);
    try {
      sessionStorage.removeItem("liquidrs_demo");
    } catch {}
  }, []);

  const demoWrite = useCallback(
    (updater: (prev: DemoState) => DemoState): Promise<`0x${string}`> => {
      return new Promise((resolve) => {
        // Simulate network latency
        setTimeout(() => {
          setState(updater);
          resolve(
            "0x9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a" as `0x${string}`
          );
        }, 900);
      });
    },
    []
  );

  return (
    <DemoContext.Provider
      value={{ isDemo, state, enableDemo, disableDemo, demoWrite }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoContext must be used inside DemoProvider");
  return ctx;
}
