# Installing Crawlora MCP (for AI assistants, e.g. Cline)

This guide is written for an AI coding assistant configuring the **Crawlora MCP** server on
behalf of a user. Crawlora MCP is a **remote/hosted** server — there is **no package to
install, build, or run locally**. "Installation" means adding a remote MCP server entry to
the client's configuration and supplying the user's API key.

## Prerequisites

1. The user needs a **Crawlora API key**. If they don't have one, direct them to
   **https://crawlora.net** — sign up is free and includes 2,000 credits/month (no card).
   The key is created in the Crawlora console.
2. Do **not** hard‑code the key in the repo or in shared config. Store it as the
   environment variable `CRAWLORA_API_KEY`, or in the client's secret/credential store.

## Configuration

Add this remote server to the client's MCP settings (`cline_mcp_settings.json` for Cline, or
the equivalent `mcp.json` for other clients):

```json
{
  "mcpServers": {
    "crawlora": {
      "url": "https://mcp.crawlora.net/mcp",
      "transport": "streamable-http",
      "headers": { "Authorization": "Bearer ${CRAWLORA_API_KEY}" }
    }
  }
}
```

Connection details:

| Setting | Value |
|---|---|
| Endpoint / URL | `https://mcp.crawlora.net/mcp` |
| Transport | Streamable HTTP |
| Auth header (preferred) | `Authorization: Bearer <CRAWLORA_API_KEY>` |
| Auth header (alternate) | `x-api-key: <CRAWLORA_API_KEY>` |

If the client cannot interpolate `${CRAWLORA_API_KEY}`, substitute the literal key value
into the `Authorization` header at configuration time, keeping it out of version control.

## Verify

1. Reload/restart the MCP client so it connects to the server.
2. Confirm the `crawlora` server appears as **connected** and exposes tools (e.g.
   `google_search`, `amazon_product`, `yahoo_finance_ticker_quote`).
3. Run a low‑cost call, e.g. a `google_suggest` or `geocoding_search`, and confirm a JSON
   result is returned. A `401` means the API key is missing or invalid — recheck the header.

## Notes

- Tool calls consume Crawlora credits according to per‑endpoint billing; calls are billed
  only on successful (`2xx`) responses.
- The authoritative, always‑current tool list and parameters live at
  **https://crawlora.net/docs**. The machine‑readable server card is at
  **https://crawlora.net/.well-known/mcp/server-card.json**.
