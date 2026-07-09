import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPayload, projectPrompt, runAdversarialSuite, sourceText, verifyChain } from "../api/chain.js";

test("builds payload from project prompt and separate source text", () => {
  const payload = buildPayload();

  assert.equal(payload.project.id, projectPrompt.id);
  assert.equal(payload.node, "calculator");
  assert.deepEqual(payload.basis, ["add", "subtract", "multiply", "divide"]);
  assert.equal(payload.basis_derivation.node_from_prompt, "calculator app");
  assert.ok(payload.reports.some((report) => report.source_id === sourceText.natural_language.id));
  assert.ok(payload.reports.some((report) => report.source_id === sourceText.code_shaped.id));
  assert.ok(payload.reports.some((report) => report.basis === "horoscope"));
});

test("adversarial suite exposes GET-only probes and basis-spoof limitation", () => {
  const suite = runAdversarialSuite();
  const casesById = Object.fromEntries(suite.cases.map((testCase) => [testCase.id, testCase]));

  assert.equal(casesById["huge-off-basis-delta"].audit.huge_off_basis_ignored, true);
  assert.equal(casesById["huge-off-basis-delta"].result.decision, "wait");
  assert.equal(casesById["fractional-valid-evidence"].audit.fractional_rejected, true);
  assert.equal(casesById["basis-name-spoof"].expected_limitation, true);
  assert.equal(casesById["basis-name-spoof"].audit.spoofed_valid_basis_accepted, true);
});

test("verify chain proves basis fusion and saturation rejection", () => {
  const verification = verifyChain();

  assert.deepEqual(verification.chain, [
    "project_prompt",
    "declared_memory_basis",
    "source_saturation_text",
    "constructed_fusion_payload",
    "live_fusion_result",
    "accepted_ignored_reports",
    "final_decision_trace"
  ]);
  assert.equal(verification.audit.basis_tied_to_project_prompt, true);
  assert.equal(verification.audit.payload_built_from_project_prompt, true);
  assert.equal(verification.audit.natural_language_source_inserted, true);
  assert.equal(verification.audit.code_source_inserted, true);
  assert.equal(verification.audit.valid_project_reports_fused, true);
  assert.equal(verification.audit.natural_language_saturation_ignored, true);
  assert.equal(verification.audit.code_shaped_saturation_ignored, true);
  assert.equal(verification.audit.off_basis_horoscope_ignored, true);
  assert.equal(verification.audit.final_decision, "ship");
  assert.equal(verification.audit.final_trace, "decision|calculator|ship|score=4|ignored=3");
});
