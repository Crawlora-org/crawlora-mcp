#!/usr/bin/env node
// Crawlora MCP — local stdio MCP server.
// Exposes 467 structured web-data tools, each wrapping the Crawlora REST API
// (https://api.crawlora.net/api/v1) with your CRAWLORA_API_KEY. Get a free key
// (2,000 credits/month, no card) at https://crawlora.net.
//
// tools.json is generated from Crawlora's published API catalog; each tool
// carries its real input schema and maps to a single REST endpoint.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOOLS = JSON.parse(readFileSync(join(HERE, "tools.json"), "utf8"));
const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

const API_BASE = (process.env.CRAWLORA_API_BASE || "https://api.crawlora.net/api/v1").replace(/\/+$/, "");
const API_KEY = process.env.CRAWLORA_API_KEY || "";

const server = new Server(
  { name: "crawlora-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = BY_NAME.get(req.params.name);
  if (!tool) {
    return { isError: true, content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }] };
  }
  if (!API_KEY) {
    return {
      isError: true,
      content: [{ type: "text", text: "Missing CRAWLORA_API_KEY. Get a free key (2,000 credits/mo, no card) at https://crawlora.net." }],
    };
  }

  const args = req.params.arguments || {};
  const { method, path, query, body } = tool._http;

  let url = API_BASE + path.replace(/\{([^}]+)\}/g, (_, k) => encodeURIComponent(String(args[k] ?? "")));
  const qs = new URLSearchParams();
  for (const q of query) {
    const v = args[q];
    if (v !== undefined && v !== null && v !== "") qs.append(q, String(v));
  }
  const qstr = qs.toString();
  if (qstr) url += (url.includes("?") ? "&" : "?") + qstr;

  const headers = { "x-api-key": API_KEY, accept: "application/json" };
  let payload;
  if (body && args[body] !== undefined) {
    headers["content-type"] = "application/json";
    payload = JSON.stringify(args[body]);
  }

  try {
    const res = await fetch(url, { method, headers, body: payload });
    const text = await res.text();
    if (!res.ok) {
      return { isError: true, content: [{ type: "text", text: `HTTP ${res.status} ${res.statusText}\n${text}` }] };
    }
    return { content: [{ type: "text", text }] };
  } catch (e) {
    return { isError: true, content: [{ type: "text", text: `Request failed: ${e?.message || e}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`crawlora-mcp ready — ${TOOLS.length} tools (REST base ${API_BASE})`);
