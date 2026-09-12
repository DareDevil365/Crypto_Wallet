import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { DemoProvider } from "./context/DemoContext";
import App from "./App";
import { wagmiConfig } from "./wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#C9A84C",
            accentColorForeground: "#060d1a",
            borderRadius: "medium",
            fontStack: "system",
          })}
        >
          <DemoProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0B1F3A",
                  color: "#f0f4ff",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "12px",
                },
                success: { iconTheme: { primary: "#C9A84C", secondary: "#060d1a" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#060d1a" } },
              }}
            />
          </DemoProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
