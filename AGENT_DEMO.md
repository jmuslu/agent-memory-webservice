# Fresh Agent Demo

This demo proves the service from the perspective of a new agent session.

## Option A: local replay of a prompt-injected session

Run:

```powershell
npm run prompt-demo -- "https://agent-memory-webservice.vercel.app" "examples/agent-session-prompt.md"
```

This starts from a prompt file, extracts the task setup, reads the live `SKILL.md`, calls the live service, and prints the agent-facing decision path.

## Option B: paste into a fresh Codex, Claude, or terminal-capable agent

Open:

```text
examples/fresh-agent-copy-paste-prompt.md
```

Paste the whole prompt into a fresh agent session. The agent should:

1. Fetch `https://agent-memory-webservice.vercel.app/skill.md`.
2. Discover `POST /api/fuse`.
3. Submit the JSON setup included in the prompt.
4. Report which evidence fused and which inputs were ignored.
5. End with:

```text
decision|calculator|ship|score=4|ignored=3
```

This shows the service does not depend on a custom local harness. The same public `SKILL.md` and live endpoint can be used from any compatible agent setup.

## Option C: paste into a sandboxed browser-only agent

Open:

```text
examples/browser-agent-copy-paste-prompt.md
```

Paste the whole prompt into a fresh chat session that can browse but cannot run shell commands. The agent should:

1. Open `https://agent-memory-webservice.vercel.app/skill.md`.
2. Open `https://agent-memory-webservice.vercel.app/api/project-prompt` to show the project prompt and basis.
3. Open `https://agent-memory-webservice.vercel.app/api/source-text` to show source saturation text separately.
4. Open `https://agent-memory-webservice.vercel.app/api/build-payload` to show the constructed payload.
5. Open `https://agent-memory-webservice.vercel.app/api/verify-chain` to show the live result and audit flags.
6. Open `https://agent-memory-webservice.vercel.app/api/adversarial-suite` to show GET-only adversarial probes and the explicit basis-spoof limitation.
7. Report the final trace:

```text
decision|calculator|ship|score=4|ignored=3
```
