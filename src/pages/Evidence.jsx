import { useMemo, useState } from "react";
import { sources } from "../data.js";
import { Title } from "../components/ui.jsx";

export default function Evidence() {
  const topics = useMemo(() => ["All", ...Array.from(new Set(sources.map((item) => item.topic)))], []);
  const [topic, setTopic] = useState("All");
  const visible = topic === "All" ? sources : sources.filter((item) => item.topic === topic);

  return (
    <div className="page">
      <Title>Evidence</Title>
      <header className="page-head">
        <div>
          <p className="kicker">{sources.length} sources</p>
          <h1>What the source supports, and what we added.</h1>
          <p className="lede">Each row is a design implication, not a quotation dressed up as our finding. Thresholds inside the product are proposed rules unless the row says they come from the cited chart.</p>
        </div>
      </header>
      <div className="filters">
        {topics.map((item) => (
          <button key={item} className={item === topic ? "on" : ""} onClick={() => setTopic(item)}>{item}</button>
        ))}
      </div>
      <div className="stack">
        {visible.map((item) => (
          <article className="source" key={item.id}>
            <p className="fine">{item.id} · {item.topic}</p>
            <h3>{item.source}</h3>
            <p><strong>Finding used. </strong>{item.finding}</p>
            <p style={{ marginTop: 6 }}><strong>Effect on CareProof. </strong>{item.effect}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
