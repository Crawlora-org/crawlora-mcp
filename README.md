# Crawlora MCP

[![Website](https://img.shields.io/badge/website-crawlora.net-2563eb)](https://crawlora.net/mcp)
[![Docs](https://img.shields.io/badge/docs-crawlora.net%2Fdocs-555)](https://crawlora.net/docs)
[![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP-7c3aed)](https://modelcontextprotocol.io)
[![smithery badge](https://smithery.ai/badge/crawlora/crawlora)](https://smithery.ai/servers/crawlora/crawlora)
[![crawlora-mcp MCP server](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp/badges/score.svg)](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp)

**Crawlora MCP** is a **hosted** Model Context Protocol server that gives AI clients and
agents **439 structured public‑web‑data tools** across 30+ categories — search, maps,
e‑commerce, social, finance, travel, app stores, media, and reviews — each returning clean,
normalized **JSON** instead of HTML to parse.

> **Two ways to use it:** connect any MCP client to the **hosted** endpoint
> (`https://mcp.crawlora.net/mcp`), or run the small **open‑source local server** in this repo
> (`npx` / Docker, stdio) — both expose the same tools and authenticate with your Crawlora API
> key. Start free with **2,000 credits/month** (no card) at **[crawlora.net](https://crawlora.net)**.

## Connection

| | |
|---|---|
| **Endpoint** | `https://mcp.crawlora.net/mcp` |
| **Transport** | Streamable HTTP |
| **Auth** | `Authorization: Bearer <CRAWLORA_API_KEY>` (preferred) — `x-api-key: <key>` also accepted |
| **Get a key** | https://crawlora.net (free 2,000 credits/mo) |
| **Server card** | https://crawlora.net/.well-known/mcp/server-card.json |

A missing or invalid API key returns `401`.

## Quick start

### Generic `mcp.json` (Claude Desktop, Cursor, and most clients)

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

### Codex CLI

```bash
codex mcp add crawlora \
  --url https://mcp.crawlora.net/mcp \
  --bearer-token-env-var CRAWLORA_API_KEY
```

### VS Code (`.vscode/mcp.json`)

```json
{
  "servers": {
    "crawlora": {
      "type": "http",
      "url": "https://mcp.crawlora.net/mcp",
      "headers": { "Authorization": "Bearer ${env:CRAWLORA_API_KEY}" }
    }
  }
}
```

More ready‑to‑paste configs are in [`examples/`](examples/). For Cline, see
[`llms-install.md`](llms-install.md).

## Run it locally (open‑source server)

This repo also ships a small **stdio** MCP server (`index.mjs`) that exposes the same **439
tools**, each wrapping the Crawlora REST API (`https://api.crawlora.net/api/v1`) with your
`CRAWLORA_API_KEY`. Useful if you'd rather run the server yourself than use the hosted endpoint.

```bash
# Node 20+ (no install)
CRAWLORA_API_KEY=your-key npx -y crawlora-mcp

# or from a clone
npm install && CRAWLORA_API_KEY=your-key node index.mjs

# or Docker
docker build -t crawlora-mcp . && docker run -i -e CRAWLORA_API_KEY=your-key crawlora-mcp
```

Client config (stdio):

```json
{
  "mcpServers": {
    "crawlora": {
      "command": "npx",
      "args": ["-y", "crawlora-mcp"],
      "env": { "CRAWLORA_API_KEY": "your-key" }
    }
  }
}
```

The tool definitions in [`tools.json`](tools.json) are generated from Crawlora's published API
catalog; each carries its real input schema and maps to a single REST endpoint.

## What you can call (439 tools / 30+ categories)

| Category | Tools | Examples |
|---|---|---|
| **Finance & crypto** | 82 | Yahoo Finance, Google Finance, CoinGecko, Polymarket — quotes, financials, screeners, markets, trending, coins, prediction markets |
| **Media & entertainment** | 64 | Spotify, Spotify Podcasts, Apple Podcasts, JustWatch — tracks, artists, charts, episodes, where‑to‑watch |
| **Social & video** | 47 | YouTube, TikTok, Instagram, Reddit, LinkedIn — search, profiles, posts, comments, transcripts, trends |
| **E‑commerce** | 36 | Amazon, eBay, Shopify, Shop.app — product, search, sellers, collections, reviews |
| **Search & web** | 26 | Google, Bing, Brave, Google Trends — SERPs, suggestions, news, videos, images, interest‑over‑time |
| **App stores** | 20 | App Store, Google Play — app details, reviews, rankings, similar apps |
| **Reviews & companies** | 18 | Trustpilot, Product Hunt — business reviews, launches, makers, leaderboards |
| **Travel & real estate** | 13 | Airbnb, TripAdvisor, Zillow — listings, calendars, hotels, property data |
| **Data & utility** | 14 | Datasets, SimilarWeb, usage — curated datasets, website intelligence, account usage |
| **Maps & places** | 5 | Google Maps, Geocoding — place search, details, forward/reverse geocoding |

Full, always‑current tool list with parameters, response examples, and a live Playground:
**https://crawlora.net/docs**.

## Why Crawlora

- **Normalized JSON per tool** — ship data features, not scraper infrastructure.
- **No proxies, browsers, or parsers** to maintain.
- **Pay on success** — credit‑based, billed only on `2xx` responses.
- **One key, 439 tools** — search, commerce, social, finance, and more behind a single MCP endpoint.

A good alternative to stitching together SerpApi, Firecrawl, ScraperAPI, or ScrapingBee.

## Links

- Website: https://crawlora.net/mcp
- Docs & Playground: https://crawlora.net/docs · https://crawlora.net/playground
- Pricing: https://crawlora.net/pricing
- Server card: https://crawlora.net/.well-known/mcp/server-card.json
- Official MCP registry manifest: [`server.json`](server.json)

## License

See [`LICENSE`](LICENSE). The Crawlora MCP service itself is a hosted SaaS governed by the
[Crawlora terms](https://crawlora.net); this repository contains connection docs and manifests.
