import http from "node:http";
import examplesHandler from "./api/examples.js";
import demoRunHandler from "./api/demo-run.js";
import fuseHandler from "./api/fuse.js";
import healthHandler from "./api/health.js";
import buildPayloadHandler from "./api/build-payload.js";
import adversarialSuiteHandler from "./api/adversarial-suite.js";
import projectPromptHandler from "./api/project-prompt.js";
import skillHandler from "./api/skill.js";
import sourceTextHandler from "./api/source-text.js";
import verifyChainHandler from "./api/verify-chain.js";

const port = Number(process.env.PORT ?? 3000);

function createResponse(serverResponse) {
  return {
    setHeader(name, value) {
      serverResponse.setHeader(name, value);
    },
    status(code) {
      serverResponse.statusCode = code;
      return this;
    },
    json(body) {
      serverResponse.setHeader("Content-Type", "application/json; charset=utf-8");
      serverResponse.end(JSON.stringify(body));
    },
    send(body) {
      serverResponse.end(body);
    }
  };
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : undefined;
}

const server = http.createServer(async (request, serverResponse) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const response = createResponse(serverResponse);

  try {
    request.body = await readBody(request);

    if (url.pathname === "/api/health") {
      healthHandler(request, response);
    } else if (url.pathname === "/api/project-prompt") {
      projectPromptHandler(request, response);
    } else if (url.pathname === "/api/source-text") {
      sourceTextHandler(request, response);
    } else if (url.pathname === "/api/build-payload") {
      buildPayloadHandler(request, response);
    } else if (url.pathname === "/api/verify-chain") {
      verifyChainHandler(request, response);
    } else if (url.pathname === "/api/adversarial-suite") {
      adversarialSuiteHandler(request, response);
    } else if (url.pathname === "/api/examples") {
      examplesHandler(request, response);
    } else if (url.pathname === "/api/demo-run") {
      demoRunHandler(request, response);
    } else if (url.pathname === "/api/fuse") {
      fuseHandler(request, response);
    } else if (url.pathname === "/skill.md") {
      skillHandler(request, response);
    } else if (url.pathname === "/") {
      serverResponse.statusCode = 302;
      serverResponse.setHeader("Location", "/skill.md");
      serverResponse.end();
    } else {
      response.status(404).json({ error: "not_found" });
    }
  } catch (error) {
    response.status(400).json({ error: "bad_request", detail: error.message });
  }
});

server.listen(port, () => {
  console.log(`NANDA Memory Fusion local server listening on http://localhost:${port}`);
});
