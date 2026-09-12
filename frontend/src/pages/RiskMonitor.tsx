/**
 * RiskMonitor.tsx
 *
 * ⚠️  UI MOCK — PLANNED AI LAYER (NOT YET BUILT)
 *
 * This screen is a visual prototype of the AI risk monitoring system
 * described in the LiquidRS roadmap. ALL DATA ON THIS SCREEN IS:
 * - Simulated client-side using Math.random() within safe bands
 * - NOT connected to any trained ML model
 * - NOT reading from a live oracle or risk engine
 *
 * The purpose is to make the roadmap tangible for hackathon judges.
 * If a judge asks to see the model: show them this comment.
 *
 * Planned production architecture (out of scope for hackathon):
 * - Real-time FX volatility model (GARCH/LSTM) for de-peg prediction
 * - Multi-DEX liquidity router using AMM depth data
 * - Chainlink price feed integration for INR/USD rate
 * - On-chain risk engine that calls Vault.updateCollateralRatio() automatically
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useVaultState } from "../hooks/useContracts";
import { PageHeader } from "../components/TxButton";
import { DEMO_RESET_EVENT } from "../components/DemoReset";

// ── Simulated peg stability chart data ─────────────────────────────────────

function generatePegData(count = 60) {
  const now = Date.now();
  const data = [];
  let peg = 1.0;
  for (let i = count - 1; i >= 0; i--) {
    // Random walk within ±0.003 band (realistic for a pegged asset)
    peg += (Math.random() - 0.5) * 0.002;
    peg = Math.max(0.996, Math.min(1.004, peg));
    data.push({
      time: new Date(now - i * 60_000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      USDT: parseFloat(peg.toFixed(4)),
      USDC: parseFloat(
        Math.max(0.997, Math.min(1.003, peg + (Math.random() - 0.5) * 0.001)).toFixed(4)
      ),
    });
  }
  return data;
}

// ── Simulated AI risk events ────────────────────────────────────────────────

const BASE_AI_EVENTS = [
  {
    id: 1,
    icon: "◉",
    color: "#22c55e",
    text: "De-peg risk: normal — USDT/USDC within 0.3% of parity",
    time: "2 min ago",
  },
  {
    id: 2,
    icon: "✦",
    color: "#C9A84C",
    text: "Liquidity route optimised across 3 DEXs — saved 0.4% slippage",
    time: "7 min ago",
  },
  {
    id: 3,
    icon: "⬡",
    color: "#60a5fa",
    text: "Collateral ratio adjusted 150% → 158% (elevated INR volatility detected)",
    time: "22 min ago",
  },
  {
    id: 4,
    icon: "◉",
    color: "#22c55e",
    text: "Vault health check passed — all 47 positions within safe bounds",
    time: "31 min ago",
  },
  {
    id: 5,
    icon: "✦",
    color: "#f59e0b",
    text: "FX model update: INR/USD momentum shifted +0.12σ — monitoring",
    time: "48 min ago",
  },
  {
    id: 6,
    icon: "⬡",
    color: "#60a5fa",
    text: "Slippage model retrained on 24h DEX volume — accuracy improved 2.1%",
    time: "1h 4min ago",
  },
];

// ── Radial Gauge SVG ────────────────────────────────────────────────────────

function RadialGauge({
  value,
  min = 100,
  max = 200,
  recommended,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  recommended: number;
  label: string;
}) {
  const pct = (value - min) / (max - min);
  const recommendedPct = (recommended - min) / (max - min);
  const angle = -135 + pct * 270;
  const recAngle = -135 + recommendedPct * 270;

  const radius = 70;
  const cx = 90;
  const cy = 90;

  function polarToXY(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(startAngle: number, endAngle: number, r: number) {
    const start = polarToXY(startAngle, r);
    const end = polarToXY(endAngle, r);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="180" height="120" viewBox="0 0 180 120">
        {/* Track */}
        <path
          d={describeArc(-135, 135, radius)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={describeArc(-135, -135 + pct * 270, radius)}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Recommended marker */}
        {(() => {
          const p = polarToXY(recAngle, radius);
          return (
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill="#C9A84C"
              stroke="#060d1a"
              strokeWidth={2}
            />
          );
        })()}
        {/* Value text */}
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fill="#f0f4ff"
          fontSize="20"
          fontWeight="800"
          fontFamily="'Space Grotesk', sans-serif"
        >
          {value}%
        </text>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          fontWeight="500"
        >
          {label}
        </text>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="60%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -8 }}>
        <span style={{ color: "#C9A84C" }}>●</span> AI-recommended: {recommended}%
        · Baseline: 150%
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function RiskMonitor() {
  const { collateralRatio } = useVaultState();

  // Simulated data
  const [pegData, setPegData] = useState(generatePegData);
  const [aiRatio, setAiRatio] = useState(158);
  const [aiEvents, setAiEvents] = useState(BASE_AI_EVENTS);
  const [ratioReason, setRatioReason] = useState(
    "Elevated INR/USD 7-day volatility (σ = 0.84) prompted a conservative increase"
  );
  const intervalRef = useRef<NodeJS.Timeout>();

  // Live-simulate chart updates every 30s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPegData((prev) => {
        const last = prev[prev.length - 1];
        const newUsdt = Math.max(
          0.996,
          Math.min(1.004, last.USDT + (Math.random() - 0.5) * 0.0015)
        );
        const newUsdc = Math.max(
          0.997,
          Math.min(1.003, last.USDC + (Math.random() - 0.5) * 0.001)
        );
        return [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            USDT: parseFloat(newUsdt.toFixed(4)),
            USDC: parseFloat(newUsdc.toFixed(4)),
          },
        ];
      });

      // Occasionally update AI ratio
      if (Math.random() > 0.7) {
        const newRatio = 150 + Math.floor(Math.random() * 20);
        setAiRatio(newRatio);
        if (newRatio > 158) {
          setRatioReason(
            `High volatility spike detected — ratio tightened to ${newRatio}%`
          );
        } else if (newRatio < 152) {
          setRatioReason(
            `Volatility normalising — ratio relaxed to ${newRatio}%`
          );
        }
      }
    }, 30_000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Demo reset handler
  useEffect(() => {
    const handler = () => {
      setPegData(generatePegData());
      setAiRatio(158);
      setAiEvents(BASE_AI_EVENTS);
      setRatioReason(
        "Elevated INR/USD 7-day volatility (σ = 0.84) prompted a conservative increase"
      );
    };
    window.addEventListener(DEMO_RESET_EVENT, handler);
    return () => window.removeEventListener(DEMO_RESET_EVENT, handler);
  }, []);

  const currentRatio = collateralRatio
    ? Number(collateralRatio) / 100
    : 150;

  return (
    <div className="page-container">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <PageHeader
          title="Reserve & Security Shield"
          subtitle="150% Over-Collateralised Reserve Protection · Autonomous AI Stability Guard"
        />
        {/* Honest disclosure badge */}
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            fontSize: 11,
            fontWeight: 600,
            color: "#f59e0b",
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
          }}
        >
          ⚠️ UI PROTOTYPE — Client-side simulated data
        </div>
      </div>

      <div className="mobile-grid-1col" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Peg stability chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Peg Stability — Last 60 Minutes
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  USDT & USDC price vs. $1.00 target
                </div>
              </div>
              <span className="badge badge-success">● STABLE</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={pegData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradUSDT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#26a17b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#26a17b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUSDC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2775ca" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2775ca" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#4a5568", fontSize: 10 }}
                  tickLine={false}
                  interval={9}
                />
                <YAxis
                  domain={[0.994, 1.006]}
                  tick={{ fill: "#4a5568", fontSize: 10 }}
                  tickLine={false}
                  tickFormatter={(v) => v.toFixed(3)}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0B1F3A",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 8,
                    color: "#f0f4ff",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="USDT"
                  stroke="#26a17b"
                  strokeWidth={2}
                  fill="url(#gradUSDT)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="USDC"
                  stroke="#2775ca"
                  strokeWidth={2}
                  fill="url(#gradUSDC)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
              {[
                { color: "#26a17b", label: "USDT" },
                { color: "#2775ca", label: "USDC" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 2,
                      background: color,
                      borderRadius: 1,
                    }}
                  />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Collateral ratio gauge */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Collateral Ratio — AI Recommendation
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <RadialGauge
                value={aiRatio}
                min={100}
                max={200}
                recommended={aiRatio}
                label="AI-recommended"
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  {ratioReason}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <MetricPill label="Current on-chain" value={`${currentRatio}%`} />
                  <MetricPill label="AI target" value={`${aiRatio}%`} accent />
                  <MetricPill label="Δ from baseline" value={`+${aiRatio - 150}%`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — AI Events */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            AI Risk Events
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AnimatePresence>
              {aiEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: event.color, fontSize: 14 }}>
                      {event.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {event.text}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      paddingLeft: 22,
                    }}
                  >
                    {event.time}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Honest footer */}
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.15)",
              fontSize: 11,
              color: "rgba(245,158,11,0.7)",
              lineHeight: 1.5,
            }}
          >
            All events are client-side mocked for demo purposes.
            Production: real ML risk engine calling Vault.updateCollateralRatio().
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        background: accent ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${accent ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <div
        style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: accent ? "#C9A84C" : "var(--text-primary)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
