import { writeFileSync } from "node:fs";
import { incidentSteps, lifecycle, sources } from "../src/data.js";
import { HEWI_COPY, PILLARS } from "../src/engine.js";
import { fleetSummary, pilot } from "../src/pilot.js";

const fleet = fleetSummary();
const byId = Object.fromEntries(pilot.map((episode) => [episode.patient.id, episode]));

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function pillars(episode) {
  return episode.breakdown.map((item) => `${item.short} ${item.score}`).join(" · ");
}

function gates(episode) {
  const failed = episode.gates.filter((gate) => !gate.pass);
  return failed.length ? failed.map((gate) => gate.name).join("; ") : "All passed";
}

const pilotRows = pilot
  .map(
    (episode) => `<tr>
      <td>${episode.patient.id}</td>
      <td>${esc(episode.patient.name)}<br><span class="fine">${esc(episode.patient.condition)}</span></td>
      <td>${episode.score}</td>
      <td>${HEWI_COPY[episode.hewi.level]}</td>
      <td>${esc(gates(episode))}</td>
      <td>${esc(episode.status.label)}</td>
    </tr>`
  )
  .join("");

const sourceBlocks = sources
  .map(
    (item) => `<article class="source">
      <p class="kicker">${item.id} · ${esc(item.topic)}</p>
      <h3>${esc(item.source)}</h3>
      <p><strong>What the source supports.</strong> ${esc(item.finding)}</p>
      <p><strong>What CareProof proposes from it.</strong> ${esc(item.effect)}</p>
    </article>`
  )
  .join("");

const lifeRows = lifecycle
  .map(([title, text], index) => `<tr><td>${String(index + 1).padStart(2, "0")}</td><td>${esc(title)}</td><td>${esc(text)}</td></tr>`)
  .join("");

const incidentRows = incidentSteps
  .map((step, index) => `<tr><td>${index + 1}</td><td>${esc(step.time)}</td><td><strong>${esc(step.title)}</strong><br>${esc(step.text)}</td></tr>`)
  .join("");

function worked(id) {
  const episode = byId[id];
  const rows = episode.breakdown
    .map(
      (item) => `<tr><td>${esc(item.name)}</td><td>${Math.round(item.weight * 100)}%</td><td>${item.score}</td><td>${item.weighted}</td></tr>`
    )
    .join("");
  const gateRows = episode.gates
    .map((gate) => `<tr><td>${gate.pass ? "Pass" : "Fail"}</td><td>${esc(gate.name)}</td><td>${esc(gate.reason)}</td></tr>`)
    .join("");
  return { episode, rows, gateRows };
}

