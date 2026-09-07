#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const DIRECTORIES = [
  {
    name: "Official MCP Registry",
    url: "https://registry.modelcontextprotocol.io/v0/servers?search=net.crawlora%2Fcrawlora-mcp",
    check: (body, expected) => {
      const payload = JSON.parse(body);
      const latest = (payload.servers ?? []).find(
        (entry) => entry._meta?.["io.modelcontextprotocol.registry/official"]?.isLatest,
      );
      if (!latest) throw new Error("no latest active registry entry");
      if (latest.server?.version !== expected.version) {
        throw new Error(`latest version is ${latest.server?.version ?? "missing"}, expected ${expected.version}`);
      }
      if (!latest.server?.description?.includes(String(expected.toolCount))) {
        throw new Error(`description does not contain ${expected.toolCount} tools`);
      }
      return `${latest.server.version}, ${expected.toolCount} tools`;
    },
  },
  {
    name: "Glama",
    url: "https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp",
    check: (body, expected) => {
      if (!body.includes(`${expected.toolCount} structured`)) {
        throw new Error(`page does not contain ${expected.toolCount} structured tools`);
      }
      return `${expected.toolCount} tools`;
    },
  },
  {
    name: "Smithery",
    url: "https://smithery.ai/servers/crawlora/crawlora",
    check: (body, expected) => {
      if (!body.includes(`${expected.toolCount} structured`)) {
        throw new Error(`page does not contain ${expected.toolCount} structured tools`);
      }
      return `${expected.toolCount} tools`;
    },
  },
  {
    name: "MCP.so",
    url: "https://mcp.so/servers/crawlora-mcp",
    check: (body, expected) => {
      if (!body.includes(`${expected.toolCount} structured`)) {
        throw new Error(`page does not contain ${expected.toolCount} structured tools`);
      }
      return `${expected.toolCount} tools`;
    },
  },
];

function fail(message) {
  throw new Error(message);
}

export function expectedFacts({ packageJSON, serverJSON, tools }) {
  if (packageJSON.name !== "crawlora-mcp") fail(`unexpected package name ${packageJSON.name}`);
  if (serverJSON.name !== "net.crawlora/crawlora-mcp") fail(`unexpected server name ${serverJSON.name}`);
  if (packageJSON.version !== serverJSON.version) fail("package.json and server.json versions differ");
  if (!Array.isArray(tools) || tools.length === 0) fail("tools.json is empty or not an array");
  return { version: packageJSON.version, toolCount: tools.length };
}

export async function verifyDirectories({ fetchImpl = fetch, directories = DIRECTORIES, expected }) {
  const results = [];
  const failures = [];
  for (const directory of directories) {
    try {
      const response = await fetchImpl(directory.url, {
        headers: { "user-agent": "crawlora-mcp-directory-check" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const detail = directory.check(await response.text(), expected);
      results.push({ ...directory, detail, ok: true });
    } catch (error) {
      const message = `${directory.name}: ${error.message}`;
      failures.push(message);
      results.push({ ...directory, detail: error.message, ok: false });
    }
  }
  return { results, failures };
}

async function main() {
  const [packageJSON, serverJSON, tools] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../server.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../tools.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const expected = expectedFacts({ packageJSON, serverJSON, tools });
  const { results, failures } = await verifyDirectories({ expected });
  for (const result of results) {
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.detail}`);
  }
  if (failures.length > 0) {
    fail(`MCP directory drift detected:\n- ${failures.join("\n- ")}`);
  }
  console.log(`MCP directory check passed: ${results.length} directories match ${expected.version}/${expected.toolCount} tools`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
