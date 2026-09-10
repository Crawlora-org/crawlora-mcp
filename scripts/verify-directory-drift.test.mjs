import test from "node:test";
import assert from "node:assert/strict";

import {
  ADDITIONAL_DIRECTORY_SURFACES,
  DIRECTORIES,
  additionalDirectoryLines,
  expectedFacts,
  verifyDirectories,
} from "./verify-directory-drift.mjs";
import { validateReleaseTag } from "./validate-release.mjs";

const expected = expectedFacts({
  packageJSON: {
    name: "crawlora-mcp",
    version: "1.16.2",
    description: "Local MCP server with 2 structured tools",
  },
  serverJSON: {
    name: "net.crawlora/crawlora-mcp",
    version: "1.16.2",
    description: "Hosted MCP: 2 structured web-data tools across 2 platform groups.",
  },
  tools: [
    { name: "one", _http: { group: "One" } },
    { name: "two", _http: { group: "Two" } },
  ],
});

test("derives the release facts from the MCP source files", () => {
  assert.deepEqual(expected, { version: "1.16.2", toolCount: 2, groupCount: 2, sampleToolName: "one" });
});

test("rejects stale package or registry descriptions", () => {
  assert.throws(
    () =>
      expectedFacts({
        packageJSON: {
          name: "crawlora-mcp",
          version: "1.16.2",
          description: "Local MCP server with 1 tool",
        },
        serverJSON: {
          name: "net.crawlora/crawlora-mcp",
          version: "1.16.2",
          description: "Hosted MCP: 2 structured web-data tools across 2 platform groups.",
        },
        tools: [
          { name: "one", _http: { group: "One" } },
          { name: "two", _http: { group: "Two" } },
        ],
      }),
    /package\.json description does not contain 2 tools/,
  );
});

test("fails when a directory serves an older snapshot", async () => {
  const { failures } = await verifyDirectories({
    expected,
    directories: [
      {
        name: "test directory",
        url: "https://example.test/server",
        check: (body, facts) => {
          if (!body.includes(`${facts.toolCount} structured`)) throw new Error("stale tool count");
          return "ok";
        },
      },
    ],
    fetchImpl: async () => new Response("319 structured tools", { status: 200 }),
  });
  assert.deepEqual(failures, ["test directory: stale tool count"]);
});

test("fails when a directory cannot be fetched", async () => {
  const { failures } = await verifyDirectories({
    expected,
    directories: [
      { name: "test directory", url: "https://example.test/server", check: () => "ok" },
    ],
    fetchImpl: async () => new Response("blocked", { status: 403 }),
  });
  assert.deepEqual(failures, ["test directory: HTTP 403"]);
});

test("reports non-blocking directory drift as a warning", async () => {
  const { failures, warnings, results } = await verifyDirectories({
    expected,
    directories: [
      {
        name: "account-managed directory",
        url: "https://example.test/server",
        blocking: false,
        check: (body, facts) => {
          if (!body.includes(`${facts.toolCount} structured`)) throw new Error("stale tool count");
          return "ok";
        },
      },
    ],
    fetchImpl: async () => new Response("319 structured tools", { status: 200 }),
  });
  assert.deepEqual(failures, []);
  assert.deepEqual(warnings, ["account-managed directory: stale tool count"]);
  assert.equal(results[0].blocking, false);
});

test("fails when MCP.so still shows an empty Tools section", () => {
  const mcpSo = DIRECTORIES.find((directory) => directory.name === "MCP.so");
  assert.throws(
    () => mcpSo.check("2 structured public 2 platform groups No tools detected", expected),
    /README tool catalog is empty/,
  );
});

test("tracks additional directory surfaces without making them false automated passes", () => {
  assert.deepEqual(
    ADDITIONAL_DIRECTORY_SURFACES.map((surface) => surface.name),
    ["MCP Servers.org", "GoodFirms", "StackShare", "PulseMCP"],
  );
  const lines = additionalDirectoryLines(expected);
  assert.equal(lines.length, 4);
  assert.ok(lines.every((line) => line.includes("2 tools / 2 platform groups")));
  assert.ok(lines.some((line) => line.includes("submissions-paused")));
});

test("rejects a release tag that does not match package version", () => {
  assert.throws(
    () => validateReleaseTag({ version: "1.16.2", ref: "refs/tags/v1.16.1" }),
    /does not match package version v1\.16\.2/,
  );
  assert.doesNotThrow(() => validateReleaseTag({ version: "1.16.2", ref: "refs/tags/v1.16.2" }));
  assert.doesNotThrow(() => validateReleaseTag({ version: "1.16.2", ref: "refs/heads/main" }));
});
