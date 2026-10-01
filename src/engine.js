/**
 * CareProof measurement engine.
 *
 * NEWS2 parameter bands (RCP 2017) are used only as a reference scaffold.
 * HEWI trend rules, pillar weights, caps, and safety gates are proposed
 * implementation rules for a pilot. They are not a validated early-warning
 * score and they are not medical advice.
 */

export const AS_OF = "2026-09-28";

export const PILLARS = [
  {
    id: "clinical",
    name: "Clinical Safety & Monitoring",
    short: "Clinical",
    weight: 0.25,
  },
  {
    id: "caregiver",
    name: "Caregiver Competence",
    short: "Caregiver",
    weight: 0.2,
  },
  {
    id: "equipment",
    name: "Equipment Safety",
    short: "Equipment",
    weight: 0.15,
  },
  {
    id: "infection",
    name: "Infection & Medication Safety",
    short: "Infection & meds",
    weight: 0.15,
  },
  {
    id: "documentation",
    name: "Documentation & Continuity",
    short: "Documentation",
    weight: 0.1,
  },
  {
    id: "experience",
    name: "Patient & Family Experience",
    short: "Experience",
    weight: 0.15,
  },
];

export const COMPETENCIES = [
  { id: "C1", name: "Vital signs", detail: "Measures and records the required observations correctly." },
  { id: "C2", name: "Infection prevention", detail: "Demonstrates the hygiene and PPE steps used in that home." },
  { id: "C3", name: "Equipment", detail: "Operates the assigned device without inventing steps." },
  { id: "C4", name: "Medication safety", detail: "Follows the prescribed medication-management process." },
  { id: "C5", name: "Deterioration recognition", detail: "Names the warning pattern this patient was given." },
  { id: "C6", name: "Escalation", detail: "Knows who to contact and what to say." },
  { id: "C7", name: "Documentation", detail: "Completes the required record accurately." },
];

export const LEVEL_COPY = {
  0: "Not demonstrated",
  1: "Partially demonstrated",
  2: "Competent",
  3: "Competent in a simulated scenario",
};

export const HEWI_COPY = {
  green: "Stable",
  amber: "Abnormal value",
  red: "Repeated deterioration",
  critical: "Emergency pattern",
};

const EQUIP_WEIGHTS = {
  inspect: 0.22,
  trained: 0.18,
  maintain: 0.25,
  calibrate: 0.15,
  active: 0.1,
  incident: 0.1,
};

export function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function spo2Scale1(value) {
  if (value <= 91) return 3;
  if (value <= 93) return 2;
  if (value <= 95) return 1;
  return 0;
}

/** NEWS2 Scale 2 chart: ≥93% on air scores 0; the same saturation on oxygen does not. */
export function spo2Scale2(value, onOxygen) {
  if (value <= 83) return 3;
  if (value <= 85) return 2;
  if (value <= 87) return 1;
  if (value <= 92) return 0;
  if (!onOxygen) return 0;
  if (value <= 94) return 1;
  if (value <= 96) return 2;
  return 3;
}

export function hrPoints(value) {
  if (value <= 40) return 3;
  if (value <= 50) return 1;
  if (value <= 90) return 0;
  if (value <= 110) return 1;
  if (value <= 130) return 2;
  return 3;
}

export function rrPoints(value) {
  if (value <= 8) return 3;
  if (value <= 11) return 1;
  if (value <= 20) return 0;
  if (value <= 24) return 2;
  return 3;
}

export function sbpPoints(value) {
  if (value <= 90) return 3;
  if (value <= 100) return 2;
  if (value <= 110) return 1;
  if (value <= 219) return 0;
  return 3;
}

export function tempPoints(value) {
  if (value <= 35) return 3;
  if (value <= 36) return 1;
  if (value <= 38) return 0;
  if (value <= 39) return 1;
  return 2;
}

export function consciousPoints(level) {
  return level === "Alert" ? 0 : 3;
}

export function scoreReading(reading, scale) {
  const spo2 = scale === 2 ? spo2Scale2(reading.spo2, reading.onOxygen) : spo2Scale1(reading.spo2);
  const parts = {
    spo2,
    hr: hrPoints(reading.hr),
    rr: rrPoints(reading.rr),
    sbp: sbpPoints(reading.sbp),
    temp: tempPoints(reading.temp),
    consciousness: consciousPoints(reading.consciousness),
  };
  const total = Object.values(parts).reduce((sum, value) => sum + value, 0);
  const singleRed = Object.values(parts).some((value) => value >= 3);
  return { ...reading, parts, total, singleRed };
}

