You are a fresh agent with terminal access. Prove whether the NANDA Memory Fusion service is useful for this setup.

Start only from this public skill file:

```text
https://agent-memory-webservice.vercel.app/skill.md
```

Do not assume the API contract from memory. First fetch/read the skill file, then call the service it describes.

Evaluate this task setup:

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

Show:

1. The command you used to fetch the skill file.
2. The command you used to call the memory fusion endpoint.
3. Which reports fused.
4. Which reports were ignored.
5. Whether the calculator task should ship.
6. The final trace line from the service.
