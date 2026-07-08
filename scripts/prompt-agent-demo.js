import fs from "node:fs/promises";
import path from "node:path";

const defaultBaseUrl = "https://agent-memory-webservice.vercel.app";
const defaultPromptPath = "examples/agent-session-prompt.md";

const baseUrl = (process.argv[2] ?? defaultBaseUrl).replace(/\/$/, "");
const promptPath = process.argv[3] ?? defaultPromptPath;

async function request(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  if (!response.ok) {
    throw new Error(`${pathname} returned ${response.status}: ${await response.text()}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

function extractJsonSetup(prompt) {
  const match = prompt.match(/```json\s*([\s\S]*?)```/i);
  if (!match) {
    throw new Error("Prompt must include a fenced ```json task setup.");
  }
  return JSON.parse(match[1]);
}

function printSection(title) {
  console.log("");
  console.log(`== ${title} ==`);
}

function firstLines(text, count) {
  return text.split(/\r?\n/).slice(0, count).join("\n");
}

function summarizeReports(reports) {
  for (const report of reports) {
    if (report.basis) {
      console.log(`  - ${report.id}: node=${report.node ?? "(default)"} basis=${report.basis} delta=${report.delta ?? report.op ?? 1}`);
    } else {
      console.log(`  - ${report.id}: context payload with no declared basis`);
    }
  }
}

async function main() {
  const absolutePromptPath = path.resolve(promptPath);
  const prompt = await fs.readFile(absolutePromptPath, "utf8");

  printSection("Prompt injected into fresh agent session");
  console.log(firstLines(prompt, 8));

  printSection("Agent discovers tool contract from SKILL.md");
  const skill = await request("/skill.md");
  console.log(firstLines(skill, 13));

  printSection("Agent extracts the user setup");
  const setup = extractJsonSetup(prompt);
  console.log(`Node: ${setup.node}`);
  console.log(`Basis: ${setup.basis.join(", ")}`);
  console.log(`Threshold: ${setup.threshold ?? setup.basis.length}`);
  console.log("Reports:");
  summarizeReports(setup.reports);

  printSection("Agent calls POST /api/fuse");
  const result = await request("/api/fuse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(setup)
  });

  printSection("Agent evaluates result");
  console.log("Accepted evidence:");
  for (const item of result.accepted) {
    console.log(`  - ${item.id}: fused into ${result.node}.${item.basis} (${item.delta >= 0 ? "+" : ""}${item.delta})`);
  }

  console.log("Ignored inputs:");
  for (const item of result.ignored) {
    console.log(`  - ${item.id}: ${item.reason}${item.basis ? ` (${item.basis})` : ""}`);
  }

  printSection("Agent final answer");
  if (result.decision === "ship") {
    console.log("Use this service: yes.");
    console.log("Reason: all declared basis dimensions are covered and the non-fusable inputs stayed non-actionable.");
  } else {
    console.log("Use this service: yes, but do not act yet.");
    console.log(`Reason: missing basis dimensions remain: ${result.missing_basis.join(", ") || "none"}.`);
  }
  console.log(`Decision: ${result.decision.toUpperCase()}`);
  console.log(`Trace: ${result.trace.at(-1)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