/**
 * Proposed rule: one deterioration step is a worsening between two
 * consecutive home readings, not a single number crossing a line.
 */
export function findSteps(readings) {
  const notes = [];
  for (let index = 1; index < readings.length; index += 1) {
    const previous = readings[index - 1];
    const current = readings[index];
    const hits = [];
    if (previous.spo2 - current.spo2 >= 2) hits.push(`SpO₂ ${previous.spo2}% → ${current.spo2}%`);
    if (current.hr - previous.hr >= 10) hits.push(`Heart rate ${previous.hr} → ${current.hr}`);
    if (current.rr - previous.rr >= 3) hits.push(`Respiratory rate ${previous.rr} → ${current.rr}`);
    if (current.temp - previous.temp >= 0.4) hits.push(`Temperature ${previous.temp}°C → ${current.temp}°C`);
    if (previous.sbp - current.sbp >= 12) hits.push(`Systolic BP ${previous.sbp} → ${current.sbp}`);
    if (previous.consciousness === "Alert" && current.consciousness !== "Alert") {
      hits.push(`Consciousness ${previous.consciousness} → ${current.consciousness}`);
    }
    if (hits.length) notes.push({ from: previous.t, to: current.t, hits });
  }
  return notes;
}

export function hewiLevel(latest, steps) {
  if (latest.total >= 7 || latest.parts.consciousness === 3 || (latest.singleRed && steps >= 2)) {
    return "critical";
  }
  if (steps >= 3 || latest.total >= 5) return "red";
  if (latest.total >= 1 || steps >= 1) return "amber";
  return "green";
}

export function clinicalPillar(level, latest, steps) {
  let score = 100 - Math.min(28, latest.total * 2) - steps * 4;
  if (latest.singleRed) score -= 6;
  if (level === "amber") score = Math.min(score, 84);
  if (level === "red") score = Math.min(score, 64);
  if (level === "critical") score = Math.min(score, 56);
  if (level === "green") score = Math.max(score, 96);
  return clamp(Math.round(score));
}

export function deviceChecks(device, caregiverId, overrides = {}) {
  const maintenanceCurrent = overrides.maintenanceCurrent ?? device.nextMaintenance >= AS_OF;
  const inspectionValid = overrides.inspectionValid ?? device.nextInspection >= AS_OF;
  const calibrationOk = !device.calibrationRequired || device.calibrationStatus === "Verified";
  const trained = device.trainedCaregiverIds.includes(caregiverId);
  const active = !device.retired;
  const incidentClear = !device.openCriticalIncident;

  return [
    { id: "inspect", label: "Inspection valid", pass: inspectionValid, detail: `Next inspection ${device.nextInspection}` },
    { id: "trained", label: "Caregiver certified for this device", pass: trained, detail: trained ? "Assigned caregiver is on the training record" : "Assigned caregiver is not certified for this device" },
    { id: "maintain", label: "Maintenance current", pass: maintenanceCurrent, detail: `Next maintenance ${device.nextMaintenance}` },
    { id: "calibrate", label: "Calibration / verification", pass: calibrationOk, detail: device.calibrationStatus },
    { id: "active", label: "Still in service", pass: active, detail: device.retired ? "Retired" : "Not retired" },
    { id: "incident", label: "No open critical device incident", pass: incidentClear, detail: incidentClear ? "Clear" : "Open critical incident" },
  ];
}

export function deviceScore(checks) {
  const raw = checks.reduce((sum, check) => sum + (check.pass ? 100 : 0) * EQUIP_WEIGHTS[check.id], 0);
  const inspection = checks.find((check) => check.id === "inspect");
  const capped = inspection && !inspection.pass ? Math.min(raw, 45) : raw;
  return clamp(Math.round(capped));
}

export function caregiverResult(caregiver, overrides = {}) {
  const scores = { ...caregiver.competencies };
  if (overrides.liftCriticalSkills) {
    scores.C5 = Math.max(scores.C5, 2);
    scores.C6 = Math.max(scores.C6, 2);
  }
  const values = COMPETENCIES.map((item) => scores[item.id]);
  const sum = values.reduce((total, value) => total + value, 0);
  const percent = Math.round((sum / (COMPETENCIES.length * 3)) * 100);
  const noZero = values.every((value) => value > 0);
  const criticalSkills = scores.C5 >= 2 && scores.C6 >= 2;
  return {
    scores,
    sum,
    max: COMPETENCIES.length * 3,
    percent,
    pass: sum >= 14 && noZero && criticalSkills,
    criticalFail: scores.C5 === 0 || scores.C6 === 0 || !criticalSkills,
  };
}

