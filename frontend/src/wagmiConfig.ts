import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, baseSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "LiquidRS",
  projectId: "liquidrs-demo-hackathon", // WalletConnect project ID (works for demo)
  chains: [hardhat, baseSepolia],
  ssr: false,
});

export { hardhat, baseSepolia };
