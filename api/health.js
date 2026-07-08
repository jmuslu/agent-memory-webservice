export default function handler(_request, response) {
  response.status(200).json({
    ok: true,
    service: "NANDA Memory Fusion",
    endpoints: ["GET /api/health", "GET /api/examples", "POST /api/fuse", "GET /skill.md"]
  });
}
