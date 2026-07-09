import { fuseMemory } from "./fuse.js";

const projectPrompt = {
  id: "calculator-project-v1",
  title: "Calculator app project",
  prompt:
    "Create a calculator app that supports add, subtract, multiply, and divide. Ship only after evidence covers every required operation.",
  node: "calculator",
  basis: ["add", "subtract", "multiply", "divide"],
  threshold: 4,
  derivation: {
    node_from_prompt: "calculator app",
    basis_from_prompt: {
      add: "supports add",
      subtract: "supports subtract",
      multiply: "supports multiply",
      divide: "supports divide"
    }
  }
};

const sourceText = {
  natural_language: {
    id: "alice-gutenberg-excerpt",
    label: "Project Gutenberg Alice excerpt",
    source_url: "https://www.gutenberg.org/cache/epub/11/pg11.txt",
    license_note: "Project Gutenberg public-domain text in the United States",
    text: "Alice was beginning to get very tired of sitting by her sister on the bank..."
  },
  code_shaped: {
    id: "amdgpu-object-excerpt",
    label: "AMDGPU driver shaped code excerpt",
    source_url: "https://github.com/torvalds/linux/blob/master/drivers/gpu/drm/amd/amdgpu/amdgpu_object.c",
    license_note: "Short attribution-bearing code-shaped excerpt used as adversarial saturation text",
    text: "static void amdgpu_bo_placement_from_domain(struct amdgpu_bo *abo, u32 domain) { ... }"
  }
};

function buildPayload() {
  return {
    project: {
      id: projectPrompt.id,
      prompt: projectPrompt.prompt
    },
    node: projectPrompt.node,
    basis: [...projectPrompt.basis],
    threshold: projectPrompt.threshold,
    basis_derivation: projectPrompt.derivation,
    reports: [
      { id: "project-evidence-add", node: projectPrompt.node, basis: "add", delta: 1 },
      { id: "project-evidence-subtract", node: projectPrompt.node, basis: "subtract", delta: 1 },
      { id: "project-evidence-multiply", node: projectPrompt.node, basis: "multiply", delta: 1 },
      { id: "project-evidence-divide", node: projectPrompt.node, basis: "divide", delta: 1 },
      {
        id: "saturation-natural-language",
        source_id: sourceText.natural_language.id,
        text: sourceText.natural_language.text
      },
      {
        id: "saturation-code-shaped",
        source_id: sourceText.code_shaped.id,
        text: sourceText.code_shaped.text
      },
      { id: "off-basis-horoscope", node: projectPrompt.node, basis: "horoscope", delta: 99 }
    ]
  };
}

function verifyChain() {
  const payload = buildPayload();
  const result = fuseMemory(payload);
  const acceptedIds = new Set(result.accepted.map((item) => item.id));
  const ignoredById = Object.fromEntries(result.ignored.map((item) => [item.id, item]));

  return {
    chain: [
      "project_prompt",
      "declared_memory_basis",
      "source_saturation_text",
      "constructed_fusion_payload",
      "live_fusion_result",
      "accepted_ignored_reports",
      "final_decision_trace"
    ],
    project_prompt: projectPrompt,
    source_text: sourceText,
    constructed_payload: payload,
    fusion_result: result,
    audit: {
      project_prompt_returned_separately: true,
      basis_tied_to_project_prompt: payload.node === projectPrompt.node && projectPrompt.basis.every((basis) => payload.basis.includes(basis)),
      source_text_returned_separately: true,
      payload_built_from_project_prompt:
        payload.project.id === projectPrompt.id &&
        payload.basis_derivation.node_from_prompt === projectPrompt.derivation.node_from_prompt,
      natural_language_source_inserted:
        payload.reports.some((report) => report.source_id === sourceText.natural_language.id && report.text === sourceText.natural_language.text),
      code_source_inserted:
        payload.reports.some((report) => report.source_id === sourceText.code_shaped.id && report.text === sourceText.code_shaped.text),
      valid_project_reports_fused: projectPrompt.basis.every((basis) => acceptedIds.has(`project-evidence-${basis}`)),
      natural_language_saturation_ignored:
        ignoredById["saturation-natural-language"]?.reason === "context_saturation_without_basis",
      code_shaped_saturation_ignored:
        ignoredById["saturation-code-shaped"]?.reason === "context_saturation_without_basis",
      off_basis_horoscope_ignored: ignoredById["off-basis-horoscope"]?.reason === "off_basis",
      final_decision: result.decision,
      final_trace: result.trace.at(-1)
    }
  };
}

function runAdversarialSuite() {
  const basePayload = buildPayload();
  const cases = [
    {
      id: "canonical-chain",
      claim: "valid project evidence fuses while saturation and off-basis claims are ignored",
      payload: basePayload
    },
    {
      id: "huge-off-basis-delta",
      claim: "a huge off-basis delta cannot force a ship decision",
      payload: {
        ...basePayload,
        reports: [
          { id: "project-evidence-add", node: projectPrompt.node, basis: "add", delta: 1 },
          { id: "huge-horoscope", node: projectPrompt.node, basis: "horoscope", delta: 1000000 }
        ]
      }
    },
    {
      id: "negative-valid-evidence",
      claim: "negative signed evidence is preserved instead of discarded",
      payload: {
        ...basePayload,
        reports: [
          { id: "project-evidence-add", node: projectPrompt.node, basis: "add", delta: 1 },
          { id: "project-evidence-subtract", node: projectPrompt.node, basis: "subtract", delta: -1 },
          { id: "project-evidence-multiply", node: projectPrompt.node, basis: "multiply", delta: 1 },
          { id: "project-evidence-divide", node: projectPrompt.node, basis: "divide", delta: 1 }
        ]
      }
    },
    {
      id: "fractional-valid-evidence",
      claim: "fractional evidence is rejected to preserve integer-coordinate PN-Counter semantics",
      payload: {
        ...basePayload,
        reports: [{ id: "fractional-add", node: projectPrompt.node, basis: "add", delta: 1.5 }]
      }
    },
    {
      id: "basis-name-spoof",
      claim:
        "a report that spoofs a valid basis name is accepted by this basis-only layer; provenance/authentication is a separate layer",
      payload: {
        ...basePayload,
        reports: [{ id: "spoofed-add", node: projectPrompt.node, basis: "add", delta: 1, source_id: "unknown-attacker" }]
      },
      expected_limitation: true
    }
  ];

  return {
    suite: "browser-get-adversarial-memory-fusion",
    note:
      "These cases are runnable by GET-only/browser-only agents. They test basis gating and PN-Counter behavior, not cryptographic source authentication.",
    cases: cases.map((testCase) => {
      const result = fuseMemory(testCase.payload);
      const ignoredById = Object.fromEntries(result.ignored.map((item) => [item.id, item]));
      return {
        id: testCase.id,
        claim: testCase.claim,
        expected_limitation: Boolean(testCase.expected_limitation),
        payload: testCase.payload,
        result,
        audit: {
          decision: result.decision,
          score: result.score,
          accepted_ids: result.accepted.map((item) => item.id),
          ignored_ids: result.ignored.map((item) => item.id),
          final_trace: result.trace.at(-1),
          huge_off_basis_ignored: ignoredById["huge-horoscope"]?.reason === "off_basis",
          fractional_rejected: ignoredById["fractional-add"]?.reason === "invalid_delta",
          spoofed_valid_basis_accepted: result.accepted.some((item) => item.id === "spoofed-add")
        }
      };
    })
  };
}

export { buildPayload, projectPrompt, runAdversarialSuite, sourceText, verifyChain };
