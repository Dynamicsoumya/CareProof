import { caregivers, devices, patients } from "./data.js";
import { assessEpisode } from "./engine.js";

export function contextFor(patient) {
  return {
    caregiver: caregivers.find((person) => person.id === patient.caregiverId),
    devices: devices.filter((device) => patient.deviceIds.includes(device.id)),
  };
}

export function runEpisode(patient, overrides) {
  const ctx = contextFor(patient);
  return assessEpisode(patient, ctx.caregiver, ctx.devices, overrides);
}

export const pilot = patients.map((patient) => runEpisode(patient));

export function getEpisode(id) {
  return pilot.find((episode) => episode.patient.id === id);
}

export function fleetSummary(episodes = pilot) {
  const count = (band) => episodes.filter((episode) => episode.status.band === band).length;
  const averages = episodes[0].breakdown.map((pillar) => {
    const mean = episodes.reduce((sum, episode) => {
      const match = episode.breakdown.find((item) => item.id === pillar.id);
      return sum + match.score;
    }, 0) / episodes.length;
    return { ...pillar, average: Math.round(mean) };
  });
  const highScoreFailures = episodes.filter(
    (episode) => episode.score >= 90 && episode.status.band === "critical"
  );
  return {
    total: episodes.length,
    green: count("green"),
    amber: count("amber"),
    red: count("red"),
    critical: count("critical"),
    averages,
    highScoreFailures,
    meanScore: Math.round(episodes.reduce((sum, episode) => sum + episode.score, 0) / episodes.length),
  };
}
