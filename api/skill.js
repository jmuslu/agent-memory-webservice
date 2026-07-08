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
{"ok":true,"service":"NANDA Memory Fusion","endpoints":["GET /api/health","GET /api/examples","POST /api/fuse","GET /skill.md"]}
\`\`\`

## GET /api/examples

Returns a ready-to-use calculator memory fusion request.

Example curl:

\`\`\`bash
curl ${baseUrl}/api/examples
\`\`\`

Example response:

\`\`\`json
{"examples":{"calculator":{"node":"calculator","basis":["add","subtract","multiply","divide"],"threshold":4,"reports":[{"id":"r1","node":"calculator","basis":"add","delta":1}]}}}
\`\`\`

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

## How an agent should use this service

1. Call \`GET /api/health\` to confirm the service is reachable.
2. Build a task node with explicit basis dimensions, such as \`calculator\` with \`add\`, \`subtract\`, \`multiply\`, and \`divide\`.
3. Send candidate reports to \`POST /api/fuse\`.
4. Treat \`accepted\` entries as fused evidence and \`ignored\` entries as non-actionable context.
5. Act only when \`decision\` is \`ship\`; otherwise collect the missing basis dimensions listed in \`missing_basis\`.
`;

  response.setHeader("Content-Type", "text/markdown; charset=utf-8");
  response.status(200).send(skill);
}