const p006 = worked("P006");
const p003 = worked("P003");
const p008 = worked("P008");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>CareProof — From Promise to Proof</title>
<style>
  @page { size: A4; margin: 16mm 15mm 18mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #14241c; font-family: "Segoe UI", Calibri, sans-serif; font-size: 10.5pt; line-height: 1.45; }
  h1, h2, h3 { font-family: Georgia, "Times New Roman", serif; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; }
  h1 { font-size: 22pt; margin: 0 0 8px; }
  h2 { font-size: 16pt; margin: 18px 0 8px; }
  h3 { font-size: 12.5pt; margin: 12px 0 4px; }
  p { margin: 0 0 8px; }
  .kicker { font-family: "Segoe UI", sans-serif; font-size: 8.5pt; letter-spacing: 0.14em; text-transform: uppercase; color: #9a6420; font-weight: 700; margin: 0 0 6px; }
  .fine { color: #5a6560; font-size: 9pt; }
  .cover { break-after: page; min-height: 250mm; background: #071612; color: #f7f4ee; padding: 22mm 18mm; margin: -16mm -15mm 0; }
  .cover h1 { font-size: 42pt; color: #f7f4ee; max-width: 12em; }
  .gold { color: #f3d48a; }
  .rule { height: 1px; background: rgba(247,244,238,0.25); margin: 18px 0; }
  .cover-foot { margin-top: 28px; color: rgba(247,244,238,0.75); }
  section { break-inside: auto; }
  .break { break-before: page; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; font-size: 9.5pt; }
  th, td { text-align: left; vertical-align: top; border-bottom: 1px solid #e4ddd0; padding: 6px 7px; }
  th { font-size: 8pt; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6560; }
  .note, .math { border-radius: 8px; padding: 10px 12px; margin: 8px 0 12px; }
  .note { background: #f8edd4; }
  .warn { background: #ffe8ec; }
  .math { background: #071612; color: #f7f4ee; font-family: Consolas, "Courier New", monospace; font-size: 9.5pt; line-height: 1.55; }
  .source { break-inside: avoid; border-top: 1px solid #e4ddd0; padding: 8px 0; }
  ul { margin: 4px 0 10px; padding-left: 18px; }
  li { margin: 2px 0; }
  .two td { width: 50%; }
</style>
</head>
<body>
  <div class="cover">
    <p class="kicker gold">Home-care quality assurance and safety index</p>
    <h1>CareProof</h1>
    <p style="font-size:18pt; max-width: 16em;">From promise to proof.</p>
    <div class="rule"></div>
    <p style="max-width: 34em;">A proposed, auditable standard for measuring whether care at home meets predefined safety and quality requirements. This document is a pilot submission. It is not a claim that the framework has been clinically validated.</p>
    <div class="cover-foot">
      <p>Assessment date used in the simulated pilot: 28 September 2026.</p>
      <p>All patients, caregivers, agencies, and devices in this document are fictional.</p>
      <p>21 sources · 6 pillars · 4 safety gates · 8 simulated episodes</p>
    </div>
  </div>

  <section>
    <p class="kicker">How to read this document</p>
    <h1>Three kinds of statement</h1>
    <p>Every claim below is one of three things. They are not mixed.</p>
    <ul>
      <li><strong>Established evidence.</strong> A statement tied to a named source. The source is listed in the evidence review and again in the references.</li>
      <li><strong>Interpretation.</strong> What this submission takes that source to mean for home care. The interpretation is ours.</li>
      <li><strong>Proposed framework.</strong> A weight, a threshold, a gate, or a score rule created for CareProof. These are implementation rules for a pilot. They are not medical facts, and they are not a validated early-warning score.</li>
    </ul>
    <div class="note">CareProof does not claim that a home episode which meets this standard is equivalent to hospital care. It claims something narrower: the episode can be measured, gated, and audited against a predefined standard.</div>
  </section>

  <section>
    <p class="kicker">01 · Executive summary</p>
    <h1>A high score is not hospital-grade.</h1>
    <p>Hospital-grade at home is often a promise. CareProof turns the promise into a 0–100 quality score, a set of safety gates that can veto that score, and a passport that keeps the evidence.</p>
    <p>The proposed definition is strict. An episode meets the standard only when the score is at least 90 and every safety gate passes. A score of 75–89 with every gate passed is conditional compliance. A score below 75 with every gate passed requires improvement. Any failed gate means the episode is not compliant, whatever the score.</p>
    <p>In the simulated fleet of eight episodes the mean score is ${fleet.meanScore}. One episode meets the proposed standard. Five are not compliant. One of those five, Arun Patel, scores ${byId.P006.score}. His oxygen concentrator maintenance was due on 12 March 2026. The safety gate fails. The status is not compliant.</p>
    <p>The research described here does not test whether CareProof improves outcomes. It specifies how the measure would be validated: content review by six to eight experts, a 30-episode feasibility and dual-assessment pilot, and only then a comparative study. A planning calculation for that later study, under stated assumptions, gives 111 episodes per group after 15% attrition. Those proportions are assumptions. They are not CareProof results.</p>
  </section>

  <section class="break">
    <p class="kicker">02 · Problem</p>
    <h1>The proof stays in the hospital.</h1>
    <p>A hospital can show monitors, trained staff, equipment checks, an escalation path, and an audit trail. When the same person goes home, “hospital-grade” is often a phrase on a brochure. The core question of this submission is whether that phrase can be measured.</p>
    <p>Home care is not a smaller hospital. Readings are irregular. The team may be one nurse and one attendant. A device lives in a bedroom, not a clinical-engineering workshop. Informal caregivers share the work. A standard that copies a ward checklist will fail the first quiet afternoon.</p>
    <p>The submission therefore answers five practical questions.</p>
    <ul>
      <li><strong>Standards.</strong> What must “hospital-grade” home care include, as measurable pillars rather than slogans?</li>
      <li><strong>Equipment.</strong> When is a device eligible for use, and when must it be retired?</li>
      <li><strong>Caregivers.</strong> Which skills are observable, and what count is a pass?</li>
      <li><strong>Monitoring.</strong> How should a hospital early-warning chart be used when the data are sparse, without pretending the chart has been validated at home?</li>
      <li><strong>Proof.</strong> What study could show whether the standard works, without pretending this pilot is that study?</li>
    </ul>
  </section>

  <section>
    <p class="kicker">03 · Definition</p>
    <h1>What “hospital-grade at home” means here</h1>
    <p><strong>Proposed definition.</strong> A home-care episode is hospital-grade, under this standard, only when two conditions are both true: the CareProof quality score is 90 or above, and every safety gate passes.</p>
    <p>The score summarises six pillars. The gates cover deterioration response, equipment eligibility, critical caregiver skills, and infection or medication process. The gates are not extra points. They are vetoes.</p>
    <p>This definition is configurable. The pillars, the gates, and the passport stay the same. Local contact paths, device law, and which early-warning chart is used as the reference scaffold can change. India is the worked example, using NABH care-home standards as context rather than as a copied checklist. A care home is not a home visit. No regulator has endorsed this prototype.</p>
  </section>

  <section class="break">
    <p class="kicker">04 · Evidence review</p>
    <h1>Twenty-one sources, read for a design decision</h1>
    <p>Sources were chosen because each one changes a design decision: quality dimensions, equipment lifecycle, continuity, deterioration and response, infection and medication, the Indian residential-care context, or the statistics of validation. Sources were not collected to inflate a reference list.</p>
    <p>The paragraphs below separate what the document is used for from what CareProof adds. They are not quotations presented as our own findings. Thresholds inside CareProof are proposed rules unless the row says they come from the cited chart.</p>
    ${sourceBlocks}
  </section>

  <section class="break">
    <p class="kicker">05 · Framework</p>
    <h1>Measure, then refuse a pretty number</h1>
    <p>The operating cycle is Measure, Score, Detect, Escalate, Audit, Improve. That cycle follows the idea, in the WHO quality-policy handbook, that a quality system needs measurement and an improvement loop. The original contribution is the split between the score and the gate.</p>
    <h2>Six proposed pillars</h2>
    <p>Weights sum to 100%. They are a design proposal for content validation. They were not fitted to outcomes.</p>
    <table>
      <tr><th>Pillar</th><th>Weight</th><th>Why this weight is proposed</th></tr>
      <tr><td>Clinical safety and monitoring</td><td>25%</td><td>WHO treats safety as part of quality. Missed deterioration is the acute harm this pillar is built to see. The response gate, not the weight, is the veto.</td></tr>
      <tr><td>Caregiver competence</td><td>20%</td><td>At home the team is small. Recognition and escalation are also a gate, so a zero cannot hide inside the 20%.</td></tr>
      <tr><td>Equipment safety</td><td>15%</td><td>WHO’s maintenance series treats devices as a lifecycle. The weight is modest because a failed device is already a gate.</td></tr>
      <tr><td>Infection and medication safety</td><td>15%</td><td>WHO’s IPC guidance and the Medication Without Harm challenge both treat process as safety. A critical breach is a gate.</td></tr>
      <tr><td>Documentation and continuity</td><td>10%</td><td>The record is how a distributed team coordinates. A missed escalation is already a response-gate failure, so the weight is lower.</td></tr>
      <tr><td>Patient and family experience</td><td>15%</td><td>People-centred care is a quality dimension. It cannot talk a failed oxygen check into a pass.</td></tr>
    </table>
    <h3>Clinical safety and monitoring — indicators</h3>
    <ul>
      <li>Repeated home observations, not a single set.</li>
      <li>A patient-specific baseline.</li>
      <li>NEWS2 bands used only as a labelled reference scaffold (RCP 2017).</li>
      <li>Deterioration steps between consecutive readings. This rule is proposed.</li>
    </ul>
    <h3>Caregiver competence — indicators</h3>
    <ul>
      <li>Seven observable domains, each scored 0 to 3.</li>
      <li>Pass = at least 14 out of 21, no domain at zero, and both deterioration recognition and escalation at least Competent (2).</li>
      <li>The assessment has a date and is then applied to the episode.</li>
    </ul>
    <h3>Equipment safety — indicators</h3>
    <ul>
      <li>Inspection in date. Weight inside the device score: 22%.</li>
      <li>The named caregiver is certified for this device. 18%.</li>
      <li>Maintenance in date. 25%.</li>
      <li>Calibration or verification where the device measures. 15%.</li>
      <li>Not retired. 10%. No open critical device incident. 10%.</li>
      <li><strong>Proposed cap.</strong> A failed inspection limits the equipment pillar to 45, because paperwork cannot make an uninspected device look safe.</li>
    </ul>
    <h3>Infection and medication — indicators</h3>
    <p>Hand hygiene, PPE for the task, medication reconciliation, the five-rights process, and storage. Each is scored 0–100 and averaged. A critical breach caps the pillar at 40 and fails the gate.</p>
    <h3>Documentation — indicators</h3>
    <p>Completeness of the required record, a current care plan, and an escalation note when a response was required.</p>
    <h3>Experience — indicators</h3>
    <p>Dignity, communication, pain relief, and caregiver burden reported by the family. Averaged to 0–100.</p>
  </section>

  <section class="break">
    <p class="kicker">06 · Scoring and the safety gate</p>
    <h1>Layer 1 is a number. Layer 2 can veto it.</h1>
    <p>Each pillar is scored 0–100. The episode score is the weighted sum, rounded to an integer. The weights are the six percentages above.</p>
    <table>
      <tr><th>Score</th><th>Gates</th><th>Final status</th></tr>
      <tr><td>90–100</td><td>All pass</td><td>Meets the proposed standard</td></tr>
      <tr><td>75–89</td><td>All pass</td><td>Conditional compliance</td></tr>
      <tr><td>Below 75</td><td>All pass</td><td>Improvement required</td></tr>
      <tr><td>Any</td><td>Any fail</td><td>Not compliant</td></tr>
    </table>
    <h2>The four gates</h2>
    <ul>
      <li><strong>Deterioration response.</strong> If the Home Early Warning Index is “repeated deterioration” or an “emergency pattern”, escalation must be logged and acknowledged inside the timer. If no such pattern occurred, the gate passes. A deterioration that was recognised and escalated lowers the clinical pillar. It does not, by itself, fail the gate. Missing the response does. This split follows the point of NICE CG50: a track-and-trigger score without a response is incomplete. Applying that point to home care is our interpretation.</li>
      <li><strong>Equipment eligible for use.</strong> Every assigned device must pass inspection, caregiver certification for that device, maintenance, calibration where required, in-service status, and incident status.</li>
      <li><strong>Caregiver critical skills.</strong> Deterioration recognition and escalation must both be at least Competent, and no domain may be zero.</li>
      <li><strong>Infection and medication process.</strong> No critical breach.</li>
    </ul>
  </section>

  <section>
    <p class="kicker">07 · Clinical monitoring</p>
    <h1>Home Early Warning Index</h1>
    <p><strong>Reference scaffold, not a home-validated score.</strong> Heart rate, respiratory rate, systolic blood pressure, temperature, consciousness, and oxygen saturation are scored with the NEWS2 chart (Royal College of Physicians, 2017). Scale 2 is used only when a target of 88–92% is already prescribed, which is the logic of that chart and of the BTS oxygen guideline (2017). This submission does not claim those bands have been validated on irregular home data.</p>
    <p><strong>Proposed home rules, labelled as implementation rules.</strong></p>
    <ul>
      <li>A deterioration step is a worsening between two consecutive readings: oxygen saturation down by 2 points or more, heart rate up by 10 or more, respiratory rate up by 3 or more, temperature up by 0.4°C or more, systolic pressure down by 12 or more, or consciousness leaving Alert.</li>
      <li>Stable: reference total 0 and no step.</li>
      <li>Abnormal value: reference total 1–4, or a single step, without an emergency pattern.</li>
      <li>Repeated deterioration: three or more steps, or a reference total of 5 or 6.</li>
      <li>Emergency pattern: reference total 7 or more, consciousness not Alert, or a single parameter at the top of the reference chart plus at least two steps.</li>
    </ul>
    <p>The clinical pillar starts at 100 and subtracts for the latest reference total and for deterioration steps, then applies a cap: 84 if abnormal, 64 if repeated deterioration, and 56 if an emergency pattern. The cap keeps the other pillars visible. The gate, not a zero, carries the non-negotiable decision about response.</p>
    <div class="note">The question is not only “is 88% dangerous?”. The question is “is the person deteriorating?”. Fatima Khan’s saturation moves 96, 94, 91, 88 across one day. That pattern is an emergency. Her nurse escalates, so the response gate passes. The concentrator inspection is overdue, so the episode still fails.</div>
  </section>

  <section class="break">
    <p class="kicker">08 · Equipment</p>
    <h1>A device is a lifecycle, not a sticker</h1>
    <p>WHO’s medical equipment maintenance overview (2011) covers inspection, preventive and corrective maintenance, records, user error, and performance monitoring. The inventory and CMMS papers in the same technical series make the register and the next-due date the base record. The twelve stages below are a proposed operational chain aligned to that logic. They are not a diagram copied from a WHO page.</p>
    <table>
      <tr><th></th><th>Stage</th><th>What it means in a home</th></tr>
      ${lifeRows}
    </table>
    <p>Eligibility is a chain, not a pile of ticks. Inspection valid, then this caregiver certified for this device, then maintenance current, then calibration where the device measures, then still in service, then no open critical incident. Any break makes the device ineligible. A competent nurse cannot rescue an overdue concentrator.</p>
    <p>Each device record holds an identifier, type, manufacturer, model, serial number, date received, last and next maintenance, last and next inspection, calibration status, assigned episode, trained caregivers, incident history, and retirement status. In a later build these fields are the PostgreSQL tables in <span class="fine">server/schema.sql</span>. This pilot calculates eligibility from the dates.</p>
  </section>

  <section>
    <p class="kicker">09 · Caregivers</p>
    <h1>Trained is not a tick box</h1>
    <p>Competence is what the person can demonstrate. Each domain is scored 0 (not demonstrated), 1 (partially demonstrated), 2 (competent), or 3 (competent in a simulated scenario).</p>
    <table>
      <tr><th>Code</th><th>Domain</th><th>What is observed</th></tr>
      <tr><td>C1</td><td>Vital signs</td><td>Measures and records the required observations correctly.</td></tr>
      <tr><td>C2</td><td>Infection prevention</td><td>Demonstrates the hygiene and PPE steps used in that home.</td></tr>
      <tr><td>C3</td><td>Equipment</td><td>Operates the assigned device without inventing steps.</td></tr>
      <tr><td>C4</td><td>Medication safety</td><td>Follows the prescribed medication-management process.</td></tr>
      <tr><td>C5</td><td>Deterioration recognition</td><td>Names the warning pattern this patient was given.</td></tr>
      <tr><td>C6</td><td>Escalation</td><td>Knows who to contact and what information to give.</td></tr>
      <tr><td>C7</td><td>Documentation</td><td>Completes the required record accurately.</td></tr>
    </table>
    <p><strong>Proposed pass rule.</strong> At least 14 out of 21, no domain at 0, and both C5 and C6 at least 2. Joseph D’Souza has not demonstrated escalation (C6 = 0). Imran Qureshi’s escalation is only partial (C6 = 1). Both fail the caregiver gate. Anita Sharma scores 21 out of 21.</p>
  </section>

  <section class="break">
    <p class="kicker">10 · Passport</p>
    <h1>Show the evidence trail</h1>
    <p>Every episode keeps a CareProof Passport: care plan, caregiver competency, equipment readiness, clinical monitoring, incidents, escalations, outcome, and the audit trail. A later repair does not erase the assessment that failed. The record is append-only.</p>
    <p>The same core can sit under local rules. India uses NABH care-home standards as context for residential safety, infection control, staffing, and resident experience, and uses a local escalation contact. The United Kingdom can keep NEWS2 as the reference scaffold. The United States can slot local device and documentation rules into the same gates. These are configuration slots. They are not approved crosswalks.</p>
  </section>

  <section>
    <p class="kicker">11 · Research protocol</p>
    <h1>This pilot asks if the measure can be used</h1>
    <p><strong>Question for a later study.</strong> Does implementation of the CareProof Standard improve measurable home-care safety and quality indicators compared with baseline care processes?</p>
    <p>That question is not answered here. The protocol below is a content-validity, reliability, and feasibility study. It is not powered for effectiveness, and this submission reports no effectiveness result.</p>
    <table>
      <tr><th>Phase</th><th>What happens</th></tr>
      <tr><td>1. Development</td><td>Map the sources. Separate evidence, interpretation, and proposal. Freeze the indicator list before anyone scores a case.</td></tr>
      <tr><td>2. Content validation</td><td>A panel of six to eight people: physician, nurse, biomedical engineer, public-health researcher, home-care professional, and a caregiver or family representative. Each item is rated for relevance.</td></tr>
      <tr><td>3. Pilot cases</td><td>Thirty simulated or fully anonymised episodes, built to stress each gate. The eight cases in this document are a demonstration, not that sample.</td></tr>
      <tr><td>4. Reliability</td><td>Two assessors score each episode independently. Report an intraclass correlation with a confidence interval. Do not claim reliability before that is done.</td></tr>
      <tr><td>5. Feasibility</td><td>Assessment time, missing data, completion rate, caregiver burden, and whether a supervisor can act on a failed gate the same day.</td></tr>
      <tr><td>6. Refinement</td><td>Change a weight, a band, or a gate only when the panel or the pilot gives a reason. Publish the change.</td></tr>
    </table>
    <h2>Ethics and consent</h2>
    <ul>
      <li>This document contains no real patient, caregiver, or device.</li>
      <li>A study on real episodes needs institutional ethics approval before recruitment.</li>
      <li>Consent must be written, specific, and separate from the decision to receive care. Refusal does not change the care offered.</li>
      <li>If a person cannot consent, the legally authorised representative decides, and the person’s wishes are still sought.</li>
      <li>Anyone can withdraw. Data already required for a safety review are handled under the approval.</li>
      <li>A live pilot needs a clinical escalation path. The study cannot watch an emergency pattern and only write it down.</li>
      <li>Competency assessment is scheduled and consented. It is not covert surveillance of a home visit.</li>
    </ul>
    <h2>Analysis, once data exist</h2>
    <ul>
      <li>Content validity: item-level and scale-level indices, with the number of experts stated (Lynn 1986; Polit and Beck 2006). With six raters, an item is proposed for retention when at least five rate it relevant.</li>
      <li>Reliability: a two-way intraclass correlation and a confidence interval, plus percent agreement on each gate. Walter, Eliasziw and Donner (1998) is the method for sizing a confirmatory reliability study once a realistic correlation is known. This pilot does not report an intraclass correlation, because no dual rating has been done.</li>
      <li>Feasibility: median assessment time, proportion of complete episodes, missing indicators, and a short usability rating.</li>
      <li>No p-value for “CareProof works” will be reported from the feasibility pilot.</li>
    </ul>
  </section>

  <section class="break">
    <p class="kicker">12 · Sample size</p>
    <h1>Two numbers. They are not interchangeable.</h1>
    <h2>This pilot</h2>
    <p>Content panel of 6–8 experts. Feasibility target of 30 dual-assessed episodes, so that missingness, time, and a preliminary intraclass correlation can be estimated. Thirty is not claimed as the optimum from Walter, Eliasziw and Donner (1998). Julious (2005) discusses 12 per group as a rule of thumb for estimating a variance. It is cited only for the assessment-time estimate. It is not an effectiveness sample size. Billingham, Whitehead and Julious (2013) show that published pilots often give a weak reason for their size. The split below is the reason used here.</p>
    <h2>Later comparative study — planning only</h2>
    <p>Primary endpoint: the proportion of episodes that meet the proposed standard (score at least 90 and every gate passed). Planning assumptions, not observed baselines: 40% without CareProof and 60% with it, a 20-point absolute difference treated as the smallest change worth a service decision. Two-sided alpha 0.05. Power 80%. Equal groups. Normal approximation to the difference of two proportions.</p>
    <div class="math">
      n = (Zα + Zβ)² × [p1(1−p1) + p2(1−p2)] / (p1 − p2)²<br>
      Zα = 1.96, Zβ = 0.8416, p1 = 0.40, p2 = 0.60<br>
      n = (2.8016)² × (0.24 + 0.24) / 0.04<br>
      n = 7.849 × 0.48 / 0.04 = 94.2 per group<br>
      Allow 15% attrition: 94.2 / 0.85 = 110.8, rounded up to 111 per group, 222 in total.
    </div>
    <p>If the content review or the feasibility pilot shows that the measure is the wrong measure, this calculation is discarded. A precise estimate of a bad measure is not a success.</p>
  </section>

  <section class="break">
    <p class="kicker">13 · Simulated pilot</p>
    <h1>Eight fictional episodes, scored by the engine</h1>
    <p>The table is the output of the measurement engine on 28 September 2026. It is not a clinical dataset. The mean score is ${fleet.meanScore}. Episodes meeting the standard: ${fleet.green}. Conditional compliance: ${fleet.amber}. Improvement required: ${fleet.red}. Not compliant: ${fleet.critical}.</p>
    <table>
      <tr><th>ID</th><th>Episode</th><th>Score</th><th>HEWI</th><th>Failed gates</th><th>Status</th></tr>
      ${pilotRows}
    </table>
    <p class="fine">Pillar scores, for audit: ${pilot.map((episode) => `${episode.patient.id} (${pillars(episode)})`).join("; ")}.</p>
    <div class="warn"><strong>The mean is the wrong headline.</strong> A mean of ${fleet.meanScore} hides five episodes that must not be called compliant, including one that scores ${byId.P006.score}.</div>
  </section>

  <section>
    <p class="kicker">14 · Worked episode · the 94 that fails</p>
    <h1>${esc(p006.episode.patient.name)}, ${p006.episode.patient.id}</h1>
    <p>${esc(p006.episode.patient.condition)}. Caregiver: ${esc(p006.episode.caregiver.name)}, competency ${p006.episode.person.sum}/${p006.episode.person.max}. Device: OXY-001, next maintenance 12 March 2026. Readings stay at 91–92% on prescribed oxygen, scored on the Scale 2 scaffold, and the Home Early Warning Index is stable.</p>
    <table>
      <tr><th>Pillar</th><th>Weight</th><th>Score</th><th>Weighted</th></tr>
      ${p006.rows}
      <tr><td colspan="3"><strong>Episode score</strong></td><td><strong>${p006.episode.score}</strong></td></tr>
    </table>
    <table>
      <tr><th></th><th>Gate</th><th>Reason</th></tr>
      ${p006.gateRows}
    </table>
    <p><strong>Final status: ${esc(p006.episode.status.label)}.</strong> ${esc(p006.episode.status.detail)} If maintenance were current on the assessment date, the same engine would rescore the episode as meeting the standard. The original failed record would remain on the passport.</p>
  </section>

  <section>
    <p class="kicker">15 · Worked episode · deterioration</p>
    <h1>${esc(p003.episode.patient.name)}, ${p003.episode.patient.id}</h1>
    <p>${esc(p003.episode.patient.story)} Caregiver ${esc(p003.episode.caregiver.name)} passes. Escalation was logged and acknowledged, so the response gate passes. Device OXY-014 has an overdue inspection, so the equipment gate fails. Clinical pillar ${p003.episode.scores.clinical}. Episode score ${p003.episode.score}. Status: ${esc(p003.episode.status.label)}.</p>
    <table>
      <tr><th>Time</th><th>SpO₂</th><th>HR</th><th>RR</th><th>SBP</th><th>Temp</th><th>Mind</th><th>Reference total</th></tr>
      ${p003.episode.hewi.scored.map((reading) => `<tr><td>${reading.t}</td><td>${reading.spo2}</td><td>${reading.hr}</td><td>${reading.rr}</td><td>${reading.sbp}</td><td>${reading.temp}</td><td>${reading.consciousness}</td><td>${reading.total}</td></tr>`).join("")}
    </table>
    <p class="fine">“Reference total” is the NEWS2-style sum for that reading. It is a scaffold, not a home-validated score. Deterioration steps: ${p003.episode.hewi.notes.map((note) => `${note.from} to ${note.to} (${note.hits.join("; ")})`).join(". ")}.</p>
  </section>

  <section class="break">
    <p class="kicker">16 · Surprise incident</p>
    <h1>He deteriorated at 02:10. Nobody answered.</h1>
    <p>${esc(p008.episode.patient.name)} is fictional. The pathway is the point. The night readings move from a stable evening visit to an emergency pattern. The attendant does not acknowledge the alert. Escalation on his competency record is only partial. The engine result is ${p008.episode.score}/100, status ${esc(p008.episode.status.label)}. Failed gates: ${esc(gates(p008.episode))}.</p>
    <table>
      <tr><th></th><th>Time</th><th>Step</th></tr>
      ${incidentRows}
    </table>
    <p>A corrective action can change the next episode. It does not rewrite this one. That is the audit.</p>
  </section>

  <section>
    <p class="kicker">17 · Limits and what happens next</p>
    <h1>What this submission does not show</h1>
    <ul>
      <li>The weights are proposed. They are not derived from outcome regression.</li>
      <li>NEWS2 bands are a hospital chart. Using them at home is a scaffold, not a validation.</li>
      <li>Eight simulated episodes cannot estimate sensitivity, specificity, or effect.</li>
      <li>No inter-rater result exists, so none is reported.</li>
      <li>Local regulatory examples are configuration slots, not endorsements.</li>
      <li>CareProof is not a medical device clearance and must not be used to withhold care.</li>
    </ul>
    <h2>Roadmap</h2>
    <p>Freeze the indicator list. Run the expert panel. Only then score the 30-episode feasibility set with two assessors. Publish missingness, time, agreement on gates, and a confidence interval for the intraclass correlation. Change the standard in public if the panel or the pilot requires it. A comparative study is justified only after that. The arithmetic for that study is in section 12, and it stays labelled as a plan.</p>
    <h2>Conclusion</h2>
    <p>A hospital can prove its care. A home usually cannot. CareProof is a proposed way to measure the proof: six pillars, one score, four gates that can veto the score, and a passport that keeps the trail. The simulated pilot shows why the veto matters. A score of ${byId.P006.score} can still be not compliant. The framework is ready to be challenged. It is not ready to be called validated.</p>
  </section>

  <section class="break">
    <p class="kicker">18 · References</p>
    <h1>Sources cited</h1>
    <ol>
      ${sources.map((item) => `<li>${esc(item.source)}</li>`).join("")}
    </ol>
    <p class="fine">Participants remain responsible for checking each citation against the original document before upload. This list matches the sources used in the pilot. It does not add papers that were not used.</p>
  </section>
</body>
</html>`;

writeFileSync(new URL("./CareProof-Submission.html", import.meta.url), html);
console.log("wrote html", "episodes", pilot.length, "sources", sources.length);