function meanFields(record, keys) {
  return Math.round(avg(keys.map((key) => record[key])));
}

export function assessEpisode(patient, caregiver, devices, overrides = {}) {
  const scored = patient.readings.map((reading) => scoreReading(reading, patient.spo2Scale));
  const notes = findSteps(patient.readings);
  const latest = scored[scored.length - 1];
  const level = hewiLevel(latest, notes.length);
  const clinical = clinicalPillar(level, latest, notes.length);

  const person = caregiverResult(caregiver, overrides);
  const deviceReports = devices.map((device) => {
    const checks = deviceChecks(device, patient.caregiverId, overrides);
    return {
      device,
      checks,
      eligible: checks.every((check) => check.pass),
      score: deviceScore(checks),
    };
  });
  const equipment = deviceReports.length
    ? Math.min(...deviceReports.map((report) => report.score))
    : 0;
  const equipmentEligible = deviceReports.every((report) => report.eligible);

  const infectionKeys = ["handHygiene", "ppe", "medReconciliation", "fiveRights", "storage"];
  let infection = meanFields(patient.infection, infectionKeys);
  if (patient.infection.criticalBreach) infection = Math.min(infection, 40);

  const documentation = patient.documentation.completeness;
  const experience = meanFields(patient.experience, ["dignity", "communication", "painRelief", "caregiverBurden"]);

  const needsResponse = level === "red" || level === "critical";
  const acknowledged = overrides.acknowledged ?? patient.response.acknowledged;
  const withinTimer = overrides.withinTimer ?? patient.response.withinTimer;
  const responseMet = !needsResponse || (patient.documentation.escalationLogged && acknowledged && withinTimer);

  const scores = {
    clinical,
    caregiver: person.percent,
    equipment,
    infection,
    documentation,
    experience,
  };

  const breakdown = PILLARS.map((pillar) => ({
    ...pillar,
    score: scores[pillar.id],
    weighted: Math.round(scores[pillar.id] * pillar.weight * 10) / 10,
  }));
  const score = clamp(Math.round(breakdown.reduce((sum, pillar) => sum + pillar.score * pillar.weight, 0)));

  const failedDevice = deviceReports.find((report) => !report.eligible);
  const failedCheck = failedDevice?.checks.find((check) => !check.pass);

  const gates = [
    {
      id: "response",
      name: "Deterioration response",
      pass: responseMet,
      reason: !needsResponse
        ? "No red or emergency pattern. A response was not required."
        : responseMet
          ? "The pattern was escalated and acknowledged inside the timer."
          : "A red or emergency pattern occurred and the caregiver did not complete escalation in time.",
    },
    {
      id: "equipment",
      name: "Equipment eligible for use",
      pass: equipmentEligible,
      reason: equipmentEligible
        ? "Every assigned device passed inspection, training, maintenance, calibration, and incident checks."
        : `${failedDevice.device.id}: ${failedCheck.label} failed. ${failedCheck.detail}.`,
    },
    {
      id: "competency",
      name: "Caregiver critical skills",
      pass: !person.criticalFail,
      reason: person.criticalFail
        ? "Recognition or escalation is below the proposed minimum of Competent (2), or a domain is not demonstrated."
        : `Competency ${person.sum}/${person.max}. Recognition and escalation are both at least Competent.`,
    },
    {
      id: "medication",
      name: "Infection & medication process",
      pass: !patient.infection.criticalBreach,
      reason: patient.infection.criticalBreach
        ? patient.infection.breachNote
        : "No critical breach in hygiene or the medication process.",
    },
  ];

  const failed = gates.filter((gate) => !gate.pass);
  let status;
  if (failed.length) {
    status = {
      band: "critical",
      label: "Not compliant",
      detail: "A safety gate failed. The quality score does not override it.",
    };
  } else if (score >= 90) {
    status = {
      band: "green",
      label: "Meets proposed standard",
      detail: "Score at or above 90 and every safety gate passed.",
    };
  } else if (score >= 75) {
    status = {
      band: "amber",
      label: "Conditional compliance",
      detail: "Score 75–89 with every safety gate passed.",
    };
  } else {
    status = {
      band: "red",
      label: "Improvement required",
      detail: "Score below 75. The gates passed, and the episode still misses the proposed standard.",
    };
  }

  return {
    patient,
    caregiver,
    hewi: {
      scored,
      notes,
      latest,
      level,
      steps: notes.length,
      clinical,
      needsResponse,
      responseMet,
    },
    person,
    deviceReports,
    scores,
    breakdown,
    score,
    gates,
    status,
  };
}
