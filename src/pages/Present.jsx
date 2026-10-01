import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScoreDial } from "../components/ui.jsx";
import { getEpisode, fleetSummary } from "../pilot.js";

const slides = [
  {
    kicker: "The problem",
    title: "A hospital keeps the monitors, the checks, and the record. Then the patient goes home.",
    body: "Hospital-grade at home is easy to say. It is hard to prove. CareProof is a proposed way to measure the proof.",
  },
  {
    kicker: "The trap",
    title: "A high score is not hospital-grade.",
    body: "Arun’s episode scores 94. His oxygen concentrator was due for maintenance in March. The safety gate fails. The status is not compliant.",
    episode: "P006",
  },
  {
    kicker: "The standard",
    title: "Six pillars. The weights are a proposal, not a discovery.",
    body: "Clinical 25, caregiver 20, equipment 15, infection and medication 15, documentation 10, experience 15. Phase 2 of the protocol exists to argue with those numbers.",
  },
  {
    kicker: "The original piece",
    title: "Trend, then response. The biology and the behaviour are separated.",
    body: "Fatima’s saturation falls 96, 94, 91, 88. That is an emergency pattern. Her nurse escalates, so the response gate passes. The concentrator inspection is overdue, so the episode still fails. Score 71.",
    episode: "P003",
  },
  {
    kicker: "One chain",
    title: "Inspection. Then this caregiver, on this device. Then maintenance.",
    body: "Any break makes the device ineligible. A competent nurse cannot rescue an overdue concentrator, and a serviced device cannot rescue an attendant who cannot escalate.",
  },
  {
    kicker: "The fleet",
    title: "The average is a comfortable way to miss the point.",
    body: "Eight simulated episodes. The mean score looks acceptable. One episode meets the proposed standard. Five are not compliant, including the one at 94.",
    fleet: true,
  },
  {
    kicker: "The night",
    title: "If the incident is a surprise, the pathway should not be.",
    body: "Detect the trend. Alert the caregiver. Start a timer. No answer. Call the supervisor. Log it. Review the cause. Change the next shift. Leave this episode failed.",
  },
  {
    kicker: "The science",
    title: "The pilot is for feasibility and validity. It is not an effectiveness trial.",
    body: "Six to eight experts. Thirty dual-assessed episodes. A later comparison, if the measure survives, is planned at about 111 per group after attrition. Those inputs are assumptions, and they are labelled as assumptions.",
  },
  {
    kicker: "Close",
    title: "From promise to proof.",
    body: "CareProof does not claim the framework is already clinically validated. It claims something narrower, and more useful: you can audit it.",
  },
];

export default function Present() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const episode = slide.episode ? getEpisode(slide.episode) : null;
  const fleet = fleetSummary();

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((current) => Math.min(slides.length - 1, current + 1));
      }
      if (event.key === "ArrowLeft") setIndex((current) => Math.max(0, current - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="stage">
      <div>
        <div className="split">
          <Link to="/" className="brand">CareProof</Link>
          <Link to="/dashboard" style={{ color: "#f3d48a" }}>Leave the walkthrough</Link>
        </div>
        <div className="stage-progress" style={{ marginTop: 14 }}>
          <i style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
      </div>
      <div className="stage-body">
        <div className={episode || slide.fleet ? "two" : "stack"}>
          <div>
            <p className="kicker light">{slide.kicker}</p>
            <h1>{slide.title}</h1>
            <p className="lede light">{slide.body}</p>
          </div>
          {episode && (
            <article className="passport">
              <div className="id">{episode.patient.id} · {episode.patient.name}</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12 }}>
                <ScoreDial score={episode.score} band={episode.status.band} />
                <div>
                  <h2>{episode.status.label}</h2>
                  <p className="fine">{episode.gates.filter((gate) => !gate.pass).map((gate) => gate.name).join(", ") || "All gates passed"}</p>
                </div>
              </div>
            </article>
          )}
          {slide.fleet && (
            <div className="stack">
              <article className="card"><div className="big-num">{fleet.meanScore}</div><p>Mean score</p></article>
              <article className="card"><div className="big-num">{fleet.green} of {fleet.total}</div><p>Meet the proposed standard</p></article>
            </div>
          )}
        </div>
      </div>
      <div className="stage-nav">
        <span>{index + 1} / {slides.length}</span>
        <span>Arrow keys</span>
        <span>
          <button className="btn ghost" onClick={() => setIndex((current) => Math.max(0, current - 1))}>Back</button>
          {" "}
          <button className="btn solid" onClick={() => setIndex((current) => Math.min(slides.length - 1, current + 1))}>Next</button>
        </span>
      </div>
    </div>
  );
}
