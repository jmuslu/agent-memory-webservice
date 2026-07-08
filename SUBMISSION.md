# NANDA Memory Fusion Submission

## Skill name

NANDA Memory Fusion

## One-line description

Basis-gated memory fusion for agents: accepts signed evidence that matches a declared task basis and ignores irrelevant natural-language, code-shaped, and off-basis context.

## Source URL

Use the deployed `SKILL.md` URL:

```text
https://YOUR-VERCEL-URL.vercel.app/skill.md
```

## Endpoints

Replace `YOUR-VERCEL-URL` with the deployed Vercel host:

```text
GET https://YOUR-VERCEL-URL.vercel.app/api/health
GET https://YOUR-VERCEL-URL.vercel.app/api/examples
POST https://YOUR-VERCEL-URL.vercel.app/api/fuse
GET https://YOUR-VERCEL-URL.vercel.app/skill.md
```

## Tags

```text
memory, agents, crdt, context-saturation, verification
```

## Video demo outline

1. Open the deployed homepage.
2. Open `/skill.md` and point out that a stock agent can discover the base URL, endpoints, curl calls, example responses, and use steps.
3. Run `scripts/demo.ps1` against the deployed URL:

   ```powershell
   .\scripts\demo.ps1 -BaseUrl "https://YOUR-VERCEL-URL.vercel.app"
   ```

   Or run the agent-style narrated demo:

   ```powershell
   npm run agent-demo -- "https://YOUR-VERCEL-URL.vercel.app"
   ```

   To show a prompt injected into a fresh agent-style session, run:

   ```powershell
   npm run prompt-demo -- "https://YOUR-VERCEL-URL.vercel.app" "examples/agent-session-prompt.md"
   ```

   To demonstrate that the same setup can start from a fresh external agent session, paste this file into Codex, Claude, or another terminal-capable agent:

   ```text
   examples/fresh-agent-copy-paste-prompt.md
   ```

   The fresh agent should fetch `https://agent-memory-webservice.vercel.app/skill.md`, discover `POST /api/fuse`, call it with the included setup, and report the same `decision|calculator|ship|score=4|ignored=3` trace.

   For a sandboxed browser-only agent, paste:

   ```text
   examples/browser-agent-copy-paste-prompt.md
   ```

   That version uses only public URLs: `/skill.md`, `/api/examples`, and `/api/demo-run`.

4. Show that `/api/fuse` accepts the four calculator basis reports.
5. Show that natural-language saturation, code-shaped saturation, and the off-basis `"horoscope"` claim are ignored.
6. Point to the trace line:

   ```text
   decision|calculator|ship|score=4|ignored=3
   ```

## Short spoken pitch

Agents should not treat every piece of context as memory. This service gives them a small typed memory layer: reports fuse only when they match a declared basis dimension, signed deltas accumulate in PN-Counter-style coordinates, and irrelevant context remains non-actionable even when it looks plausible or technical.
