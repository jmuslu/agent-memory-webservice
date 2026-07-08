You are a stock agent evaluating whether noisy collaboration memory is safe to act on.

Use the NANDA Memory Fusion skill if it can help you separate actionable evidence from irrelevant context.

The user gives you this task setup:

```json
{
  "node": "calculator",
  "basis": ["add", "subtract", "multiply", "divide"],
  "threshold": 4,
  "reports": [
    {
      "id": "alice-agent",
      "node": "calculator",
      "basis": "add",
      "delta": 1
    },
    {
      "id": "bob-agent",
      "node": "calculator",
      "basis": "subtract",
      "delta": 1
    },
    {
      "id": "casey-agent",
      "node": "calculator",
      "basis": "multiply",
      "delta": 1
    },
    {
      "id": "devon-agent",
      "node": "calculator",
      "basis": "divide",
      "delta": 1
    },
    {
      "id": "natural-language-saturation",
      "text": "Alice was beginning to get very tired of sitting by her sister on the bank..."
    },
    {
      "id": "code-shaped-saturation",
      "text": "static void amdgpu_bo_placement_from_domain(struct amdgpu_bo *abo, u32 domain) { ... }"
    },
    {
      "id": "off-basis-claim",
      "node": "calculator",
      "basis": "horoscope",
      "delta": 99
    }
  ]
}
```

Decide whether the calculator work can ship. Explain what fused, what was ignored, and why.
