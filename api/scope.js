export default function handler(_request, response) {
  response.status(200).json({
    service: "NANDA Memory Fusion",
    kind: "stateless verification demo",
    is_not: [
      "long-term conversation memory store",
      "user-data database",
      "production persistence layer",
      "identity/provenance/authentication layer"
    ],
    public_demo_safety: {
      accounts_required: false,
      api_keys_required: false,
      private_user_data_required: false,
      browser_only_get_verification_available: true
    },
    what_it_tests: [
      "project prompt to declared basis",
      "separate source saturation text",
      "payload construction from project and sources",
      "basis-gated report fusion",
      "PN-Counter signed evidence handling",
      "natural-language/code-shaped/off-basis rejection"
    ],
    deployment_pattern_example: {
      role: "basis-gated fusion before or inside durable memory workflows",
      possible_locations: [
        "external pre-write gate",
        "internal LLM wiki workflow",
        "agent memory pipeline",
        "local library inside a trusted stack"
      ],
      example_architecture: [
        "agent researches the web",
        "agent extracts candidate reports",
        "agent submits reports to the fusion gate",
        "only basis-valid evidence passes",
        "accepted evidence is written to durable memory, a wiki, or a vector database"
      ],
      why_stateless:
        "The hosted demo shows the fusion rule without claiming to be the memory database itself."
    },
    known_limitations: [
      "basis-name spoofing is accepted by this basis-only layer",
      "source authentication belongs to a separate provenance/authentication layer",
      "public demo data is synthetic/fixed for reproducible browser-only verification"
    ],
    recommended_browser_test_order: [
      "/skill.md",
      "/api/scope",
      "/api/project-prompt",
      "/api/source-text",
      "/api/build-payload",
      "/api/verify-chain",
      "/api/adversarial-suite"
    ]
  });
}
