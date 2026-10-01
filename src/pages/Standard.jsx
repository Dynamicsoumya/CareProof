import { PILLARS } from "../engine.js";
import { Title } from "../components/ui.jsx";

const colors = ["#0b3d2e", "#0e9a68", "#3dbe8a", "#c9892e", "#e3b15a", "#5d6b66"];

const reasons = {
  clinical: "WHO treats safety as part of quality, and missed deterioration is the acute harm this pillar is built to see. Largest proposed weight. Still not a veto: the response gate is the veto.",
  caregiver: "At home the team is small. Competence replaces the hospital bench. Recognition and escalation are also a gate, so a zero cannot hide inside the 20%.",
  equipment: "WHO’s maintenance series treats devices as a managed lifecycle. The weight is 15% because a failed device is already a gate. The score should not be the only control.",
  infection: "WHO’s IPC core components and the Medication Without Harm challenge both treat process as safety. A critical breach is a gate.",
  documentation: "Continuity depends on a record that travels. Lower weight, because a missed escalation is already a response-gate failure.",
  experience: "People-centred care is a quality dimension, not a soft extra. It cannot talk a failed oxygen check into a pass.",
};

const indicators = {
  clinical: ["Repeated home observations, not a one-off set", "Patient-specific baseline", "NEWS2 bands used only as a labelled reference scaffold", "Deterioration steps between consecutive readings"],
  caregiver: ["Seven observable domains, scored 0–3", "Pass = at least 14/21, no zero, and C5 and C6 at least Competent", "Assessed on a date, then applied to the episode"],
  equipment: ["Inspection in date", "Named caregiver certified on this device", "Maintenance in date", "Calibration where the device measures", "Not retired, no open critical incident"],
  infection: ["Hand hygiene", "PPE for the task", "Medication reconciliation", "Five-rights process", "Storage"],
  documentation: ["Completeness of the required record", "Current care plan", "Escalation logged when a response was required"],
  experience: ["Dignity", "Communication", "Pain relief", "Caregiver burden, reported by the family"],
};

export default function Standard() {
  return (
    <div className="page">
      <Title>Standard</Title>
      <header className="page-head">
        <div>
          <p className="kicker">Proposed framework</p>
          <h1>Six pillars. One veto.</h1>
          <p className="lede">The weights below are a design proposal for content validation. They are not weights fitted to outcomes. Phase 2 of the protocol exists to challenge them.</p>
        </div>
      </header>

      <div className="weight" aria-label="Proposed pillar weights">
        {PILLARS.map((pillar, index) => (
          <span key={pillar.id} style={{ width: `${pillar.weight * 100}%`, background: colors[index] }}>
            {Math.round(pillar.weight * 100)}
          </span>
        ))}
      </div>
      <p className="fine" style={{ margin: "8px 0 18px" }}>Clinical 25 · Caregiver 20 · Equipment 15 · Infection and medication 15 · Documentation 10 · Experience 15.</p>

      <div className="stack">
        {PILLARS.map((pillar) => (
          <article className="card" key={pillar.id}>
            <div className="split">
              <h3>{pillar.name}</h3>
              <strong>{Math.round(pillar.weight * 100)}%</strong>
            </div>
            <p>{reasons[pillar.id]}</p>
            <ul>
              {indicators[pillar.id].map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="two" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>Layer 1 — quality score</h3>
          <p>Each pillar is scored 0–100. The episode score is the weighted sum, rounded.</p>
          <p style={{ marginTop: 8 }}>90–100, and every gate passed → meets the proposed standard.</p>
          <p>75–89, and every gate passed → conditional compliance.</p>
          <p>Below 75, gates passed → improvement required.</p>
        </article>
        <article className="card">
          <h3>Layer 2 — safety gates</h3>
          <p>Any failed gate sets the final status to not compliant. The number on the dial does not get a vote.</p>
          <ul>
            <li>Deterioration response, when HEWI is red or an emergency pattern.</li>
            <li>Every assigned device eligible for use.</li>
            <li>Recognition and escalation at least Competent.</li>
            <li>No critical infection or medication breach.</li>
          </ul>
          <p className="fine">A deterioration that was recognised and escalated lowers the clinical pillar. It does not, by itself, fail the gate. Missing the response does.</p>
        </article>
      </div>

      <article className="card" style={{ marginTop: 14 }}>
        <h3>Home Early Warning Index — proposed rules</h3>
        <p>Reference bands for heart rate, respiratory rate, blood pressure, temperature, consciousness, and oxygen saturation are the NEWS2 chart (Royal College of Physicians, 2017). Scale 2 is used only when a target of 88–92% is already prescribed, following the logic of that chart and the BTS oxygen guideline. This pilot does not claim those bands have been validated on irregular home data.</p>
        <p style={{ marginTop: 8 }}>CareProof adds four proposed rules, labelled as implementation rules:</p>
        <ul>
          <li>A deterioration step is a worsening between two consecutive readings: SpO₂ down by 2 or more, heart rate up by 10 or more, respiratory rate up by 3 or more, temperature up by 0.4°C or more, systolic pressure down by 12 or more, or consciousness leaving Alert.</li>
          <li>Stable: reference total 0 and no step.</li>
          <li>Abnormal: reference total 1–4, or a single step, without an emergency pattern.</li>
          <li>Repeated deterioration: three or more steps, or a reference total of 5–6.</li>
          <li>Emergency pattern: reference total 7 or more, consciousness not Alert, or a single parameter at the top of the reference chart plus at least two steps.</li>
        </ul>
      </article>

      <div className="three" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>India</h3>
          <p>Local slot: NABH Care Home standards (2023) for residential safety, infection control, staffing, and resident experience. Home visits are a different setting. The slot is configuration, not a claim of accreditation equivalence.</p>
        </article>
        <article className="card">
          <h3>Other countries</h3>
          <p>The pillars, gates, and passport stay the same. Contact paths, device law, and which early-warning chart is the reference scaffold are local settings. No regulator has endorsed this prototype.</p>
        </article>
        <article className="card">
          <h3>What “hospital-grade” means here</h3>
          <p>A home episode meets the proposed standard only when the score is at least 90 and every safety gate passes. It is a definition to be validated. It is not a statement that today’s home care already meets hospital care.</p>
        </article>
      </div>
    </div>
  );
}
