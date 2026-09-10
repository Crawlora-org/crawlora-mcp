#!/usr/bin/env node

import { appendFile, readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const DIRECTORIES = [
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
    // Glama is refreshed from its signed-in admin UI and may lag a release.
    // Keep the observation visible without blocking unrelated CI health.
    blocking: false,
    check: (body, expected) => {
      if (!body.includes(`${expected.toolCount} structured`)) {
        throw new Error(`page does not contain ${expected.toolCount} structured tools`);
      }
      if (!body.includes(`${expected.groupCount} platform groups`)) {
        throw new Error(`page does not contain ${expected.groupCount} platform groups`);
      }
      return `${expected.toolCount} tools`;
    },
  },
  {
    name: "Smithery",
    url: "https://smithery.ai/servers/crawlora/crawlora",
    check: (body, expected) => {
      const marker = `${expected.toolCount} structured web-data tools across ${expected.groupCount} platform groups`;
      if (!body.includes(marker)) {
        throw new Error(`page description does not contain ${marker}`);
      }
      return `${expected.toolCount} tools`;
    },
  },
  {
    name: "MCP.so",
    url: "https://mcp.so/servers/crawlora-mcp",
    // The canonical page is intermittently bot-protected from hosted runners,
    // and its listing is maintained through the MCP.so editor.
    blocking: false,
    check: (body, expected) => {
      const overviewMarker = `${expected.toolCount} structured public`;
      const groupMarker = `${expected.groupCount} platform groups`;
      if (!body.includes(overviewMarker) || !body.includes(groupMarker)) {
        throw new Error(`page overview does not contain ${overviewMarker} and ${groupMarker}`);
      }
      if (body.includes("No tools detected")) {
        throw new Error("README tool catalog is empty on the public page");
      }
      if (!body.includes(expected.sampleToolName)) {
        throw new Error(`public Tools section does not contain ${expected.sampleToolName}`);
      }
      return `${expected.toolCount} tools in overview and Tools section`;
    },
  },
];

// These directories either require a signed-in maintainer workflow or currently
// do not expose a stable public listing endpoint. Keep them visible in every
// release summary without treating an external access limitation as a false
// automated pass/fail result.
export const ADDITIONAL_DIRECTORY_SURFACES = [
  {
    name: "MCP Servers.org",
    url: "https://mcpservers.org/servers/crawlora-net-mcp",
    status: "update-requested",
    checkedOn: "2026-09-07",
    detail: "Update request submitted; wait for the listing maintainer to refresh the page.",
  },
  {
    name: "GoodFirms",
    url: "https://www.goodfirms.co/software/crawlora",
    status: "stale-account-update-required",
    checkedOn: "2026-09-07",
    detail: "The claimed listing still showed 549 hosted MCP tools; update it to the current release facts from the signed-in vendor account.",
  },
  {
    name: "StackShare",
    url: "https://stackshare.io/?q=crawlora",
    status: "listing-not-found",
    checkedOn: "2026-09-07",
    detail: "No Crawlora listing was found; creating a new listing requires an explicit maintainer decision and account access.",
  },
  {
    name: "PulseMCP",
    url: "https://www.pulsemcp.com/",
    status: "submissions-paused",
    checkedOn: "2026-09-07",
    detail: "PulseMCP reports that new server submissions and listing changes are paused; retry after the directory reopens.",
  },
];

export function additionalDirectoryLines(expected) {
  const target = `${expected.toolCount} tools / ${expected.groupCount} platform groups`;
  return ADDITIONAL_DIRECTORY_SURFACES.map(
    (surface) =>
      `- **${surface.name}** [${surface.status}; checked ${surface.checkedOn}]: ${surface.detail} Target: ${target}. [Open listing](${surface.url})`,
  );
}

function fail(message) {
  throw new Error(message);
}

