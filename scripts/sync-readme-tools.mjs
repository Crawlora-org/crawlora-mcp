#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

export const START_MARKER = "<!-- BEGIN MCP.SO TOOLS: generated from tools.json; do not edit manually -->";
export const END_MARKER = "<!-- END MCP.SO TOOLS -->";

function cleanDescription(description) {
  return String(description ?? "").replace(/\s+/g, " ").replace(/`/g, "'").trim();
}

export function renderToolsSection(tools) {
  if (!Array.isArray(tools) || tools.length === 0) throw new Error("tools.json is empty or not an array");
  const entries = tools.flatMap((tool) => {
    if (!tool?.name) throw new Error("tools.json contains a tool without a name");
    const description = cleanDescription(tool.description);
    return description ? [`### \`${tool.name}\``, "", description, ""] : [`### \`${tool.name}\``, ""];
  });
  return [
    "## Tools",
    "",
    "The complete tool catalog is generated from [`tools.json`](./tools.json) so MCP directories can index it.",
    "",
    START_MARKER,
    ...entries,
    END_MARKER,
  ].join("\n");
}

export function replaceToolsSection(readme, tools) {
  const section = renderToolsSection(tools);
  const start = readme.indexOf("## Tools");
  const nextHeading = start >= 0 ? readme.indexOf("\n## ", start + 1) : -1;
  if (start >= 0 && nextHeading >= 0) {
    return `${readme.slice(0, start)}${section}\n${readme.slice(nextHeading)}`;
  }
  const insertionPoint = readme.indexOf("\n## What you can call");
  if (insertionPoint < 0) throw new Error("README is missing the What you can call heading");
  return `${readme.slice(0, insertionPoint + 1)}${section}\n\n${readme.slice(insertionPoint + 1)}`;
}

async function main() {
  const check = process.argv.includes("--check");
  const [readme, tools] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../tools.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const next = replaceToolsSection(readme, tools);
  if (readme === next) {
    console.log(`README MCP.so tools are synchronized: ${tools.length} tools`);
    return;
  }
  if (check) throw new Error(`README MCP.so tools are stale; run npm run sync:readme-tools (${tools.length} tools expected)`);
  await writeFile(new URL("../README.md", import.meta.url), next);
  console.log(`Synchronized README MCP.so tools: ${tools.length} tools`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
