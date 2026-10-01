# CareProof

A simulated pilot of a proposed home-care quality and safety framework.

From promise to proof: a 0–100 score, a safety gate that can veto it, and an audit passport. The cases are fictional. The framework is not presented as a validated clinical tool.

## Run it

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173

`npm run check` prints the eight episode scores.

`npm run server` starts a small read-only API on port 8787. The screens do not need it. `server/schema.sql` is the proposed PostgreSQL model for a later build.
