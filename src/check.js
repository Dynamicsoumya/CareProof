import { pilot } from "./pilot.js";

for (const episode of pilot) {
  const failed = episode.gates.filter((gate) => !gate.pass).map((gate) => gate.id).join("+") || "none";
  const parts = episode.breakdown.map((item) => `${item.short}:${item.score}`).join(" ");
  console.log(
    `${episode.patient.id}  score ${String(episode.score).padStart(3)}  ${episode.status.band.padEnd(9)} ${episode.status.label.padEnd(26)} HEWI ${episode.hewi.level.padEnd(9)} gates ${failed}`
  );
  console.log(`       ${parts}`);
}
