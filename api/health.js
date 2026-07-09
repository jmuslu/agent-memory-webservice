export default function handler(_request, response) {
  response.status(200).json({
    ok: true,
    service: "NANDA Memory Fusion",
    endpoints: [
      "GET /api/health",
      "GET /api/scope",
      "GET /api/project-prompt",
      "GET /api/source-text",
      "GET /api/build-payload",
      "GET /api/verify-chain",
      "GET /api/adversarial-suite",
      "GET /api/examples",
      "GET /api/demo-run",
      "POST /api/fuse",
      "GET /skill.md"
    ]
  });
}
