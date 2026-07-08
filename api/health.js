export default function handler(_request, response) {
  response.status(200).json({
    ok: true,
    service: "NANDA Memory Fusion",
    endpoints: ["GET /api/health", "GET /api/examples", "GET /api/demo-run", "POST /api/fuse", "GET /skill.md"]
  });
}
