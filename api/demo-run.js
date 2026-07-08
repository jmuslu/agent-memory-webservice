import { calculatorExample } from "./examples.js";
import { fuseMemory } from "./fuse.js";

export default function handler(_request, response) {
  const result = fuseMemory(calculatorExample);

  response.status(200).json({
    proof: "The service loaded its own example payload, ran basis fusion, and returned the decision.",
    payload: calculatorExample,
    result,
    owner_summary: {
      accepted_count: result.accepted.length,
      ignored_count: result.ignored.length,
      decision: result.decision,
      trace: result.trace.at(-1)
    }
  });
}
