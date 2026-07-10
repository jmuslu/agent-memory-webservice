# NANDA Memory Fusion Service

This is a small NandaHack Phase 2 web service. It demonstrates two layers of agent memory:

1. **A PN-Counter core** that preserves signed evidence. Accepted reports accumulate into two grow-only maps (`value = sum(positive) - sum(negative)`) whose merge is pointwise max, so concurrent deltas converge without loss — where a last-writer-wins register would silently drop all but one. `POST /api/fuse` returns the `pn_counter` object so you can see the preserved total.
2. **A basis gate** on top that decides which reports are even allowed to become deltas: only evidence that restricts onto a declared task basis fuses; irrelevant natural-language, code-shaped, and off-basis context is ignored.

The homepage's **PN-Counter** tab runs a live "preservation vs last-writer-wins" contrast against `/api/fuse`.

It is not a long-term conversation memory store and does not require accounts, secrets, or private user data for the public demo. The browser verification flow uses fixed public demonstration data.

Use the hosted service as a proof-of-concept, teaching artifact, and browser-testable harness. For production use, port or self-host the pattern inside your own trusted stack with persistence, authentication, provenance, and rate limits.

Deployment pattern example: use basis-gated fusion before or inside durable memory workflows. It can run as an external pre-write gate, inside an LLM wiki workflow, inside an agent memory pipeline, or as a local library in a trusted stack. The hosted service is intentionally stateless so it can show the rule without claiming to be the memory database itself.

## Endpoints

- `GET /api/health`
- `GET /api/scope`
- `GET /api/project-prompt`
- `GET /api/source-text`
- `GET /api/build-payload`
- `GET /api/verify-chain`
- `GET /api/adversarial-suite`
- `GET /api/examples`
- `GET /api/demo-run`
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
