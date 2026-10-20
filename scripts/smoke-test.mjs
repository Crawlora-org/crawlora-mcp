// Smoke test: spawn the stdio server and assert it lists its tools cleanly.
// No API key needed — tools/list is served from the embedded tools.json.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageVersion = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;

const transport = new StdioClientTransport({ command: "node", args: [join(root, "index.mjs")] });
const client = new Client({ name: "smoke-test", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);
const { tools } = await client.listTools();
const serverVersion = client.getServerVersion()?.version;
await client.close();

const malformed = tools.filter((t) => !t.name || !t.description || t.inputSchema?.type !== "object");
if (tools.length < 300 || malformed.length > 0 || serverVersion !== packageVersion) {
  console.error(
    `FAIL: ${tools.length} tools listed, ${malformed.length} malformed, ` +
    `server version ${serverVersion ?? "missing"} (expected ${packageVersion})`,
  );
  process.exit(1);
}
console.log(`OK: ${tools.length} tools listed, server ${serverVersion}, 0 malformed (${tools[0].name} … ${tools[tools.length - 1].name})`);
