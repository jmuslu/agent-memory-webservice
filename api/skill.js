function baseUrlFromRequest(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host || "localhost:3000";
  const protocol = request.headers["x-forwarded-proto"] || (String(host).includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export default function handler(request, response) {
  const baseUrl = baseUrlFromRequest(request);
  const skill = `# NANDA Memory Fusion

NANDA Memory Fusion is a small service that lets agents submit noisy reports and receive basis-gated, PN-Counter-style memory decisions.

${baseUrl}

## GET /api/health

Checks whether the service is reachable.

Example curl:

\`\`\`bash
curl ${baseUrl}/api/health
\`\`\`

Example response:

\`\`\`json
{"ok":true,"service":"NANDA Memory Fusion","endpoints":["GET /api/health","GET /api/project-prompt","GET /api/source-text","GET /api/build-payload","GET /api/verify-chain","GET /api/adversarial-suite","GET /api/examples","GET /api/demo-run","POST /api/fuse","GET /skill.md"]}
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
2. \`${baseUrl}/api/project-prompt\`
3. \`${baseUrl}/api/source-text\`
4. \`${baseUrl}/api/build-payload\`
5. \`${baseUrl}/api/verify-chain\`
6. \`${baseUrl}/api/adversarial-suite\`

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
