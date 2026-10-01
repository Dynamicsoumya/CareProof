import { Link, useParams } from "react-router-dom";
import { HEWI_COPY } from "../engine.js";
import { Pill, Title } from "../components/ui.jsx";
import { pilot } from "../pilot.js";

export default function Passport() {
  const { id } = useParams();
  const episode = pilot.find((item) => item.patient.id === (id || "P006")) || pilot[0];
  const { patient } = episode;
  const gateFailed = (id) => episode.gates.some((gate) => gate.id === id && !gate.pass);
  const dot = {
    Equipment: gateFailed("equipment"),
    Response: gateFailed("response"),
    Outcome: episode.status.band === "critical" || episode.status.band === "red",
  };

  const events = [
    ["Care plan", `${patient.condition}. Baseline: ${patient.baseline}.`],
    ["Caregiver", `${episode.caregiver.name}, ${episode.caregiver.role}, assessed ${episode.caregiver.assessed}. Score ${episode.person.sum}/${episode.person.max}.`],
    ["Equipment", episode.deviceReports.map((report) => `${report.device.id} ${report.eligible ? "eligible" : "not eligible"} (${report.score})`).join(". ") + "."],
    ["Monitoring", `${HEWI_COPY[episode.hewi.level]}. ${episode.hewi.steps} deterioration step(s). Latest reference total ${episode.hewi.latest.total}.`],
    ["Response", episode.gates.find((gate) => gate.id === "response").reason],
    ["Incidents", patient.id === "P008" ? "Overnight deterioration with no caregiver acknowledgement. See the surprise incident." : "No surprise-incident flag on this episode."],
    ["Outcome", `Quality score ${episode.score}/100. ${episode.status.label}. ${episode.status.detail}`],
  ];

  return (
    <div className="page">
      <Title>Passport</Title>
      <header className="page-head">
        <div>
          <p className="kicker">CareProof passport</p>
          <h1>{patient.name}</h1>
          <p className="lede">The episode keeps its evidence. A later repair does not erase the assessment that failed.</p>
        </div>
        <button className="btn noprint" onClick={() => window.print()}>Print record</button>
      </header>

      <div className="filters noprint">
        {pilot.map((item) => (
          <Link key={item.patient.id} to={`/passport/${item.patient.id}`} className={item.patient.id === patient.id ? "btn" : "btn line"}>
            {item.patient.id}
          </Link>
        ))}
      </div>

      <article className="passport" style={{ marginTop: 8 }}>
        <div className="passport-head">
          <div>
            <div className="id">Episode {patient.id} · {patient.city} · assessed 28 Sep 2026</div>
            <h2>{patient.name}</h2>
            <p className="fine">Age {patient.age}. {patient.condition}</p>
          </div>
          <Pill band={episode.status.band}>{episode.status.label}</Pill>
        </div>
        <div className="rule" />
        <div className="split">
          <div className="score-xl" style={{ fontSize: 64 }}>{episode.score}<small>/100</small></div>
          <div>
            {episode.gates.map((gate) => (
              <p key={gate.id}><strong className={gate.pass ? "mark yes" : "mark no"}>{gate.pass ? "Pass" : "Fail"} · </strong>{gate.name}</p>
            ))}
          </div>
        </div>
      </article>

      <ol className="rail" style={{ marginTop: 22 }}>
        {events.map(([title, text]) => (
          <li key={title}>
            <i className={dot[title] ? "node bad" : "node"} />
            <div className="body">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
