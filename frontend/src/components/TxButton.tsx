import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
          >
            ✓ {successLabel}
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

// ── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: string;
  accent?: boolean;
}

export function StatCard({ label, value, subValue, icon, accent }: StatCardProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "20px 24px",
        border: accent
          ? "1px solid rgba(201,168,76,0.3)"
          : "1px solid rgba(201,168,76,0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          color: "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          fontFamily: "'Space Grotesk', sans-serif",
          background: accent
            ? "linear-gradient(135deg, #C9A84C 0%, #e8d48e 100%)"
            : undefined,
          WebkitBackgroundClip: accent ? "text" : undefined,
          WebkitTextFillColor: accent ? "transparent" : undefined,
          color: accent ? undefined : "var(--text-primary)",
        }}
      >
        {value}
      </div>
      {subValue && (
        <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-muted)" }}>
          {subValue}
        </div>
      )}
    </div>
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
            fontFamily: "'Space Grotesk', sans-serif",
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
