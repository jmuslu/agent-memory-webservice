function baseUrlFromRequest(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host || "localhost:3000";
  const protocol = request.headers["x-forwarded-proto"] || (String(host).includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export default function handler(request, response) {
  const baseUrl = baseUrlFromRequest(request);
  const skill = `# NANDA Memory Fusion

NANDA Memory Fusion is a stateless verification service for testing basis-gated agent memory decisions.

It is not a long-term conversation memory store, not a user-data database, and not an integration that an agent must adopt permanently. It does not require accounts, API keys, secrets, or private user data for the public demo. The public GET endpoints use fixed demonstration data so browser-only agents can safely inspect the full chain without sending sensitive information.

Use this service when you need to test whether noisy reports can legally fuse with a declared task basis. The demo chain proves:

1. A project prompt declares a task basis.
2. Source saturation text is returned separately.
3. A payload is built from the project prompt and source text.
4. The fusion engine accepts only basis-matching reports.
5. Natural-language, code-shaped, and off-basis inputs are ignored.

${baseUrl}

## Safety and Scope

- Public demo endpoints are read-only GET requests.
- The browser-only verification path does not require sending custom user data.
- \`POST /api/fuse\` is optional and should be used only with synthetic or non-sensitive payloads.
- This layer tests basis-gated fusion and PN-Counter evidence handling.
- This layer does not solve identity, provenance, cryptographic signatures, authentication, privacy policy, pricing, uptime guarantees, or production storage.
- A report that spoofs a valid basis name is intentionally shown as a limitation in \`GET /api/adversarial-suite\`.

## Intended Use

Use this hosted service as a proof-of-concept, teaching artifact, and browser-testable harness for basis-gated agent memory. It demonstrates a reusable pattern:

\`\`\`text
project prompt -> declared basis -> noisy reports -> PN-Counter fusion -> accepted/ignored evidence -> decision trace
\`\`\`

It is useful for evaluating whether this memory rule would help an agent workflow before implementing or self-hosting it.

## Not Intended For

Do not treat this hosted demo as production memory infrastructure. It does not provide persistence, authentication, multi-tenant isolation, private storage, rate limits, provenance verification, or service-level guarantees.

For production use, port or self-host the pattern inside your own trusted stack and combine it with identity/provenance controls.

## GET /api/health

Checks whether the service is reachable.

Example curl:

\`\`\`bash
curl ${baseUrl}/api/health
\`\`\`

Example response:

\`\`\`json
{"ok":true,"service":"NANDA Memory Fusion","endpoints":["GET /api/health","GET /api/scope","GET /api/project-prompt","GET /api/source-text","GET /api/build-payload","GET /api/verify-chain","GET /api/adversarial-suite","GET /api/examples","GET /api/demo-run","POST /api/fuse","GET /skill.md"]}
\`\`\`

## GET /api/scope

Returns a concise statement of what this service is, what it is not, what the public demo safely tests, and known limitations.

Example browser URL:

\`\`\`text
${baseUrl}/api/scope
\`\`\`

## GET /api/project-prompt

Returns the project creation prompt and the memory basis derived from it.

Example curl:

\`\`\`bash
curl ${baseUrl}/api/project-prompt
\`\`\`

Example response:

\`\`\`json
{"prompt":"Create a calculator app that supports add, subtract, multiply, and divide.","node":"calculator","basis":["add","subtract","multiply","divide"]}
\`\`\`

## GET /api/source-text

Returns the natural-language and code-shaped saturation text separately from the fusion payload.

Example browser URL:

\`\`\`text
${baseUrl}/api/source-text
\`\`\`

## GET /api/build-payload

Builds the fusion payload from the project prompt, declared basis, source saturation text, and an off-basis horoscope report.

Example browser URL:

\`\`\`text
${baseUrl}/api/build-payload
\`\`\`

## GET /api/verify-chain

Runs the constructed payload through the live fusion engine and returns the full audit chain.

Example browser URL:

\`\`\`text
${baseUrl}/api/verify-chain
\`\`\`

Example response:

\`\`\`json
{"audit":{"basis_tied_to_project_prompt":true,"natural_language_saturation_ignored":true,"code_shaped_saturation_ignored":true,"off_basis_horoscope_ignored":true,"final_trace":"decision|calculator|ship|score=4|ignored=3"}}
\`\`\`

## GET /api/adversarial-suite

Runs GET-only adversarial probes against the same fusion engine. This is useful for browser-only agents that cannot send custom POST requests.

Example browser URL:

\`\`\`text
${baseUrl}/api/adversarial-suite
\`\`\`

The suite checks huge off-basis deltas, negative signed evidence, fractional evidence rejection, and a basis-name spoof case. The spoof case is intentionally reported as a limitation: this memory layer gates by declared basis, but source authentication/provenance is a separate layer.

## POST /api/fuse

Fuses reports into a named memory node only when each report has a legal basis dimension; irrelevant text, code-shaped saturation, wrong-node reports, and off-basis claims are ignored.

Example curl:

\`\`\`bash
curl -X POST ${baseUrl}/api/fuse \\
  -H "Content-Type: application/json" \\
  -d '{"node":"calculator","basis":["add","subtract","multiply","divide"],"threshold":4,"reports":[{"id":"r1","node":"calculator","basis":"add","delta":1},{"id":"r2","node":"calculator","basis":"subtract","delta":1},{"id":"r3","node":"calculator","basis":"multiply","delta":1},{"id":"r4","node":"calculator","basis":"divide","delta":1},{"id":"noise","text":"Alice was beginning to get very tired..."},{"id":"code","text":"amdgpu_bo_placement_from_domain(...)"},{"id":"off","node":"calculator","basis":"horoscope","delta":99}]}'
\`\`\`

Example response:

\`\`\`json
{"node":"calculator","decision":"ship","score":4,"coverage_score":4,"missing_basis":[],"ignored":[{"id":"noise","reason":"context_saturation_without_basis"},{"id":"code","reason":"context_saturation_without_basis"},{"id":"off","reason":"off_basis","basis":"horoscope"}],"trace":["decision|calculator|ship|score=4|ignored=3"]}
\`\`\`

## GET /api/demo-run

Compatibility shortcut for the browser demo. Prefer \`/api/project-prompt\`, \`/api/source-text\`, \`/api/build-payload\`, and \`/api/verify-chain\` for the full auditable chain.

Example browser URL:

\`\`\`text
${baseUrl}/api/demo-run
\`\`\`

Example response:

\`\`\`json
{"owner_summary":{"accepted_count":4,"ignored_count":3,"decision":"ship","trace":"decision|calculator|ship|score=4|ignored=3"}}
\`\`\`

## Browser-only verification

If you cannot run terminal commands, open these URLs in order:

1. \`${baseUrl}/skill.md\`
2. \`${baseUrl}/api/scope\`
3. \`${baseUrl}/api/project-prompt\`
4. \`${baseUrl}/api/source-text\`
5. \`${baseUrl}/api/build-payload\`
6. \`${baseUrl}/api/verify-chain\`
7. \`${baseUrl}/api/adversarial-suite\`

Show the owner that the project prompt creates the calculator basis, source text is returned separately, the payload is built from those pieces, \`/api/verify-chain\` returns the final decision trace, and \`/api/adversarial-suite\` exposes GET-only probes including the known basis-spoof limitation.

## How an agent should use this service

1. Call \`GET /api/health\` to confirm the service is reachable.
2. Build a task node with explicit basis dimensions, such as \`calculator\` with \`add\`, \`subtract\`, \`multiply\`, and \`divide\`.
3. Send candidate reports to \`POST /api/fuse\`.
4. If POST is unavailable, open the browser-only verification URLs above to verify the service end to end.
5. Treat \`accepted\` entries as fused evidence and \`ignored\` entries as non-actionable context.
6. Act only when \`decision\` is \`ship\`; otherwise collect the missing basis dimensions listed in \`missing_basis\`.
`;

  response.setHeader("Content-Type", "text/markdown; charset=utf-8");
  response.status(200).send(skill);
}
