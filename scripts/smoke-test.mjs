// Smoke test: spawn the stdio server and assert it lists its tools cleanly.
// No API key needed — tools/list is served from the embedded tools.json.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const transport = new StdioClientTransport({ command: "node", args: [join(root, "index.mjs")] });
const client = new Client({ name: "smoke-test", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);
const { tools } = await client.listTools();
await client.close();

const malformed = tools.filter((t) => !t.name || !t.description || t.inputSchema?.type !== "object");
if (tools.length < 300 || malformed.length > 0) {
  console.error(`FAIL: ${tools.length} tools listed, ${malformed.length} malformed`);
  process.exit(1);
}
console.log(`OK: ${tools.length} tools listed, 0 malformed (${tools[0].name} … ${tools[tools.length - 1].name})`);
