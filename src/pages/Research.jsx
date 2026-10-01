import { Title } from "../components/ui.jsx";

const phases = [
  ["01", "Development", "Map the sources. Separate what a document establishes from what CareProof proposes. Freeze the indicator list before anyone scores a case."],
  ["02", "Content validation", "A panel of six to eight people: physician, nurse, biomedical engineer, public-health researcher, home-care professional, and a caregiver or family representative. Each item is rated for relevance."],
  ["03", "Pilot cases", "Thirty simulated or fully anonymised episodes, built to stress each gate. The eight cases in this prototype are a demonstration, not that sample."],
  ["04", "Reliability", "Two assessors score each pilot episode independently. Report an intraclass correlation with a confidence interval. Do not claim reliability before that is done."],
  ["05", "Feasibility", "Assessment time, missing data, completion rate, caregiver burden, and whether a supervisor can act on a failed gate the same day."],
  ["06", "Refinement", "Change weights, bands, or gates only when the panel or the pilot gives a reason. Publish the change. Do not silently edit the standard."],
];

export default function Research() {
  return (
    <div className="page">
      <Title>Research protocol</Title>
      <header className="page-head">
        <div>
          <p className="kicker">Protocol, not a result</p>
          <h1>This pilot asks if the measure can be used. It does not ask if it already works.</h1>
        </div>
      </header>

      <article className="card" style={{ marginBottom: 14 }}>
        <h3>Research question</h3>
        <p>Does implementation of the CareProof Standard improve measurable home-care safety and quality indicators compared with baseline care processes?</p>
        <p className="fine" style={{ marginTop: 8 }}>That question belongs to a later comparative study. The study described here is a feasibility, content-validity, and measurement study. It is not powered to answer the effectiveness question, and this submission reports no effectiveness result.</p>
      </article>

      <div className="stack">
        {phases.map(([n, title, text]) => (
          <article className="phase" key={n}>
            <div className="n">{n}</div>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>

      <h2 style={{ margin: "28px 0 10px" }}>Sample size, shown as arithmetic</h2>
      <p className="lede">Two different numbers. They are not interchangeable.</p>
      <div className="two" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>This pilot</h3>
          <p>Content panel of 6–8 experts. With six raters, an item stays when at least five rate it relevant, which is an item-level content validity index of about 0.83. That rule follows the reporting logic in Polit and Beck (2006), after Lynn (1986).</p>
          <p style={{ marginTop: 8 }}>Feasibility sample: 30 dual-assessed episodes. The number is a target so that missingness, time, and a preliminary intraclass correlation can be estimated. It is not the optimum from Walter, Eliasziw and Donner (1998). A confirmatory reliability study should be sized with that method once a realistic intraclass correlation is known.</p>
          <p style={{ marginTop: 8 }}>Julious (2005) discusses 12 per group as a rule of thumb for estimating variance. It is cited here only for the assessment-time estimate. It is not an effectiveness sample size.</p>
        </article>
        <article className="math">
          <div>Later comparative study — planning only</div>
          <div>Endpoint: proportion meeting the standard</div>
          <div>Assume p1 = 0.40, p2 = 0.60</div>
          <div>Two-sided alpha 0.05, power 80%</div>
          <div>Zα = 1.96, Zβ = 0.8416</div>
          <div>n = (Zα + Zβ)² × [p1(1-p1)+p2(1-p2)] / (p1-p2)²</div>
          <div>n = (2.8016)² × (0.24+0.24) / 0.04</div>
          <div>n = 7.849 × 0.48 / 0.04</div>
          <div>n = 94.2 per group</div>
          <div>15% attrition → 111 per group, 222 total</div>
          <div>These p values are planning assumptions, not observed CareProof results.</div>
        </article>
      </div>

      <div className="two" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>Ethics and consent</h3>
          <ul>
            <li>This prototype contains no real patient, caregiver, or device.</li>
            <li>A study on real episodes needs institutional ethics approval before recruitment.</li>
            <li>Consent must be written, specific, and separate from the decision to receive care. Refusal does not change the care offered.</li>
            <li>If a person cannot consent, the legally authorised representative decides, and the person’s wishes are still sought.</li>
            <li>Anyone can withdraw. Data already required for safety review is handled under the approval, not quietly kept for the score.</li>
            <li>A live pilot needs a clinical escalation path. The study cannot watch an emergency pattern and only write it down.</li>
            <li>Competency assessment is scheduled and consented. It is not covert surveillance of a worker’s home visit.</li>
          </ul>
        </article>
        <article className="card">
          <h3>Analysis, when data exist</h3>
          <ul>
            <li>Content validity: item and scale indices, with the number of experts stated.</li>
            <li>Reliability: two-way intraclass correlation and a confidence interval. Percent agreement on each gate.</li>
            <li>Feasibility: median assessment time, proportion of complete episodes, missing indicators, and a short usability rating.</li>
            <li>No p-value for “CareProof works” will be reported from the pilot.</li>
          </ul>
          <h3 style={{ marginTop: 16 }}>Limits</h3>
          <p>Weights are proposed. NEWS2 bands are a hospital chart. Eight simulated cases cannot estimate sensitivity. No inter-rater result exists yet, so none is shown.</p>
        </article>
      </div>
    </div>
  );
}
