function parseInteger(value, fieldName) {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  return value;
}

function deltaFromReport(report) {
  if (Object.prototype.hasOwnProperty.call(report, "delta")) {
    return parseInteger(report.delta, "delta");
  }

  if (report.op === "inc") {
    return parseInteger(report.amount ?? 1, "amount");
  }

  if (report.op === "dec") {
    return -parseInteger(report.amount ?? 1, "amount");
  }

  return 1;
}

function classifyReport(report, index, config) {
  const id = String(report.id ?? `report-${index + 1}`);

  if (!report || typeof report !== "object" || Array.isArray(report)) {
    return { accepted: false, id, reason: "malformed_report" };
  }

  if (typeof report.text === "string" && !report.basis) {
    return { accepted: false, id, reason: "context_saturation_without_basis" };
  }

  if (report.node && report.node !== config.node) {
    return { accepted: false, id, reason: "wrong_node", node: report.node };
  }

  if (typeof report.basis !== "string") {
    return { accepted: false, id, reason: "missing_basis" };
  }

  if (!config.basisSet.has(report.basis)) {
    return { accepted: false, id, reason: "off_basis", basis: report.basis };
  }

  try {
    return {
      accepted: true,
      id,
      basis: report.basis,
      delta: deltaFromReport(report)
    };
  } catch (error) {
    return {
      accepted: false,
      id,
      reason: "invalid_delta",
      detail: error.message
    };
  }
}

function fuseMemory(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("request body must be a JSON object");
  }

  const node = typeof payload.node === "string" && payload.node ? payload.node : "calculator";
  const basis = Array.isArray(payload.basis) ? payload.basis : [];
  const cleanBasis = basis.filter((item) => typeof item === "string" && item.length > 0);

  if (cleanBasis.length === 0) {
    throw new Error("basis must contain at least one string dimension");
  }

  const reports = Array.isArray(payload.reports) ? payload.reports : [];
  const threshold = Number.isInteger(payload.threshold) ? payload.threshold : cleanBasis.length;
  const config = { node, basis: cleanBasis, basisSet: new Set(cleanBasis) };

  const positive = Object.fromEntries(cleanBasis.map((dimension) => [dimension, 0]));
  const negative = Object.fromEntries(cleanBasis.map((dimension) => [dimension, 0]));
  const accepted = [];
  const ignored = [];
  const coveredBasis = new Set();
  const trace = [];

  reports.forEach((report, index) => {
    const result = classifyReport(report, index, config);

    if (!result.accepted) {
      ignored.push(result);
      trace.push(`fusion_ignore|${node}|${result.id}|reason=${result.reason}`);
      return;
    }

    coveredBasis.add(result.basis);
    if (result.delta >= 0) {
      positive[result.basis] += result.delta;
    } else {
      negative[result.basis] += Math.abs(result.delta);
    }
    accepted.push(result);
    trace.push(`fusion_accept|${node}|${result.basis}|delta=${result.delta}`);
  });

  const signedScore =
    Object.values(positive).reduce((total, value) => total + value, 0) -
    Object.values(negative).reduce((total, value) => total + value, 0);
  const coverageScore = coveredBasis.size;
  const missingBasis = cleanBasis.filter((dimension) => !coveredBasis.has(dimension));
  const decision = signedScore >= threshold && missingBasis.length === 0 ? "ship" : "wait";

  trace.push(`pn_delta|${node}|positive=${JSON.stringify(positive)}|negative=${JSON.stringify(negative)}`);
  trace.push(`decision|${node}|${decision}|score=${signedScore}|ignored=${ignored.length}`);

  return {
    node,
    basis: cleanBasis,
    decision,
    threshold,
    score: signedScore,
    coverage_score: coverageScore,
    missing_basis: missingBasis,
    pn_counter: {
      positive,
      negative,
      value: signedScore
    },
    accepted,
    ignored,
    trace
  };
}

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "method_not_allowed", detail: "Use POST /api/fuse" });
    return;
  }

  try {
    response.status(200).json(fuseMemory(request.body));
  } catch (error) {
    response.status(400).json({ error: "bad_request", detail: error.message });
  }
}

export { fuseMemory };
