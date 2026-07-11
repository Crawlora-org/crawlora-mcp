# Crawlora MCP

[![Website](https://img.shields.io/badge/website-crawlora.net-2563eb)](https://crawlora.net/mcp)
[![Docs](https://img.shields.io/badge/docs-crawlora.net%2Fdocs-555)](https://crawlora.net/docs)
[![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP-7c3aed)](https://modelcontextprotocol.io)
[![smithery badge](https://smithery.ai/badge/crawlora/crawlora)](https://smithery.ai/servers/crawlora/crawlora)
[![crawlora-mcp MCP server](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp/badges/score.svg)](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp)

**Crawlora MCP** is a **hosted** Model Context Protocol server that gives AI clients and
agents **571 structured public‑web‑data tools** across 30+ categories — search, maps,
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

## Connect your client

Crawlora MCP works with any MCP‑capable client. Pick yours below — they all point at the same
hosted endpoint (`https://mcp.crawlora.net/mcp`, Streamable HTTP) and authenticate with your
`CRAWLORA_API_KEY`. Prefer keeping the key in an environment variable over pasting it literally,
and never commit it. Ready‑to‑paste files for each client live in [`examples/`](examples/).

### Claude Code (CLI)

```bash
claude mcp add --transport http crawlora https://mcp.crawlora.net/mcp \
  --header "Authorization: Bearer ${CRAWLORA_API_KEY}"
```

Adds at `local` scope by default. Use `--scope user` to make it available in every project, or
`--scope project` to write a shared `.mcp.json`. Confirm with `claude mcp list`.

### Claude Desktop

Settings → Developer → **Edit Config**, then add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "crawlora": {
      "url": "https://mcp.crawlora.net/mcp",
      "transport": "streamable-http",
      "headers": { "Authorization": "Bearer YOUR_CRAWLORA_API_KEY" }
    }
  }
}
```

### Cursor

Project‑local `.cursor/mcp.json` (or `~/.cursor/mcp.json` for all projects):

```json
{
  "mcpServers": {
    "crawlora": {
      "url": "https://mcp.crawlora.net/mcp",
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

### VS Code (GitHub Copilot)

`.vscode/mcp.json` (project) or your user `mcp.json`:

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

### Windsurf

`~/.codeium/windsurf/mcp_config.json` (note the `serverUrl` key):

```json
{
  "mcpServers": {
    "crawlora": {
      "serverUrl": "https://mcp.crawlora.net/mcp",
      "headers": { "Authorization": "Bearer ${env:CRAWLORA_API_KEY}" }
    }
  }
}
```

### Gemini CLI

`~/.gemini/settings.json` (note the `httpUrl` key):

```json
{
  "mcpServers": {
    "crawlora": {
      "httpUrl": "https://mcp.crawlora.net/mcp",
      "headers": { "Authorization": "Bearer YOUR_CRAWLORA_API_KEY" }
    }
  }
}
```

### Cline / Roo Code

Add to `cline_mcp_settings.json` using the generic remote shape — full walkthrough in
[`llms-install.md`](llms-install.md):

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

### Other clients

Any client that speaks **Streamable HTTP** can use the generic config in
[`examples/mcp.json`](examples/mcp.json). **stdio‑only** clients (e.g. Zed) should run the
[local server](#run-it-locally-open-source-server) below and point at its `npx` command.

## Run it locally (open‑source server)

This repo also ships a small **stdio** MCP server (`index.mjs`) that exposes the same **571
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

## What you can call (571 tools / 30+ categories)

| Category | Tools | Examples |
|---|---|---|
| **Finance & crypto** | 152 | Yahoo Finance, Google Finance, SEC EDGAR, CoinGecko, Polymarket, Kalshi, Metaculus — quotes, financials, SEC filings & normalized statements, screeners, markets, trending, coins, prediction markets |
| **Media & entertainment** | 113 | Spotify, Spotify Podcasts, Apple Podcasts, JustWatch, IMDb, Rotten Tomatoes, Box Office Mojo — tracks, artists, charts, episodes, where‑to‑watch, titles, ratings, box office |
| **Social & video** | 54 | YouTube, TikTok, Instagram, Reddit, LinkedIn — search, profiles, posts, comments, transcripts, trends |
| **E‑commerce** | 36 | Amazon, eBay, Shopify, Shop.app — product, search, sellers, collections, reviews |
| **Search & web** | 27 | Google, Bing, Brave, Google Trends, Web Scrape — SERPs, suggestions, news, videos, images, interest‑over‑time, URL‑to‑markdown |
| **App stores** | 29 | App Store, Google Play, Chrome Web Store — app/extension details, reviews, rankings, similar apps, categories |
| **Reviews & companies** | 18 | Trustpilot, Product Hunt — business reviews, launches, makers, leaderboards |
| **Travel & real estate** | 21 | Airbnb, TripAdvisor, Zillow, Redfin — listings, calendars, hotels, property data, estimates, region trends |
| **Data & utility** | 12 | Datasets, SimilarWeb, usage — curated datasets, website intelligence, account usage |
| **Maps & places** | 5 | Google Maps, Geocoding — place search, details, forward/reverse geocoding |
| **Jobs & hiring** | 11 | Greenhouse, Lever, Ashby, Workday, SmartRecruiters — job boards, single postings, hiring signals, cross-provider company search |
| **Gaming** | 12 | Steam — app & package details, reviews & histogram, search, featured, player counts, achievements, news, SteamSpy stats |

Full, always‑current tool list with parameters, response examples, and a live Playground:
**https://crawlora.net/docs**.

## Why Crawlora

- **Normalized JSON per tool** — ship data features, not scraper infrastructure.
- **No proxies, browsers, or parsers** to maintain.
- **Pay on success** — credit‑based, billed only on `2xx` responses.
- **One key, 571 tools** — search, commerce, social, finance, and more behind a single MCP endpoint.

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
