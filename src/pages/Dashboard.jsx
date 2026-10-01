import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HEWI_COPY } from "../engine.js";
import { Pill, Title } from "../components/ui.jsx";
import { fleetSummary, pilot } from "../pilot.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const fleet = fleetSummary();
  const trap = pilot.find((episode) => episode.patient.id === "P006");

  return (
    <div className="page">
      <Title>Overview</Title>
      <div className="notice">
        Eight fictional episodes, assessed on 28 September 2026. Weights and thresholds are proposed implementation rules for a pilot.
      </div>
      <div className="filters">
        <Link className="btn" to="/patients/P006">The 94 that fails</Link>
        <Link className="btn line" to="/patients/P003">The deteriorating trend</Link>
        <Link className="btn line" to="/incident">The surprise incident</Link>
      </div>
      <header className="page-head">
        <div>
          <p className="kicker">Pilot workspace</p>
          <h1>The fleet, scored and gated.</h1>
        </div>
      </header>

      <div className="stat-row">
        <article className="stat"><b>{fleet.meanScore}</b><span>Mean score</span></article>
        <article className="stat"><b>{fleet.green}</b><span>Meets proposed standard</span></article>
        <article className="stat"><b>{fleet.amber + fleet.red}</b><span>Conditional or improvement</span></article>
        <article className="stat"><b>{fleet.critical}</b><span>Not compliant</span></article>
      </div>

      <div className="two" style={{ marginBottom: 14 }}>
        <article className="callout">
          <span className="kicker">Why the mean is the wrong headline</span>
          <strong>{trap.patient.name} scores {trap.score}. Status: {trap.status.label}.</strong>
          <p>OXY-001 maintenance was due in March. The quality score stays high because maintenance is a quarter of a pillar worth 15%. The gate fails anyway.</p>
        </article>
        <article className="card">
          <h3>Mean pillar scores</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleet.averages.map((pillar) => ({ ...pillar, tick: pillar.id === "infection" ? "Infection" : pillar.id === "documentation" ? "Records" : pillar.short }))} margin={{ top: 10, right: 8, left: -18, bottom: 8 }}>
                <XAxis dataKey="tick" tick={{ fontSize: 11 }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="average" fill="#0e9a68" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="table-wrap clickable">
        <table>
          <thead>
            <tr>
              <th>Episode</th>
              <th>Person</th>
              <th>Score</th>
              <th>HEWI</th>
              <th>Final status</th>
            </tr>
          </thead>
          <tbody>
            {pilot.map((episode) => (
              <tr key={episode.patient.id} onClick={() => navigate(`/patients/${episode.patient.id}`)}>
                <td>{episode.patient.id}</td>
                <td>
                  <div className="name-link">{episode.patient.name}</div>
                  <div className="fine">{episode.patient.city} · {episode.patient.condition}</div>
                </td>
                <td>{episode.score}</td>
                <td>{HEWI_COPY[episode.hewi.level]}</td>
                <td><Pill band={episode.status.band}>{episode.status.label}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
