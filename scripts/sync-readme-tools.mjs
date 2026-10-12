#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

export const START_MARKER = "<!-- BEGIN MCP.SO TOOLS: generated from tools.json; do not edit manually -->";
export const END_MARKER = "<!-- END MCP.SO TOOLS -->";

function cleanDescription(description) {
  return String(description ?? "").replace(/\s+/g, " ").replace(/`/g, "'").trim();
}

function requireTools(tools) {
  if (!Array.isArray(tools) || tools.length === 0) throw new Error("tools.json is empty or not an array");
  for (const tool of tools) {
    if (!tool?.name) throw new Error("tools.json contains a tool without a name");
  }
}

// A tool belongs to the platform named by the first segment of its REST path
// ("/amazon/search" -> "amazon"); tools without a path fall back to the name prefix.
function platformOf(tool) {
  const segment = String(tool?._http?.path ?? "").split("/").filter(Boolean)[0];
  return segment || String(tool.name).split("_")[0];
}

export function groupTools(tools) {
  const groups = new Map();
  for (const tool of tools) {
    const platform = platformOf(tool);
    if (!groups.has(platform)) groups.set(platform, []);
    groups.get(platform).push(tool.name);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

// The README carries a compact index only. GitHub stops rendering a README
// into the repository page once it is a few hundred kilobytes, so the
// per-tool descriptions live in TOOLS.md.
export function renderToolsSection(tools) {
  requireTools(tools);
  const lines = groupTools(tools).map(
    ([platform, names]) => `- **${platform}** (${names.length}): ${names.map((name) => `\`${name}\``).join(", ")}`,
  );
  return [
    "## Tools",
    "",
    `All ${tools.length} tools by platform, generated from [\`tools.json\`](./tools.json). [\`TOOLS.md\`](./TOOLS.md) has the description of every tool.`,
    "",
    START_MARKER,
    ...lines,
    END_MARKER,
  ].join("\n");
}

export function renderToolsCatalog(tools) {
  requireTools(tools);
  const entries = tools.flatMap((tool) => {
    const description = cleanDescription(tool.description);
    return description ? [`### \`${tool.name}\``, "", description, ""] : [`### \`${tool.name}\``, ""];
  });
  return [
    "# Crawlora MCP tool catalog",
    "",
    `Every tool the Crawlora MCP server exposes (${tools.length}), generated from [\`tools.json\`](./tools.json); do not edit manually. See the [README](./README.md) for setup and an index by platform.`,
    "",
    "## Tools",
    "",
    ...entries,
  ].join("\n");
}

export function replaceToolsSection(readme, tools) {
  const section = renderToolsSection(tools);
  const start = readme.search(/^## Tools$/m);
  if (start < 0) return `${readme.trimEnd()}\n\n${section}\n`;
  // The catalog is the last README section, so everything a reader needs
  // renders before it. Any section that follows it is kept in place.
  const nextHeading = readme.indexOf("\n## ", start + 1);
  if (nextHeading < 0) return `${readme.slice(0, start)}${section}\n`;
  return `${readme.slice(0, start)}${section}\n${readme.slice(nextHeading)}`;
}

async function main() {
  const check = process.argv.includes("--check");
  const readmeURL = new URL("../README.md", import.meta.url);
  const catalogURL = new URL("../TOOLS.md", import.meta.url);
  const [readme, catalog, tools] = await Promise.all([
    readFile(readmeURL, "utf8"),
    readFile(catalogURL, "utf8").catch(() => ""),
    readFile(new URL("../tools.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const nextReadme = replaceToolsSection(readme, tools);
  const nextCatalog = renderToolsCatalog(tools);
  if (readme === nextReadme && catalog === nextCatalog) {
    console.log(`README MCP.so tools are synchronized: ${tools.length} tools`);
    return;
  }
  if (check) throw new Error(`README MCP.so tools are stale; run npm run sync:readme-tools (${tools.length} tools expected)`);
  await Promise.all([writeFile(readmeURL, nextReadme), writeFile(catalogURL, nextCatalog)]);
  console.log(`Synchronized README MCP.so tools: ${tools.length} tools`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
