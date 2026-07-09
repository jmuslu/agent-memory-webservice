# NANDA Memory Fusion Service

This is a small NandaHack Phase 2 web service. It exposes a stateless basis-gated memory fusion API that agents can call when they need to separate actionable evidence from irrelevant context saturation.

It is not a long-term conversation memory store and does not require accounts, secrets, or private user data for the public demo. The browser verification flow uses fixed public demonstration data.

## Endpoints

- `GET /api/health`
- `GET /api/examples`
- `POST /api/fuse`
- `GET /skill.md`

## Local verification

```powershell
npm test
node local-server.js
```

In a second terminal:

```powershell
curl.exe http://localhost:3000/api/health
curl.exe http://localhost:3000/skill.md
curl.exe -X POST http://localhost:3000/api/fuse -H "Content-Type: application/json" --data-binary "@examples/calculator-fusion.json"
```

## Deploy

Import this folder as a Vercel project, or run:

```powershell
npx vercel
```

After deployment, open:

```text
https://your-project.vercel.app/skill.md
```

Use that URL for the NANDA Town skills submission.
