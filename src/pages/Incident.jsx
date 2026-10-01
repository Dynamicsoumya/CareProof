import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { incidentSteps } from "../data.js";
import { Title } from "../components/ui.jsx";
import { getEpisode } from "../pilot.js";

export default function Incident() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const episode = getEpisode("P008");
  const step = incidentSteps[index];

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => {
        if (current >= incidentSteps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1600);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <div className="page">
      <Title>Surprise incident</Title>
      <header className="page-head">
        <div>
          <p className="kicker">Unknown event, known pathway</p>
          <h1>He deteriorated at 02:10. Nobody answered.</h1>
          <p className="lede">Suresh Nair is fictional. The pathway is the point: detect the trend, start a timer, escalate when it expires, keep the record, then change the system.</p>
        </div>
        <button className="btn" onClick={() => { setIndex(0); setPlaying(true); }}>Play the night</button>
      </header>

      <div className="player">
        <div className="steps">
          {incidentSteps.map((item, itemIndex) => (
            <button key={item.id} className={itemIndex === index ? "on" : ""} onClick={() => { setPlaying(false); setIndex(itemIndex); }}>
              <strong>{item.time}</strong>
              <div>{item.title}</div>
            </button>
          ))}
        </div>
        <article className="card">
          <p className="kicker">Step {index + 1} of {incidentSteps.length}</p>
          <h2>{step.title}</h2>
          <p className="lede">{step.text}</p>
          <div className="rule" />
          <p>Engine result for this episode: <strong>{episode.score}/100 · {episode.status.label}</strong>.</p>
          <p className="fine">Failed gates: {episode.gates.filter((gate) => !gate.pass).map((gate) => gate.name).join(", ")}.</p>
          <p style={{ marginTop: 12 }}>
            <Link to="/patients/P008">Open Suresh’s full record</Link>
          </p>
        </article>
      </div>

      <article className="card" style={{ marginTop: 14 }}>
        <h3>What the score does after the incident</h3>
        <p>The failed response and the incomplete escalation skill both stay failed. A corrective action can change the next episode. It does not rewrite this one. That is the audit.</p>
      </article>
    </div>
  );
}
