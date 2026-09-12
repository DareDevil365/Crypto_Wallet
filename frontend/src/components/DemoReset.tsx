import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
    toast.success("Demo state reset — ready to run through again!", {
      icon: "🔄",
      duration: 3000,
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(11,31,58,0.9)",
          border: "1px solid rgba(201,168,76,0.3)",
          color: "var(--text-secondary)",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          transition: "all 0.2s",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
        title="Reset Demo"
      >
        🔄
      </button>

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
              background: "rgba(2,8,16,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{ padding: 32, maxWidth: 380, width: "90%", textAlign: "center" }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔄</div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "var(--text-primary)",
                }}
              >
                Reset Demo?
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Resets the activity feed, AI event log, and UI state.
                <br />
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  Chain state (balances, positions) is not affected.
                </span>
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn-secondary"
                  onClick={() => setOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleReset} style={{ flex: 1 }}>
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
