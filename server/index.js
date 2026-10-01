import express from "express";
import { pilot, fleetSummary } from "../src/pilot.js";

const app = express();
const port = process.env.PORT || 8787;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "careproof-pilot", records: "simulated" });
});

app.get("/api/summary", (_req, res) => {
  res.json(fleetSummary());
});

app.get("/api/episodes", (_req, res) => {
  res.json(pilot.map((episode) => ({
    id: episode.patient.id,
    name: episode.patient.name,
    score: episode.score,
    band: episode.status.band,
    label: episode.status.label,
    hewi: episode.hewi.level,
    gates: episode.gates.map((gate) => ({ id: gate.id, pass: gate.pass })),
  })));
});

app.get("/api/episodes/:id", (req, res) => {
  const episode = pilot.find((item) => item.patient.id === req.params.id);
  if (!episode) {
    res.status(404).json({ error: "No simulated episode with that id." });
    return;
  }
  res.json(episode);
});

app.listen(port, () => {
  console.log(`CareProof API on http://127.0.0.1:${port}`);
});
