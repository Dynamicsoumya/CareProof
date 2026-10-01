import { caregivers } from "../data.js";
import { COMPETENCIES, LEVEL_COPY, caregiverResult } from "../engine.js";
import { Title } from "../components/ui.jsx";

export default function Caregivers() {
  return (
    <div className="page">
      <Title>Caregivers</Title>
      <header className="page-head">
        <div>
          <p className="kicker">Observable competence</p>
          <h1>Trained is not a tick box.</h1>
          <p className="lede">Each domain is scored from what the person can demonstrate. A pass needs 14 out of 21, no zero, and both deterioration recognition and escalation at Competent or above.</p>
        </div>
      </header>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="comp">
          <span />
          {COMPETENCIES.map((item) => <b key={item.id}>{item.id}</b>)}
        </div>
        {caregivers.map((person) => {
          const result = caregiverResult(person);
          return (
            <div className="comp" key={person.id} style={{ marginTop: 6 }}>
              <div>
                <strong>{person.name}</strong>
                <div className="fine">{result.percent}% · {result.pass ? "pass" : "not passed"}</div>
              </div>
              {COMPETENCIES.map((item) => (
                <div key={item.id} className={`lvl l${person.competencies[item.id]}`}>{person.competencies[item.id]}</div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="card-grid cols-2">
        {COMPETENCIES.map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.id} · {item.name}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
      <p className="fine" style={{ marginTop: 12 }}>
        0 {LEVEL_COPY[0]}. 1 {LEVEL_COPY[1]}. 2 {LEVEL_COPY[2]}. 3 {LEVEL_COPY[3]}. Joseph has not demonstrated escalation. Imran’s escalation is only partial. Both fail the caregiver gate.
      </p>
    </div>
  );
}
