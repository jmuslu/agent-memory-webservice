const baseUrl = (process.argv[2] ?? "https://agent-memory-webservice.vercel.app").replace(/\/$/, "");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.json();
}

async function getText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.text();
}

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

function printSection(title) {
  console.log("");
  console.log(`== ${title} ==`);
}

function printList(label, items, formatter) {
  console.log(label);
  for (const item of items) {
    console.log(`  - ${formatter(item)}`);
  }
}

async function main() {
  printSection("Fresh agent discovers the service");
  console.log(`Base URL: ${baseUrl}`);
  const health = await getJson("/api/health");
  console.log(`Health: ${health.ok ? "reachable" : "not reachable"}`);
  await sleep(350);

  printSection("Agent reads SKILL.md");
  const skill = await getText("/skill.md");
  const skillLines = skill.split(/\r?\n/).slice(0, 15).join("\n");
  console.log(skillLines);
  await sleep(350);

  printSection("Agent requests an example task");
  const examples = await getJson("/api/examples");
  const payload = examples.examples.calculator;
  console.log(`Task node: ${payload.node}`);
  console.log(`Declared basis: ${payload.basis.join(", ")}`);
  console.log(`Reports received: ${payload.reports.length}`);
  await sleep(350);

  printSection("Agent asks memory service to fuse noisy reports");
  const result = await postJson("/api/fuse", payload);

  printList("Accepted evidence:", result.accepted, (item) => `${item.id} -> ${item.basis} (${item.delta >= 0 ? "+" : ""}${item.delta})`);
  printList("Ignored context:", result.ignored, (item) => `${item.id} -> ${item.reason}${item.basis ? ` (${item.basis})` : ""}`);
  await sleep(350);

  printSection("Action decision");
  console.log(`PN-Counter value: ${result.pn_counter.value}`);
  console.log(`Coverage: ${result.coverage_score}/${result.basis.length}`);
  console.log(`Missing basis: ${result.missing_basis.length ? result.missing_basis.join(", ") : "none"}`);
  console.log(`Decision: ${result.decision.toUpperCase()}`);
  console.log(`Trace: ${result.trace.at(-1)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
