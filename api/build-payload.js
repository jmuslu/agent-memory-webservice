import { buildPayload } from "./chain.js";

export default function handler(_request, response) {
  response.status(200).json({
    proof: "Payload built from the project prompt basis and separate source saturation text.",
    payload: buildPayload()
  });
}
