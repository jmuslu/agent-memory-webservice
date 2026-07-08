const calculatorExample = {
  node: "calculator",
  basis: ["add", "subtract", "multiply", "divide"],
  threshold: 4,
  reports: [
    { id: "r1", node: "calculator", basis: "add", delta: 1 },
    { id: "r2", node: "calculator", basis: "subtract", op: "inc", amount: 1 },
    { id: "r3", node: "calculator", basis: "multiply", delta: 1 },
    { id: "r4", node: "calculator", basis: "divide", delta: 1 },
    {
      id: "noise-alice",
      text: "Alice was beginning to get very tired of sitting by her sister on the bank..."
    },
    {
      id: "noise-code",
      text: "static void amdgpu_bo_placement_from_domain(struct amdgpu_bo *abo, u32 domain) { ... }"
    },
    { id: "off-basis", node: "calculator", basis: "horoscope", delta: 99 }
  ]
};

export default function handler(_request, response) {
  response.status(200).json({
    examples: {
      calculator: calculatorExample
    }
  });
}

export { calculatorExample };
