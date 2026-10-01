import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Title } from "../components/ui.jsx";
import { fleetSummary, getEpisode } from "../pilot.js";

const loop = [
  ["Measure", "Observations, devices, skills, records"],
  ["Score", "Six pillars, one 0–100 total"],
  ["Detect", "Trend, not a single number"],
  ["Escalate", "A timer, then a supervisor"],
  ["Audit", "A passport for the episode"],
  ["Improve", "The failure stays on the record"],
];

const trend = [
  ["10:00", "96%"],
  ["14:00", "94%"],
  ["18:00", "91%"],
  ["22:00", "88%"],
];

const places = [
  ["India", "NABH care-home context, local escalation contacts"],
  ["United Kingdom", "NEWS2 stays the reference chart"],
  ["United States", "Local device and documentation rules"],
];

export default function Landing() {
  const trap = getEpisode("P006");
  const fleet = fleetSummary();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((current) => (current + 1) % trend.length), 1300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing">
      <Title />
      <header className="top">
        <Link to="/" className="brand"><span className="mark">C</span>CareProof</Link>
        <span className="top-tag">From Promise to Proof</span>
        <nav>
          <Link className="quiet" to="/present">Walkthrough</Link>
          <Link className="quiet" to="/evidence">Evidence</Link>
          <Link className="btn solid" to="/dashboard">Open the pilot</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="kicker light">One standard. Any country.<br />Local rules stay local.</p>
          <h1>A hospital can prove its care.<br />A home usually cannot.</h1>
          <p className="lede light">
            CareProof turns “hospital-grade at home” into a score, a safety gate, and an audit trail. The measurement stays the same in India, the UK, and the US. The rules underneath it are configurable.
          </p>
          <div className="hero-actions">
            <Link className="btn solid" to="/patients/P006">See the 94 that fails</Link>
            <Link className="btn ghost" to="/dashboard">Open the pilot</Link>
          </div>
          <div className="hero-metrics">
            <div><b>{fleet.meanScore}</b><span>mean score</span></div>
            <div className="good"><b>{fleet.green}</b><span>meets the standard</span></div>
            <div className="bad"><b>{fleet.critical}</b><span>not compliant</span></div>
          </div>
        </div>

        <article className="passport">
          <div className="passport-head">
            <div>
              <div className="id">Passport · {trap.patient.id} · simulated</div>
              <h2 style={{ marginTop: 6 }}>{trap.patient.name}</h2>
            </div>
            <div className="stamp">Not compliant</div>
          </div>
          <div className="score-row">
            <div className="score-xl">{trap.score}<small>/100</small></div>
            <div className="gate-box">
              <b>Safety gate failed</b>
              <p>Oxygen concentrator maintenance was due 12 March 2026.</p>
            </div>
          </div>
          <p className="fine">A high score does not override a critical equipment failure.</p>
          <div className="trend-live" aria-label="Oxygen saturation falling through the day">
            {trend.map(([time, value], index) => (
              <div key={time} className={index === step ? "on" : index < step ? "past" : ""}>
                <span>{time}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="fine">Same engine, another home: saturation falling 96 to 88. The question is deterioration.</p>
        </article>
      </section>

      <section className="world">
        {places.map(([name, note]) => (
          <article key={name}>
            <strong>{name}</strong>
            <span>{note}</span>
          </article>
        ))}
        <article className="world-core">
          <strong>CareProof core</strong>
          <span>Same pillars, same gates, same passport.</span>
        </article>
      </section>

      <div className="sheet">
        <section>
          <p className="kicker">The question</p>
          <h2>Can we prove that care at home meets a predefined safety and quality standard?</h2>
          <p className="lede">The answer is not a percentage on its own. The answer is a measurement, a gate that can veto the measurement, and a record someone else can audit.</p>
          <div className="flow">
            {loop.map(([title, text], index) => (
              <div key={title}>
                <span>0{index + 1}</span>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="band alt">
          <p className="kicker">Simulated fleet of eight</p>
          <h2>The average looks fine. The standard does not agree.</h2>
          <div className="three" style={{ marginTop: 22 }}>
            <article className="card">
              <div className="big-num">{fleet.meanScore}</div>
              <h3>Mean quality score</h3>
              <p>Across eight fictional episodes. A mean hides the episodes that must not be called compliant.</p>
            </article>
            <article className="card">
              <div className="big-num">{fleet.green}</div>
              <h3>Meets the proposed standard</h3>
              <p>Score at or above 90, and every safety gate passed. One episode. Meera Iyer.</p>
            </article>
            <article className="card">
              <div className="big-num">{fleet.critical}</div>
              <h3>Not compliant</h3>
              <p>A gate failed. Includes the episode that still scores 94.</p>
            </article>
          </div>
          <div className="hero-actions">
            <Link className="btn" to="/patients/P003">Open the deteriorating case</Link>
            <Link className="btn line" to="/incident">Play the surprise incident</Link>
          </div>
        </section>

        <section>
          <div className="three">
            <article className="card">
              <p className="kicker">01</p>
              <h3>The score cannot acquit a failed gate</h3>
              <p>Equipment, escalation, critical skills, and medication breaches are pass/fail. They sit outside the weighted total.</p>
            </article>
            <article className="card">
              <p className="kicker">02</p>
              <h3>The trend matters more than one reading</h3>
              <p>96, then 94, then 91, then 88 is a different question from “is 88 dangerous?”. The Home Early Warning Index asks whether the person is deteriorating.</p>
            </article>
            <article className="card">
              <p className="kicker">03</p>
              <h3>The device and the caregiver are one chain</h3>
              <p>Inspection, then certification for that device, then maintenance. Any break makes the device ineligible for use.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
