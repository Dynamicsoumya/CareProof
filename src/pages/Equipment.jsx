import { useState } from "react";
import { Link } from "react-router-dom";
import { devices, lifecycle, patients } from "../data.js";
import { deviceChecks } from "../engine.js";
import { Title } from "../components/ui.jsx";

export default function Equipment() {
  const [selected, setSelected] = useState(devices[0].id);
  const device = devices.find((item) => item.id === selected);
  const patient = patients.find((item) => item.deviceIds.includes(device.id));
  const checks = deviceChecks(device, patient.caregiverId);

  return (
    <div className="page">
      <Title>Equipment</Title>
      <header className="page-head">
        <div>
          <p className="kicker">Health technology, adapted to a home</p>
          <h1>A device is a lifecycle, not a sticker.</h1>
          <p className="lede">The stages follow the logic of WHO’s medical equipment maintenance series: inventory, inspection, preventive maintenance, training, records, and retirement. The chain under each device is the eligibility gate.</p>
        </div>
      </header>

      <div className="life">
        {lifecycle.map(([title, text], index) => (
          <div key={title}>
            <em>{String(index + 1).padStart(2, "0")}</em>
            <strong>{title}</strong>
            <p className="fine">{text}</p>
          </div>
        ))}
      </div>

      <div className="two" style={{ marginTop: 16 }}>
        <div className="stack">
          {devices.map((item) => {
            const owner = patients.find((person) => person.deviceIds.includes(item.id));
            const result = deviceChecks(item, owner.caregiverId);
            const ok = result.every((check) => check.pass);
            return (
              <button key={item.id} className={item.id === selected ? "card selected" : "card"} onClick={() => setSelected(item.id)}>
                <div className="split">
                  <strong>{item.id}</strong>
                  <span className={ok ? "mark yes" : "mark no"}>{ok ? "Eligible" : "Not eligible"}</span>
                </div>
                <div>{item.type}</div>
                <p className="fine">{item.manufacturer} {item.model} · assigned {owner.id}</p>
              </button>
            );
          })}
        </div>
        <article className="card">
          <p className="kicker">{device.id}</p>
          <h2>{device.type}</h2>
          <p>{device.manufacturer} {device.model} · serial {device.serial}</p>
          <p className="fine">Received {device.received}. Assigned to <Link to={`/patients/${patient.id}`}>{patient.name}</Link>.</p>
          <div className="rule" />
          <ul className="checks">
            {checks.map((check) => (
              <li key={check.id}>
                <span className={check.pass ? "mark yes" : "mark no"}>{check.pass ? "✓" : "!"}</span>
                <span><strong>{check.label}.</strong> {check.detail}</span>
              </li>
            ))}
          </ul>
          <div className="rule" />
          <p><strong>Eligible for use: {checks.every((check) => check.pass) ? "yes" : "no"}.</strong></p>
          <p className="fine">Last maintenance {device.lastMaintenance}. Next maintenance {device.nextMaintenance}. Calibration: {device.calibrationStatus}.</p>
          {device.incidents.length > 0 && (
            <p style={{ marginTop: 8 }}>{device.incidents.join(" ")}</p>
          )}
        </article>
      </div>
    </div>
  );
}
