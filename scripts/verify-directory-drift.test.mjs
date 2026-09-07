import test from "node:test";
import assert from "node:assert/strict";

import { expectedFacts, verifyDirectories } from "./verify-directory-drift.mjs";

const expected = expectedFacts({
  packageJSON: { name: "crawlora-mcp", version: "1.16.2" },
  serverJSON: { name: "net.crawlora/crawlora-mcp", version: "1.16.2" },
  tools: [{ name: "one" }, { name: "two" }],
});

test("derives the release facts from the MCP source files", () => {
  assert.deepEqual(expected, { version: "1.16.2", toolCount: 2 });
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
