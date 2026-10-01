-- Proposed PostgreSQL model for a later implementation.
-- The hackathon pilot runs on the simulated records in src/data.js.

create table caregivers (
  id text primary key,
  name text not null,
  role text not null,
  assessed_on date not null
);

create table caregiver_competency (
  caregiver_id text references caregivers(id),
  code text not null,
  score smallint not null check (score between 0 and 3),
  primary key (caregiver_id, code)
);

create table devices (
  id text primary key,
  device_type text not null,
  manufacturer text not null,
  model text not null,
  serial_number text not null,
  received_on date not null,
  next_maintenance date not null,
  next_inspection date not null,
  calibration_status text not null,
  retired boolean not null default false
);

create table device_training (
  device_id text references devices(id),
  caregiver_id text references caregivers(id),
  primary key (device_id, caregiver_id)
);

create table episodes (
  id text primary key,
  patient_label text not null,
  caregiver_id text references caregivers(id),
  spo2_scale smallint not null check (spo2_scale in (1, 2)),
  baseline text not null
);

create table readings (
  episode_id text references episodes(id),
  observed_at timestamptz not null,
  spo2 smallint not null,
  heart_rate smallint not null,
  respiratory_rate smallint not null,
  systolic_bp smallint not null,
  temperature numeric(4,1) not null,
  consciousness text not null,
  on_oxygen boolean not null,
  primary key (episode_id, observed_at)
);

create table assessments (
  id bigserial primary key,
  episode_id text references episodes(id),
  assessed_at timestamptz not null default now(),
  quality_score smallint not null,
  final_band text not null,
  engine_version text not null
);

create table safety_gates (
  assessment_id bigint references assessments(id),
  gate_code text not null,
  passed boolean not null,
  reason text not null,
  primary key (assessment_id, gate_code)
);

create table audit_events (
  id bigserial primary key,
  episode_id text references episodes(id),
  event_time timestamptz not null,
  event_type text not null,
  payload jsonb not null
);
