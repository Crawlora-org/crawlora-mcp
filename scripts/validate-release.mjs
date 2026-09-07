#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { expectedFacts } from "./verify-directory-drift.mjs";
import { replaceToolsSection } from "./sync-readme-tools.mjs";

export function validateReleaseTag({ version, ref = process.env.GITHUB_REF }) {
  if (ref?.startsWith("refs/tags/") && ref !== `refs/tags/v${version}`) {
    throw new Error(`Git tag ${ref.replace("refs/tags/", "")} does not match package version v${version}`);
  }
}

export async function validateRelease() {
  const [packageJSON, serverJSON, tools, readme] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../server.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../tools.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  const expected = expectedFacts({ packageJSON, serverJSON, tools });
  validateReleaseTag({ version: expected.version });
  const markers = [
    `${expected.toolCount} structured public`,
    `${expected.toolCount} tools`,
    `${expected.groupCount} platform groups`,
  ];
  const missing = markers.filter((marker) => !readme.includes(marker));
  if (missing.length > 0) {
    throw new Error(`README is stale; missing: ${missing.join(", ")}`);
  }
  if (replaceToolsSection(readme, tools) !== readme) {
    throw new Error(`README MCP.so tools are stale; run npm run sync:readme-tools (${tools.length} tools expected)`);
  }

  console.log(
    `Release metadata valid: ${expected.version}, ${expected.toolCount} tools, ${expected.groupCount} platform groups`,
  );
  return expected;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateRelease().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
