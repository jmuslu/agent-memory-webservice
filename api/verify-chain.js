import { verifyChain } from "./chain.js";

export default function handler(_request, response) {
  response.status(200).json(verifyChain());
}
