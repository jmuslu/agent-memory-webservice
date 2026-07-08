import assert from "node:assert/strict";
import { test } from "node:test";
import { fuseMemory } from "../api/fuse.js";

test("ships when every basis dimension is covered and saturation is ignored", () => {
  const result = fuseMemory({
    node: "calculator",
    basis: ["add", "subtract", "multiply", "divide"],
    threshold: 4,
    reports: [
      { id: "add", node: "calculator", basis: "add", delta: 1 },
      { id: "subtract", node: "calculator", basis: "subtract", delta: 1 },
      { id: "multiply", node: "calculator", basis: "multiply", delta: 1 },
      { id: "divide", node: "calculator", basis: "divide", delta: 1 },
      { id: "alice", text: "Alice was beginning to get very tired..." },
      { id: "gpu", text: "amdgpu_bo_placement_from_domain(...)" },
      { id: "off", node: "calculator", basis: "horoscope", delta: 99 }
    ]
  });

  assert.equal(result.decision, "ship");
  assert.equal(result.score, 4);
  assert.equal(result.accepted.length, 4);
  assert.equal(result.ignored.length, 3);
  assert.deepEqual(result.missing_basis, []);
});

test("waits when a required basis dimension is missing", () => {
  const result = fuseMemory({
    node: "calculator",
    basis: ["add", "subtract", "multiply", "divide"],
    reports: [
      { id: "add", node: "calculator", basis: "add", delta: 1 },
      { id: "multiply", node: "calculator", basis: "multiply", delta: 1 }
    ]
  });

  assert.equal(result.decision, "wait");
  assert.deepEqual(result.missing_basis, ["subtract", "divide"]);
});

test("rejects fractional deltas", () => {
  const result = fuseMemory({
    node: "calculator",
    basis: ["add"],
    reports: [{ id: "bad", node: "calculator", basis: "add", delta: 1.5 }]
  });

  assert.equal(result.decision, "wait");
  assert.equal(result.accepted.length, 0);
  assert.equal(result.ignored[0].reason, "invalid_delta");
});