export async function fetchDirectoryPage(url, { headers = {} } = {}) {
  const args = [
    "--fail-with-body",
    "--silent",
    "--show-error",
    "--ipv4",
    "--retry",
    "2",
    "--retry-all-errors",
    "--connect-timeout",
    "10",
    "--max-time",
    "30",
    "--user-agent",
    headers["user-agent"] ?? "crawlora-mcp-directory-check",
    url,
  ];
  const { stdout } = await execFileAsync("curl", args, {
    maxBuffer: 64 * 1024 * 1024,
  });
  return new Response(stdout, { status: 200 });
}

export function expectedFacts({ packageJSON, serverJSON, tools }) {
  if (packageJSON.name !== "crawlora-mcp") fail(`unexpected package name ${packageJSON.name}`);
  if (serverJSON.name !== "net.crawlora/crawlora-mcp") fail(`unexpected server name ${serverJSON.name}`);
  if (packageJSON.version !== serverJSON.version) fail("package.json and server.json versions differ");
  if (!Array.isArray(tools) || tools.length === 0) fail("tools.json is empty or not an array");
  const groupCount = new Set(tools.map((tool) => tool?._http?.group).filter(Boolean)).size;
  if (groupCount === 0) fail("tools.json has no platform groups");
  if (!packageJSON.description?.includes(String(tools.length))) {
    fail(`package.json description does not contain ${tools.length} tools`);
  }
  if (!serverJSON.description?.includes(String(tools.length))) {
    fail(`server.json description does not contain ${tools.length} tools`);
  }
  if (!serverJSON.description?.includes(`${groupCount} platform groups`)) {
    fail(`server.json description does not contain ${groupCount} platform groups`);
  }
  return {
    version: packageJSON.version,
    toolCount: tools.length,
    groupCount,
    sampleToolName: tools[0].name,
  };
}

export async function verifyDirectories({ fetchImpl = fetch, directories = DIRECTORIES, expected }) {
  const results = await Promise.all(
    directories.map(async (directory) => {
      try {
        let response;
        let lastError;
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          try {
            response = await fetchImpl(directory.url, {
              headers: { "user-agent": "crawlora-mcp-directory-check" },
              signal: AbortSignal.timeout(15_000),
            });
            if (response.ok) break;
            lastError = new Error(`HTTP ${response.status}`);
          } catch (error) {
            lastError = error;
          }
          if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        }
        if (!response?.ok) throw lastError ?? new Error("request failed");
        const detail = directory.check(await response.text(), expected);
        return { ...directory, detail, ok: true, blocking: directory.blocking !== false };
      } catch (error) {
        return {
          ...directory,
          detail: error.message,
          ok: false,
          blocking: directory.blocking !== false,
        };
      }
    }),
  );
  const failures = results
    .filter((result) => !result.ok && result.blocking)
    .map((result) => `${result.name}: ${result.detail}`);
  const warnings = results
    .filter((result) => !result.ok && !result.blocking)
    .map((result) => `${result.name}: ${result.detail}`);
  return { results, failures, warnings };
}

async function main() {
  const [packageJSON, serverJSON, tools] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../server.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../tools.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const expected = expectedFacts({ packageJSON, serverJSON, tools });
  const { results, failures, warnings } = await verifyDirectories({ expected, fetchImpl: fetchDirectoryPage });
  const summary = [];
  for (const result of results) {
    const status = result.ok ? "PASS" : result.blocking ? "FAIL" : "WARN";
    console.log(`${status} ${result.name}: ${result.detail}`);
    summary.push(`- ${status} **${result.name}**: ${result.detail}`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `### MCP directory verification\n\n${summary.join("\n")}\n\n` +
        `### Additional directory refreshes\n\n${additionalDirectoryLines(expected).join("\n")}\n`,
    );
  }
  if (failures.length > 0) {
    fail(
      `MCP directory drift detected:\n- ${failures.join("\n- ")}\n\n` +
        "Refresh the affected public listing, then rerun the directory-drift workflow.",
    );
  }
  console.log(
    `MCP directory check passed: ${results.length - warnings.length} directories match ${expected.version}/${expected.toolCount} tools` +
      (warnings.length > 0 ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""),
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
