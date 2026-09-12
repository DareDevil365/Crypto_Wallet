import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { IconRefresh } from "./Icons";

// DemoReset clears UI-local mock state only (activity feed, AI log, etc.)
// It does NOT reset chain state — for that you'd need to redeploy.
// This lets the presenter run through the demo flow multiple times.

export const DEMO_RESET_EVENT = "liquidrs:demo-reset";

export default function DemoReset() {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    // Fire a custom event that all pages listen to for resetting local state
    window.dispatchEvent(new CustomEvent(DEMO_RESET_EVENT));
    setOpen(false);
    toast.success("Demo state reset — ready to test again!");
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: 180 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.3 }}
        className="demo-reset-btn"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(22, 28, 44, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
        title="Reset Demo State"
      >
        <IconRefresh size={18} color="var(--text-secondary)" />
      </motion.button>

      {/* Confirm modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(4, 6, 12, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              backdropFilter: "blur(16px)",
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="apple-glass-card"
              style={{ padding: "32px 28px", maxWidth: 380, width: "90%", textAlign: "center" }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: "rgba(0, 229, 117, 0.12)",
                  border: "1px solid rgba(0, 229, 117, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 16px rgba(0, 229, 117, 0.15)",
                }}
              >
                <IconRefresh size={24} color="var(--upi-green)" />
              </div>
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  marginBottom: 8,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                Reset Demo State?
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Resets the simulated activity feed, recent transfers, and UI state.
                <br />
                <span style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 4, display: "inline-block" }}>
                  EVM blockchain balances and smart contract positions remain intact.
                </span>
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-secondary"
                  onClick={() => setOpen(false)}
                  style={{ flex: 1, borderRadius: 12 }}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleReset} style={{ flex: 1, borderRadius: 12 }}>
                  Reset Demo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
