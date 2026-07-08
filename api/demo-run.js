import { verifyChain } from "./chain.js";

export default function handler(_request, response) {
  const verification = verifyChain();
  const result = verification.fusion_result;

  response.status(200).json({
    proof: "The service loaded its project prompt and source saturation text, built a payload, ran basis fusion, and returned the decision.",
    payload: verification.constructed_payload,
    result,
    audit: verification.audit,
    owner_summary: {
      accepted_count: result.accepted.length,
      ignored_count: result.ignored.length,
      decision: result.decision,
      trace: result.trace.at(-1)
    }
  });
}
