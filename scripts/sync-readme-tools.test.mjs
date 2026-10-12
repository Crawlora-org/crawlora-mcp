import test from "node:test";
import assert from "node:assert/strict";

import { replaceToolsSection, renderToolsSection } from "./sync-readme-tools.mjs";

const tools = [
  { name: "alpha", description: "First `tool`\nwith whitespace." },
  { name: "beta", description: "Second tool." },
];

test("renders an MCP.so-compatible tool list", () => {
  const section = renderToolsSection(tools);
  assert.match(section, /^## Tools/m);
  assert.match(section, /### `alpha`\n\nFirst 'tool' with whitespace\./);
  assert.match(section, /### `beta`\n\nSecond tool\./);
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
