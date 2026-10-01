import { Link } from "react-router-dom";
import { HEWI_COPY } from "../engine.js";
import { Pill, Title } from "../components/ui.jsx";
import { pilot } from "../pilot.js";

export default function Patients() {
  return (
    <div className="page">
      <Title>Patients</Title>
      <header className="page-head">
        <div>
          <p className="kicker">Simulated episodes</p>
          <h1>Eight homes. Eight different proofs.</h1>
          <p className="lede">Names, agencies, and devices are fictional. Open a case to see the score, the gates, and the trend together.</p>
        </div>
      </header>
      <div className="card-grid cols-2">
        {pilot.map((episode) => (
          <Link key={episode.patient.id} to={`/patients/${episode.patient.id}`} className="card" style={{ textDecoration: "none" }}>
            <div className="split">
              <span className="fine">{episode.patient.id} · {episode.patient.city}</span>
              <Pill band={episode.status.band}>{episode.status.label}</Pill>
            </div>
            <h3 style={{ marginTop: 8 }}>{episode.patient.name}</h3>
            <p>{episode.patient.condition}</p>
            <p style={{ marginTop: 12 }}>
              <strong>{episode.score}/100</strong>
              <span className="fine"> · {HEWI_COPY[episode.hewi.level]}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
