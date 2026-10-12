import test from "node:test";
import assert from "node:assert/strict";

import { groupTools, renderToolsCatalog, replaceToolsSection, renderToolsSection } from "./sync-readme-tools.mjs";

const tools = [
  { name: "alpha_search", description: "First `tool`\nwith whitespace.", _http: { path: "/alpha/search" } },
  { name: "alpha_item", description: "Second tool.", _http: { path: "/alpha/item/{id}" } },
  { name: "beta", description: "Third tool." },
];

test("groups tools by the first REST path segment, falling back to the name", () => {
  assert.deepEqual(groupTools(tools), [
    ["alpha", ["alpha_search", "alpha_item"]],
    ["beta", ["beta"]],
  ]);
});

test("renders a compact README index that points at the full catalog", () => {
  const section = renderToolsSection(tools);
  assert.match(section, /^## Tools/m);
  assert.match(section, /All 3 tools by platform/);
  assert.match(section, /\[`TOOLS\.md`\]\(\.\/TOOLS\.md\)/);
  assert.match(section, /^- \*\*alpha\*\* \(2\): `alpha_search`, `alpha_item`$/m);
  assert.doesNotMatch(section, /First 'tool'/);
});

test("renders the full catalog with one heading and description per tool", () => {
  const catalog = renderToolsCatalog(tools);
  assert.match(catalog, /^# Crawlora MCP tool catalog/);
  assert.match(catalog, /### `alpha_search`\n\nFirst 'tool' with whitespace\./);
  assert.match(catalog, /### `beta`\n\nThird tool\./);
});

test("rejects an empty or malformed tool list", () => {
  assert.throws(() => renderToolsSection([]), /empty/);
  assert.throws(() => renderToolsCatalog([{ description: "x" }]), /without a name/);
});

test("replaces an existing generated section idempotently", () => {
  const readme = "# Example\n\n## Tools\n\nold\n\n## Next\n\nbody\n";
  const updated = replaceToolsSection(readme, tools);
  assert.match(updated, /<!-- BEGIN MCP\.SO TOOLS:/);
  assert.match(updated, /## Next\n\nbody/);
  assert.equal(replaceToolsSection(updated, tools), updated);
});

test("replaces a trailing generated section idempotently", () => {
  const readme = "# Example\n\n## Links\n\nbody\n\n## Tools\n\nold\n";
  const updated = replaceToolsSection(readme, tools);
  assert.match(updated, /## Links\n\nbody\n\n## Tools\n/);
  assert.ok(updated.endsWith("<!-- END MCP.SO TOOLS -->\n"));
  assert.equal(replaceToolsSection(updated, tools), updated);
});

test("appends the section when the README has none", () => {
  const updated = replaceToolsSection("# Example\n\n## Links\n\nbody\n", tools);
  assert.match(updated, /body\n\n## Tools\n/);
  assert.equal(replaceToolsSection(updated, tools), updated);
});
