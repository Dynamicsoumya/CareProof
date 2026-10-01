import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { patients } from "../data.js";
import { COMPETENCIES, HEWI_COPY, LEVEL_COPY } from "../engine.js";
import { Breakdown, Gates, Pill, ScoreDial, StatusLine, Title } from "../components/ui.jsx";
import { runEpisode } from "../pilot.js";

export default function Patient() {
  const { id } = useParams();
  const patient = patients.find((item) => item.id === id);
  const [fixMaintenance, setFixMaintenance] = useState(false);
  const [fixInspection, setFixInspection] = useState(false);
  const [acknowledge, setAcknowledge] = useState(false);
  const [liftSkills, setLiftSkills] = useState(false);

  const base = useMemo(() => (patient ? runEpisode(patient) : null), [patient]);
  const episode = useMemo(() => {
    if (!patient) return null;
    return runEpisode(patient, {
      maintenanceCurrent: fixMaintenance || undefined,
      inspectionValid: fixInspection || undefined,
      acknowledged: acknowledge || undefined,
      withinTimer: acknowledge || undefined,
      liftCriticalSkills: liftSkills || undefined,
    });
  }, [patient, fixMaintenance, fixInspection, acknowledge, liftSkills]);

  if (!patient) {
    return <div className="page"><h1>That episode is not in the pilot.</h1></div>;
  }

  const chart = episode.hewi.scored.map((reading) => ({
    t: reading.t,
    spo2: reading.spo2,
    hr: reading.hr,
    temp: reading.temp,
  }));
  const whatIf = fixMaintenance || fixInspection || acknowledge || liftSkills;

  return (
    <div className="page">
      <Title>{patient.name}</Title>
      <header className="page-head">
        <div>
          <p className="kicker">{patient.id} · {patient.city} · age {patient.age}</p>
          <h1>{patient.name}</h1>
          <p className="lede">{patient.story}</p>
        </div>
        <Pill band={episode.status.band}>{episode.status.label}</Pill>
      </header>

      <div className="two" style={{ marginBottom: 14 }}>
        <article className="card" style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <ScoreDial score={episode.score} band={episode.status.band} />
          <div>
            <p className="fine">Quality score {whatIf ? "under this what-if" : "on the assessment date"}</p>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 500 }}>{episode.status.label}</h3>
            <p className="fine">HEWI {HEWI_COPY[episode.hewi.level]} · reference total {episode.hewi.latest.total} · {episode.hewi.steps} deterioration steps</p>
            <p className="fine">Baseline: {patient.baseline}</p>
          </div>
        </article>
        <article className="card">
          <h3>Safety gates</h3>
          <Gates gates={episode.gates} />
        </article>
      </div>

      <StatusLine episode={episode} />

      <div className="card noprint" style={{ margin: "14px 0" }}>
        <h3>What if the failed check were repaired?</h3>
        <p className="fine">The original assessment stays on the passport. This only shows how the engine would reclassify the episode.</p>
        <div className="filters" style={{ marginTop: 10 }}>
          <button className={fixMaintenance ? "on" : ""} onClick={() => setFixMaintenance((value) => !value)}>Maintenance current</button>
          <button className={fixInspection ? "on" : ""} onClick={() => setFixInspection((value) => !value)}>Inspection valid</button>
          <button className={acknowledge ? "on" : ""} onClick={() => setAcknowledge((value) => !value)}>Escalation acknowledged</button>
          <button className={liftSkills ? "on" : ""} onClick={() => setLiftSkills((value) => !value)}>C5 and C6 raised to Competent</button>
        </div>
        {whatIf && (
          <p>Original result: {base.score}/100, {base.status.label}. This view: {episode.score}/100, {episode.status.label}.</p>
        )}
      </div>

      <div className="two">
        <article className="card">
          <h3>SpO₂ across the episode</h3>
          <p className="fine">The line is the trend. A single point is not the decision.</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(20,36,28,0.08)" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="spo2" name="SpO₂" stroke="#e11d38" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="card">
          <h3>Pillar scores</h3>
          <p className="fine">Weighted into the total. A gate can still veto it.</p>
          <div style={{ marginTop: 14 }}>
            <Breakdown breakdown={episode.breakdown} />
          </div>
          <p className="fine" style={{ marginTop: 12 }}>
            {episode.breakdown.map((item) => `${item.short} ${item.score} × ${item.weight}`).join(" · ")}
          </p>
        </article>
      </div>

      <div className="two" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>Readings</h3>
          <div className="table-wrap" style={{ border: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Time</th><th>SpO₂</th><th>HR</th><th>RR</th><th>BP</th><th>Temp</th><th>Mind</th><th>Ref.</th>
                </tr>
              </thead>
              <tbody>
                {episode.hewi.scored.map((reading) => (
                  <tr key={reading.t}>
                    <td>{reading.t}</td>
                    <td>{reading.spo2}%</td>
                    <td>{reading.hr}</td>
                    <td>{reading.rr}</td>
                    <td>{reading.sbp}</td>
                    <td>{reading.temp}</td>
                    <td>{reading.consciousness}</td>
                    <td>{reading.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">“Ref.” is the NEWS2-style reference total for that reading. It is a scaffold, not a home-validated score. Scale {patient.spo2Scale}.</p>
          {episode.hewi.notes.length > 0 && (
            <ul>
              {episode.hewi.notes.map((note) => (
                <li key={note.to}>{note.from} → {note.to}: {note.hits.join("; ")}</li>
              ))}
            </ul>
          )}
        </article>
        <div className="stack">
          <article className="card">
            <h3>Assigned devices</h3>
            {episode.deviceReports.map((report) => (
              <div key={report.device.id} style={{ marginTop: 8 }}>
                <Link to="/equipment">{report.device.id} · {report.device.type}</Link>
                <ul className="checks">
                  {report.checks.map((check) => (
                    <li key={check.id}>
                      <span className={check.pass ? "mark yes" : "mark no"}>{check.pass ? "✓" : "!"}</span>
                      <span>{check.label}. {check.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </article>
          <article className="card">
            <h3>{episode.caregiver.name}</h3>
            <p className="fine">{episode.caregiver.role} · competency {episode.person.percent}% · {episode.person.pass ? "competency pass" : "competency not passed"}</p>
            <div style={{ marginTop: 8 }}>
              {COMPETENCIES.map((item) => (
                <div className="bar-row" key={item.id}>
                  <span>{item.name}</span>
                  <div className="track"><i style={{ width: `${(episode.person.scores[item.id] / 3) * 100}%` }} /></div>
                  <b>{episode.person.scores[item.id]}</b>
                </div>
              ))}
            </div>
            <p className="fine">0 {LEVEL_COPY[0]}. 1 {LEVEL_COPY[1]}. 2 {LEVEL_COPY[2]}. 3 {LEVEL_COPY[3]}.</p>
          </article>
        </div>
      </div>
    </div>
  );
}
