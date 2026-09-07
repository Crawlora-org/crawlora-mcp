#!/usr/bin/env node

import { appendFile, readFile } from "node:fs/promises";
import {
  additionalDirectoryLines,
  expectedFacts,
  fetchDirectoryPage,
  verifyDirectories,
} from "./verify-directory-drift.mjs";

const RETRIES = 12;
const RETRY_DELAY_MS = 5_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "user-agent": "crawlora-mcp-publication-check",
          ...(options.headers ?? {}),
        },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < RETRIES) await sleep(RETRY_DELAY_MS);
  }
  throw lastError ?? new Error("request failed");
}

async function verifyNpm(packageJSON) {
  const metadata = await fetchWithRetry(
    `https://registry.npmjs.org/${encodeURIComponent(packageJSON.name)}`,
  ).then((response) => response.json());
  const published = metadata.versions?.[packageJSON.version];
  if (!published) {
    throw new Error(`${packageJSON.name}@${packageJSON.version} is missing from npm`);
  }
  if (metadata["dist-tags"]?.latest !== packageJSON.version) {
    throw new Error(
      `npm latest is ${metadata["dist-tags"]?.latest ?? "missing"}, expected ${packageJSON.version}`,
    );
  }
  if (published.name !== packageJSON.name || published.version !== packageJSON.version) {
    throw new Error("npm metadata does not match the release package");
  }
  return `${packageJSON.name}@${packageJSON.version}`;
}

async function verifyPublished() {
  const [packageJSON, serverJSON, tools] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../server.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../tools.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const expected = expectedFacts({ packageJSON, serverJSON, tools });
  const checks = [];

  checks.push({ name: "npm", detail: await verifyNpm(packageJSON) });

  const directories = await verifyDirectories({ expected, fetchImpl: fetchDirectoryPage });
  for (const result of directories.results) {
    checks.push({
      name: result.name,
      detail: result.detail,
      ok: result.ok,
    });
  }

  const failures = [...directories.failures];
  const lines = checks.map(
    (check) => `- ${check.ok === false ? "FAIL" : "PASS"} **${check.name}**: ${check.detail}`,
  );
  for (const line of lines) console.log(line.replaceAll("**", ""));
  const additionalLines = additionalDirectoryLines(expected);
  console.log("Additional directory refreshes:");
  for (const line of additionalLines) console.log(line.replaceAll("**", ""));
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `### Publication verification (${expected.version})\n\n${lines.join("\n")}\n\n` +
        `### Additional directory refreshes\n\n${additionalLines.join("\n")}\n`,
    );
  }
  if (failures.length > 0) {
    throw new Error(
      `Publication verification failed:\n- ${failures.join("\n- ")}\n\n` +
        "The release is not complete until every listed surface reports the current release.",
    );
  }
  console.log(`Publication verification passed for ${expected.version}/${expected.toolCount} tools`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyPublished().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

export { verifyNpm, verifyPublished };
