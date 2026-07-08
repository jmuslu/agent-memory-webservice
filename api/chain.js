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

export { buildPayload, projectPrompt, sourceText, verifyChain };
