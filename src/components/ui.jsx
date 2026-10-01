import { useEffect } from "react";
import { HEWI_COPY } from "../engine.js";

const TONE = {
  green: "#0e9a68",
  amber: "#c47b08",
  red: "#e11d38",
  critical: "#e11d38",
};

export function Title({ children }) {
  useEffect(() => {
    document.title = children ? `${children} · CareProof` : "CareProof — From Promise to Proof";
  }, [children]);
  return null;
}

export function Pill({ band, children }) {
  return (
    <span className={`pill ${band}`}>
      <i className="dot" />
      {children}
    </span>
  );
}

export function ScoreDial({ score, band, size = 156 }) {
  const radius = 58;
  const circ = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circ;
  return (
    <div className="dial" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" width={size} height={size} aria-hidden="true">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(20,36,28,0.08)" strokeWidth="8" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={TONE[band] || TONE.green}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="dial-label">
        <div>
          <strong>{score}</strong>
          <span> / 100</span>
        </div>
      </div>
    </div>
  );
}

export function Gates({ gates }) {
  return (
    <ul className="gates">
      {gates.map((gate) => (
        <li key={gate.id} className={gate.pass ? "pass" : "fail"}>
          <span>{gate.pass ? "Pass" : "Fail"}</span>
          <div>
            <strong>{gate.name}</strong>
            <p>{gate.reason}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Breakdown({ breakdown }) {
  return (
    <div className="bars">
      {breakdown.map((pillar) => {
        const tone = pillar.score >= 90 ? "" : pillar.score >= 75 ? "warn" : "bad";
        return (
          <div className="bar-row" key={pillar.id}>
            <span>{pillar.short}</span>
            <div className="track" aria-hidden="true">
              <i className={tone} style={{ width: `${pillar.score}%` }} />
            </div>
            <b>{pillar.score}</b>
          </div>
        );
      })}
    </div>
  );
}

export function StatusLine({ episode }) {
  return (
    <div className={episode.status.band === "green" || episode.status.band === "amber" ? "callout ok" : "callout"}>
      <span className="kicker">Final care status</span>
      <strong>
        {episode.score}/100 · {episode.status.label}
      </strong>
      <p>{episode.status.detail}</p>
      <p style={{ marginTop: 8 }}>
        Home Early Warning Index: {HEWI_COPY[episode.hewi.level]}. {episode.hewi.steps} deterioration step
        {episode.hewi.steps === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
