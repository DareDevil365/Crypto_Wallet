import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { IconCheck } from "./Icons";

interface TxButtonProps {
  onClick: () => Promise<string | undefined>;
  label: string;
  loadingLabel?: string;
  successLabel?: string;
  className?: string;
  disabled?: boolean;
  onSuccess?: (hash: string) => void;
  style?: React.CSSProperties;
}

/**
 * TxButton — wraps any contract write with loading, error, and success states.
 * Never shows a raw revert or blank screen — always provides user feedback.
 */
export default function TxButton({
  onClick,
  label,
  loadingLabel = "Confirming…",
  successLabel = "Success!",
  className = "btn-primary",
  disabled = false,
  onSuccess,
  style,
}: TxButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async () => {
    if (status === "loading" || disabled) return;
    setStatus("loading");
    try {
      const hash = await onClick();
      setStatus("success");
      if (hash && onSuccess) onSuccess(hash);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("idle");
      // Parse user-readable error message
      const msg =
        err?.shortMessage ||
        err?.message?.split("\n")[0]?.slice(0, 120) ||
        "Transaction failed";
      toast.error(msg, { duration: 5000 });
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled || status === "loading"}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...style }}
    >
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span className="spinner" />
            {loadingLabel}
          </motion.span>
        )}
        {status === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <IconCheck size={14} strokeWidth={2.5} />
            <span>{successLabel}</span>
          </motion.span>
        )}
        {status === "idle" && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ── Page Header ────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: { label: string; type: "success" | "warning" | "error" };
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: "inherit",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h1>
        {badge && (
          <span className={`badge badge-${badge.type}`}>
            {badge.label}
          </span>
        )}
      </div>
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>{subtitle}</p>
      )}
    </div>
  );
}
