# Crawlora MCP

[![Website](https://img.shields.io/badge/website-crawlora.net-2563eb)](https://crawlora.net/mcp?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp)
[![Docs](https://img.shields.io/badge/docs-crawlora.net%2Fdocs-555)](https://crawlora.net/docs?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp)
[![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP-7c3aed)](https://modelcontextprotocol.io)
[![smithery badge](https://smithery.ai/badge/crawlora/crawlora)](https://smithery.ai/servers/crawlora/crawlora)
[![crawlora-mcp MCP server](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp/badges/score.svg)](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp)

**Crawlora MCP** is a **hosted** Model Context Protocol server that gives AI clients and
agents **3665 structured public‑web‑data tools** across 472 platform groups — search, maps,
e‑commerce, social, finance, travel, app stores, media, and reviews — each returning clean,
normalized **JSON** instead of HTML to parse.

> **Two ways to use it:** connect any MCP client to the **hosted** endpoint
> (`https://mcp.crawlora.net/mcp`), or run the small **open‑source local server** in this repo
> (`npx` / Docker, stdio) — both expose the same tools and authenticate with your Crawlora API
> key. Start free with **2,000 credits/month** (no card) at **[crawlora.net](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp)**.

## Connection

| | |
|---|---|
| **Endpoint** | `https://mcp.crawlora.net/mcp` |
| **Transport** | Streamable HTTP |
| **Auth** | `Authorization: Bearer <CRAWLORA_API_KEY>` (preferred) — `x-api-key: <key>` also accepted |
| **Get a key** | [https://crawlora.net](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp) (free 2,000 credits/mo) |
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

This repo also ships a small **stdio** MCP server (`index.mjs`) that exposes the same **3665
tools**, each wrapping the Crawlora REST API (`https://api.crawlora.net/api/v1`) with your
`CRAWLORA_API_KEY`. Useful if you'd rather run the server yourself than use the hosted endpoint.

The counts above describe this repository’s current source catalog. The npm
package used by `npx crawlora-mcp` may contain the previous catalog until a tagged
release is published. To use this source snapshot, clone the repository and
follow the local setup instructions below.

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

## Hosted MCP (recommended)

Just paste the URL into your client settings. No Node.js required.

```text
https://mcp.crawlora.net/mcp
```

Header:
`x-api-key`: `<your-api-key>`

Get a key at [crawlora.net](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp).
Every account includes **2,000 free credits / month** with no credit card required.

---

## What you can call (3665 tools / 472 platform groups)

See [`tools.json`](./tools.json) or your MCP client UI for exact schemas, the [index of every tool by platform](#tools) at the end of this README, and [`TOOLS.md`](./TOOLS.md) for each tool's description. Below is an overview by category:

| Category | Highlights |
|---|---|
| **Search & Web** | `google_search`, `google_news`, `bing_search`, `duckduckgo_search`, `baidu_search`, `brave_search`, `startpage_search`, `yandex_search`, `kagi_search`, `web_scrape`, `web_parse`, `bbb_search`, `bbb_search_filters` |
| **Maps & Places** | `google_maps_search`, `google_maps_place`, `google_maps_reviews`, `google_maps_photos`, `bbb_regions`, `bbb_local_bbbs`, `bbb_local_bbb` |
| **Marketplace & Products** | `amazon_search`, `amazon_product`, `amazon_reviews`, `walmart_search`, `ebay_search`, `etsy_search`, `shopify_store`, `target_search`, `doordash_store`, `doordash_feed`, `ubereats_store`, `reverb_search`, `reverb_listing`, `reverb_price_guide` |
| **Social & Profiles** | `twitter_user`, `twitter_tweet`, `instagram_user`, `reddit_post`, `reddit_comments`, `threads_user`, `tiktok_user`, `tiktok_creative_center_filters`, `tiktok_creative_center_hashtags`, `tiktok_creative_center_top_content`, `tiktok_creative_center_videos` |
| **Finance & Markets** | `google_finance_search`, `google_finance_quote`, `yahoo_finance_quote`, `polymarket_events`, `kalshi_markets` |
| **Research & Papers** | `research_search_papers`, `research_inspect_paper`, `research_read_paper`, `research_related_papers`, `research_sources` |
| **Travel & Lodging** | `airbnb_search`, `airbnb_room`, `tripadvisor_search`, `booking_search` |
| **Jobs & Companies** | `linkedin_jobs`, `indeed_jobs`, `glassdoor_company`, `pitchbook_company` |
| **Media & Audio** | `youtube_video`, `youtube_transcript`, `spotify_artist`, `apple_podcasts_show`, `bbb_news`, `bbb_news_topics`, `bbb_article` |
| **App Stores** | `appstore_app`, `googleplay_app` |
| **Reviews & Q&A** | `trustpilot_reviews`, `g2_reviews`, `capterra_product`, `goodreads_book`, `bbb_business`, `bbb_page`, `bbb_category`, `bbb_business_complaints`, `bbb_business_more_info`, `bbb_business_reviews`, `bbb_scamtracker_search`, `bbb_scamtracker_detail`, `bbb_scamtracker_state_stats` |

---

## Why Crawlora MCP?

- **One key, 3665 tools** — search, commerce, social, gaming, finance, and more behind a single MCP endpoint.
- **Structured JSON, not HTML** — every tool returns normalized fields, so an agent can use the result without writing a parser.
- **Hosted or local** — connect to the hosted Streamable HTTP endpoint with no install, or run the open-source stdio server from this repo with `npx` or Docker.
- **Free to start** — 2,000 credits per month with no credit card.

A good alternative to stitching together SerpApi, Firecrawl, ScraperAPI, or ScrapingBee.

## Links

- Website: [https://crawlora.net/mcp](https://crawlora.net/mcp?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp)
- Docs & Playground: [https://crawlora.net/docs](https://crawlora.net/docs?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp) · [https://crawlora.net/playground](https://crawlora.net/playground?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp)
- Pricing: [https://crawlora.net/pricing](https://crawlora.net/pricing?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp)
- Server card: https://crawlora.net/.well-known/mcp/server-card.json
- Official MCP registry manifest: [`server.json`](server.json)

## License

See [`LICENSE`](LICENSE). The Crawlora MCP service itself is a hosted SaaS governed by the
[Crawlora terms](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-mcp); this repository contains connection docs and manifests.

## Tools

All 3665 tools by platform, generated from [`tools.json`](./tools.json). [`TOOLS.md`](./TOOLS.md) has the description of every tool.

<!-- BEGIN MCP.SO TOOLS: generated from tools.json; do not edit manually -->
- **1stdibs** (4): `firstdibs_categories`, `firstdibs_designers`, `firstdibs_product`, `firstdibs_search`
- **7now** (13): `sevennow_catalog`, `sevennow_categories`, `sevennow_category`, `sevennow_combo`, `sevennow_combos`, `sevennow_deals`, `sevennow_offers`, `sevennow_popular`, `sevennow_product`, `sevennow_promotion`, `sevennow_search`, `sevennow_stores`, `sevennow_suggest`
- **abcau** (5): `abcau_article`, `abcau_author`, `abcau_headlines`, `abcau_news`, `abcau_sections`
- **abcnews** (5): `abcnews_article`, `abcnews_author`, `abcnews_headlines`, `abcnews_news`, `abcnews_sections`
- **accor** (8): `accor_amenities`, `accor_brands`, `accor_catalog_hotels`, `accor_destination_hotels`, `accor_property`, `accor_search`, `accor_search_details`, `accor_search_suggest`
- **adidas** (7): `adidas_product`, `adidas_product_review_topics`, `adidas_product_reviews`, `adidas_search`, `adidas_store`, `adidas_stores`, `adidas_suggest`
- **agoda** (8): `agoda_activities_search`, `agoda_activity_detail`, `agoda_flights_itinerary_amenities`, `agoda_flights_search`, `agoda_flights_search_locations`, `agoda_homes_search`, `agoda_hotel_detail`, `agoda_hotels_search`
- **airbnb** (7): `airbnb_host`, `airbnb_host_listings`, `airbnb_host_reviews`, `airbnb_room`, `airbnb_room_calendar`, `airbnb_room_reviews`, `airbnb_search`
- **alcom** (3): `alcom_headlines`, `alcom_news`, `alcom_sections`
- **aliexpress** (3): `aliexpress_reviews`, `aliexpress_search`, `aliexpress_search_filters`
- **aljazeera** (5): `aljazeera_article`, `aljazeera_author`, `aljazeera_categories`, `aljazeera_headlines`, `aljazeera_topic`
- **allbirds** (11): `allbirds_collection_products`, `allbirds_collections`, `allbirds_page`, `allbirds_pages`, `allbirds_product`, `allbirds_product_recommendations`, `allbirds_products`, `allbirds_search_suggest`, `allbirds_sitemap_urls`, `allbirds_sitemaps`, `allbirds_store`
- **alt** (9): `alt_asset`, `alt_auctions`, `alt_card_search`, `alt_categories`, `alt_listing`, `alt_market_trends`, `alt_search`, `alt_sold_listings`, `alt_top_movers`
- **amazon** (5): `amazon_charts`, `amazon_charts_categories`, `amazon_product`, `amazon_search`, `amazon_suggest`
- **amazon-jobs** (3): `amazon_jobs_categories`, `amazon_jobs_job`, `amazon_jobs_search`
- **androidauthority** (4): `androidauthority_article`, `androidauthority_headlines`, `androidauthority_news`, `androidauthority_sections`
- **androidpolice** (5): `androidpolice_article`, `androidpolice_author`, `androidpolice_headlines`, `androidpolice_news`, `androidpolice_sections`
- **anime** (9): `anime_airing_schedule`, `anime_character`, `anime_character_search`, `anime_rankings`, `anime_search`, `anime_title`, `anime_title_characters`, `anime_title_recommendations`, `anime_title_staff`
- **apk-teardown** (6): `apk_teardown_compare_ownership`, `apk_teardown_delete_job`, `apk_teardown_diff`, `apk_teardown_job_status`, `apk_teardown_submit`, `apk_teardown_timeline`
- **apnews** (6): `apnews_article`, `apnews_author`, `apnews_fact_check`, `apnews_headlines`, `apnews_news`, `apnews_sections`
- **apple-books** (12): `apple_books_audiobook`, `apple_books_audiobook_reviews`, `apple_books_audiobook_search`, `apple_books_audiobook_series`, `apple_books_audiobook_similar`, `apple_books_author`, `apple_books_book`, `apple_books_book_reviews`, `apple_books_book_similar`, `apple_books_charts`, `apple_books_search`, `apple_books_series`
- **apple-jobs** (3): `apple_jobs_job`, `apple_jobs_locations`, `apple_jobs_search`
- **apple-maps** (19): `apple_maps_autocomplete`, `apple_maps_categories`, `apple_maps_category_search`, `apple_maps_directions`, `apple_maps_eta`, `apple_maps_guide`, `apple_maps_guides`, `apple_maps_guides_cities`, `apple_maps_guides_lookup`, `apple_maps_guides_nearby`, `apple_maps_guides_publisher`, `apple_maps_guides_publishers`, `apple_maps_place`, `apple_maps_place_photos`, `apple_maps_places`, `apple_maps_reverse_geocode`, `apple_maps_search`, `apple_maps_transit_departures`, `apple_maps_venue_browse`
- **apple-podcasts** (8): `apple_podcasts_charts`, `apple_podcasts_charts_rankings`, `apple_podcasts_episodes_search`, `apple_podcasts_new`, `apple_podcasts_search`, `apple_podcasts_show`, `apple_podcasts_show_episodes`, `apple_podcasts_show_related`
- **appstore** (15): `appstore_app`, `appstore_categories`, `appstore_collection`, `appstore_collections`, `appstore_developer`, `appstore_editorial`, `appstore_editorial_category`, `appstore_list`, `appstore_privacy`, `appstore_ratings`, `appstore_reviews`, `appstore_search`, `appstore_similar`, `appstore_suggest`, `appstore_version_history`
- **arbys** (5): `arbys_categories`, `arbys_directory`, `arbys_location`, `arbys_locations`, `arbys_menu`
- **arstechnica** (5): `arstechnica_article`, `arstechnica_author`, `arstechnica_headlines`, `arstechnica_news`, `arstechnica_sections`
- **audible** (11): `audible_author_charts`, `audible_categories`, `audible_category`, `audible_charts`, `audible_editorial_list`, `audible_product`, `audible_product_related`, `audible_product_reviews`, `audible_products`, `audible_search`, `audible_series`
- **autotrader** (3): `autotrader_dealer`, `autotrader_search`, `autotrader_vehicle`
- **axios** (3): `axios_article`, `axios_categories`, `axios_headlines`
- **baidu** (2): `baidu_search`, `baidu_suggest`
- **balenciaga** (7): `balenciaga_categories`, `balenciaga_category`, `balenciaga_product`, `balenciaga_product_variants`, `balenciaga_search`, `balenciaga_store_countries`, `balenciaga_stores`
- **barrons** (4): `barrons_article`, `barrons_headlines`, `barrons_news`, `barrons_topics`
- **bbb** (17): `bbb_article`, `bbb_business`, `bbb_business_complaints`, `bbb_business_more_info`, `bbb_business_reviews`, `bbb_category`, `bbb_local_bbb`, `bbb_local_bbbs`, `bbb_news`, `bbb_news_topics`, `bbb_page`, `bbb_regions`, `bbb_scamtracker_detail`, `bbb_scamtracker_search`, `bbb_scamtracker_state_stats`, `bbb_search`, `bbb_search_filters`
- **bbc** (5): `bbc_article`, `bbc_author`, `bbc_headlines`, `bbc_live`, `bbc_search`
- **benzinga** (5): `benzinga_article`, `benzinga_headlines`, `benzinga_news`, `benzinga_search`, `benzinga_sections`
- **bestbuy** (11): `bestbuy_brands`, `bestbuy_categories`, `bestbuy_categories_trending`, `bestbuy_category`, `bestbuy_category_subcategories`, `bestbuy_product`, `bestbuy_product_questions`, `bestbuy_product_related`, `bestbuy_product_reviews`, `bestbuy_search`, `bestbuy_stores`
- **bigcommerce** (3): `bigcommerce_category`, `bigcommerce_product`, `bigcommerce_search`
- **bilibili** (8): `bilibili_anime_home`, `bilibili_autocomplete`, `bilibili_guochuang_home`, `bilibili_must_watch`, `bilibili_popular`, `bilibili_ranking`, `bilibili_vertical_home`, `bilibili_weekly`
- **billboard** (5): `billboard_article`, `billboard_author`, `billboard_headlines`, `billboard_news`, `billboard_sections`
- **bing** (5): `bing_images`, `bing_news`, `bing_search`, `bing_suggest`, `bing_videos`
- **birminghammail** (5): `birminghammail_article`, `birminghammail_author`, `birminghammail_headlines`, `birminghammail_news`, `birminghammail_sections`
- **bleacherreport** (5): `bleacherreport_article`, `bleacherreport_author`, `bleacherreport_headlines`, `bleacherreport_news`, `bleacherreport_sections`
- **bloomberg** (6): `bloomberg_article`, `bloomberg_author`, `bloomberg_categories`, `bloomberg_headlines`, `bloomberg_news`, `bloomberg_news_sitemaps`
- **bluesky** (11): `bluesky_author_feed`, `bluesky_followers`, `bluesky_follows`, `bluesky_post_likes`, `bluesky_post_quotes`, `bluesky_post_reposted_by`, `bluesky_post_thread`, `bluesky_posts`, `bluesky_profile`, `bluesky_search_actors`, `bluesky_trending_topics`
- **bonhams** (5): `bonhams_auction_detail`, `bonhams_auction_lots`, `bonhams_auction_search`, `bonhams_lot_detail`, `bonhams_lot_search`
- **booking** (3): `booking_hotel_detail`, `booking_reviews`, `booking_search`
- **booking-attractions** (3): `booking_attractions_detail`, `booking_attractions_reviews`, `booking_attractions_search`
- **booking-flights** (2): `booking_flights_autocomplete`, `booking_flights_search`
- **boots** (2): `boots_search`, `boots_suggest`
- **bostonglobe** (1): `bostonglobe_news`
- **boxofficemojo** (21): `boxofficemojo_brand`, `boxofficemojo_brands`, `boxofficemojo_calendar`, `boxofficemojo_calendar_changes`, `boxofficemojo_calendar_date`, `boxofficemojo_date_domestic`, `boxofficemojo_franchise`, `boxofficemojo_franchises`, `boxofficemojo_genre`, `boxofficemojo_genres`, `boxofficemojo_lifetime_grosses`, `boxofficemojo_release`, `boxofficemojo_release_group`, `boxofficemojo_showdown`, `boxofficemojo_showdowns`, `boxofficemojo_title`, `boxofficemojo_weekend_domestic`, `boxofficemojo_weekend_domestic_by_distributor`, `boxofficemojo_weekend_domestic_estimates`, `boxofficemojo_year_domestic`, `boxofficemojo_year_worldwide`
- **brand** (1): `brand_retrieve`
- **brave** (5): `brave_images`, `brave_news`, `brave_search`, `brave_suggest`, `brave_videos`
- **breitbart** (5): `breitbart_article`, `breitbart_author`, `breitbart_headlines`, `breitbart_news`, `breitbart_sections`
- **brisbanetimes** (5): `brisbanetimes_article`, `brisbanetimes_author`, `brisbanetimes_headlines`, `brisbanetimes_news`, `brisbanetimes_sections`
- **brooklinen** (11): `brooklinen_collection_products`, `brooklinen_collections`, `brooklinen_page`, `brooklinen_pages`, `brooklinen_product`, `brooklinen_product_recommendations`, `brooklinen_products`, `brooklinen_search_suggest`, `brooklinen_sitemap_urls`, `brooklinen_sitemaps`, `brooklinen_store`
- **burberry** (6): `burberry_categories`, `burberry_category`, `burberry_product`, `burberry_related`, `burberry_search`, `burberry_suggest`
- **burgerking** (4): `burgerking_availability`, `burgerking_locations`, `burgerking_menu`, `burgerking_product`
- **businessinsider** (5): `businessinsider_article`, `businessinsider_author`, `businessinsider_headlines`, `businessinsider_news`, `businessinsider_sections`
- **businessstandard** (5): `businessstandard_article`, `businessstandard_author`, `businessstandard_headlines`, `businessstandard_news`, `businessstandard_sections`
- **capterra** (3): `capterra_product`, `capterra_reviews`, `capterra_search`
- **carmax** (7): `carmax_search`, `carmax_search_suggestions`, `carmax_shop_by_brand`, `carmax_store`, `carmax_stores`, `carmax_vehicle`, `carmax_vehicle_recommendations`
- **carsdotcom** (2): `carsdotcom_search`, `carsdotcom_vehicle`
- **cbc** (5): `cbc_article`, `cbc_author`, `cbc_headlines`, `cbc_news`, `cbc_sections`
- **cbr** (5): `cbr_article`, `cbr_author`, `cbr_headlines`, `cbr_news`, `cbr_sections`
- **cbsnews** (5): `cbsnews_article`, `cbsnews_author`, `cbsnews_headlines`, `cbsnews_news`, `cbsnews_sections`
- **cbssports** (5): `cbssports_article`, `cbssports_author`, `cbssports_headlines`, `cbssports_news`, `cbssports_sections`
- **chewy** (14): `chewy_brands`, `chewy_categories`, `chewy_category`, `chewy_facets`, `chewy_gtin_lookup`, `chewy_inventory`, `chewy_item_attributes`, `chewy_product`, `chewy_product_questions`, `chewy_product_reviews`, `chewy_products`, `chewy_search`, `chewy_suggest`, `chewy_variants`
- **chicagotribune** (5): `chicagotribune_article`, `chicagotribune_author`, `chicagotribune_headlines`, `chicagotribune_news`, `chicagotribune_sections`
- **chick-fil-a** (8): `chick_fil_a_content`, `chick_fil_a_content_taxonomy`, `chick_fil_a_faq`, `chick_fil_a_location`, `chick_fil_a_locations`, `chick_fil_a_menu`, `chick_fil_a_menu_item`, `chick_fil_a_menu_taxonomy`
- **chipotle** (8): `chipotle_ingredients`, `chipotle_meals`, `chipotle_menu`, `chipotle_menu_metadata`, `chipotle_restaurant`, `chipotle_restaurant_meals`, `chipotle_restaurant_menu`, `chipotle_restaurants`
- **chromewebstore** (12): `chromewebstore_categories`, `chromewebstore_category`, `chromewebstore_charts`, `chromewebstore_collection`, `chromewebstore_developer`, `chromewebstore_item`, `chromewebstore_permissions`, `chromewebstore_privacy`, `chromewebstore_reviews`, `chromewebstore_search`, `chromewebstore_similar`, `chromewebstore_suggest`
- **chrono24** (8): `chrono24_autocomplete`, `chrono24_brands`, `chrono24_dealer`, `chrono24_dealer_reviews`, `chrono24_facets`, `chrono24_listing`, `chrono24_models`, `chrono24_search`
- **clevelandcom** (1): `clevelandcom_news`
- **cna** (5): `cna_article`, `cna_author`, `cna_headlines`, `cna_news`, `cna_sections`
- **cnbc** (4): `cnbc_article`, `cnbc_author`, `cnbc_categories`, `cnbc_headlines`
- **cnet** (5): `cnet_article`, `cnet_author`, `cnet_headlines`, `cnet_news`, `cnet_sections`
- **cnn** (4): `cnn_article`, `cnn_author`, `cnn_headlines`, `cnn_live_story`
- **coingecko** (21): `coingecko_categories`, `coingecko_category_coins`, `coingecko_chain`, `coingecko_chains`, `coingecko_coin`, `coingecko_coin_analysis`, `coingecko_exchange`, `coingecko_exchanges`, `coingecko_gainers_losers`, `coingecko_global`, `coingecko_global_charts`, `coingecko_learn_articles`, `coingecko_markets`, `coingecko_new_coins`, `coingecko_news`, `coingecko_nft_category`, `coingecko_nfts`, `coingecko_search`, `coingecko_token_unlocks`, `coingecko_treasuries`, `coingecko_trending`
- **colehaan** (11): `colehaan_collection_products`, `colehaan_collections`, `colehaan_page`, `colehaan_pages`, `colehaan_product`, `colehaan_product_recommendations`, `colehaan_products`, `colehaan_search_suggest`, `colehaan_sitemap_urls`, `colehaan_sitemaps`, `colehaan_store`
- **collider** (5): `collider_article`, `collider_author`, `collider_headlines`, `collider_news`, `collider_sections`
- **comc** (3): `comc_categories`, `comc_listing`, `comc_search`
- **congress** (2): `congress_report`, `congress_stock_disclosures`
- **costco** (6): `costco_categories`, `costco_product`, `costco_product_availability`, `costco_product_reviews`, `costco_search`, `costco_warehouses`
- **courtlistener** (3): `courtlistener_courts`, `courtlistener_people`, `courtlistener_search`
- **cricinfo** (22): `cricinfo_calendar`, `cricinfo_commentary`, `cricinfo_grounds`, `cricinfo_live_matches`, `cricinfo_match`, `cricinfo_news`, `cricinfo_photos`, `cricinfo_rankings`, `cricinfo_records`, `cricinfo_records_index`, `cricinfo_rss`, `cricinfo_scores`, `cricinfo_series`, `cricinfo_squads`, `cricinfo_stats`, `cricinfo_story`, `cricinfo_team`, `cricinfo_team_schedule`, `cricinfo_teams`, `cricinfo_venue`, `cricinfo_venue_matches`, `cricinfo_videos`
- **ctvnews** (5): `ctvnews_article`, `ctvnews_author`, `ctvnews_headlines`, `ctvnews_news`, `ctvnews_sections`
- **culvers** (7): `culvers_calendar`, `culvers_categories`, `culvers_directory`, `culvers_flavor`, `culvers_item`, `culvers_menu`, `culvers_store`
- **cvs** (7): `cvs_brands`, `cvs_categories`, `cvs_category`, `cvs_product`, `cvs_product_ingredients`, `cvs_search`, `cvs_store_locator`
- **dailycaller** (5): `dailycaller_article`, `dailycaller_author`, `dailycaller_headlines`, `dailycaller_news`, `dailycaller_sections`
- **dailyexpress** (5): `dailyexpress_article`, `dailyexpress_author`, `dailyexpress_headlines`, `dailyexpress_news`, `dailyexpress_sections`
- **dailykos** (4): `dailykos_article`, `dailykos_headlines`, `dailykos_news`, `dailykos_sections`
- **dailymail** (5): `dailymail_article`, `dailymail_author`, `dailymail_headlines`, `dailymail_news`, `dailymail_sections`
- **dailymaverick** (4): `dailymaverick_article`, `dailymaverick_headlines`, `dailymaverick_news`, `dailymaverick_sections`
- **dailyrecord** (5): `dailyrecord_article`, `dailyrecord_author`, `dailyrecord_headlines`, `dailyrecord_news`, `dailyrecord_sections`
- **dailystaruk** (5): `dailystaruk_article`, `dailystaruk_author`, `dailystaruk_headlines`, `dailystaruk_news`, `dailystaruk_sections`
- **dailywire** (5): `dailywire_article`, `dailywire_author`, `dailywire_headlines`, `dailywire_news`, `dailywire_sections`
- **datasets** (136): `datasets_airbnb_facets`, `datasets_airbnb_item`, `datasets_airbnb_nearby`, `datasets_airbnb_search`, `datasets_apple_podcasts_shows_facets`, `datasets_apple_podcasts_shows_item`, `datasets_apple_podcasts_shows_search`, `datasets_apps_charts_search`, `datasets_apps_reviews_search`, `datasets_apps_search`, `datasets_bbb_businesses_facets`, `datasets_bbb_businesses_item`, `datasets_bbb_businesses_search`, `datasets_bbb_scamtracker_reports_facets`, `datasets_bbb_scamtracker_reports_item`, `datasets_bbb_scamtracker_reports_search`, `datasets_boxofficemojo_facets`, `datasets_boxofficemojo_item`, `datasets_boxofficemojo_search`, `datasets_chrome_extensions_changes`, `datasets_chrome_extensions_facets`, `datasets_chrome_extensions_history`, `datasets_chrome_extensions_item`, `datasets_chrome_extensions_metrics`, `datasets_chrome_extensions_search`, `datasets_chrome_extensions_trending`, `datasets_creators_search`, `datasets_doordash_stores_facets`, `datasets_doordash_stores_item`, `datasets_doordash_stores_nearby`, `datasets_doordash_stores_search`, `datasets_facebook_pages_facets`, `datasets_facebook_pages_item`, `datasets_facebook_pages_search`, `datasets_github_users_facets`, `datasets_github_users_item`, `datasets_github_users_nearby`, `datasets_github_users_search`, `datasets_goodreads_authors_facets`, `datasets_goodreads_authors_item`, `datasets_goodreads_authors_search`, `datasets_goodreads_books_facets`, `datasets_goodreads_books_item`, `datasets_goodreads_books_search`, `datasets_google_map_facets`, `datasets_google_map_item`, `datasets_google_map_nearby`, `datasets_google_map_search`, `datasets_housing_markets_facets`, `datasets_housing_markets_item`, `datasets_housing_markets_search`, `datasets_instagram_users_facets`, `datasets_instagram_users_item`, `datasets_instagram_users_search`, `datasets_jobs_companies`, `datasets_jobs_company_item`, `datasets_jobs_facets`, `datasets_jobs_item`, `datasets_jobs_nearby`, `datasets_jobs_search`, `datasets_journalists_facets`, `datasets_journalists_item`, `datasets_journalists_search`, `datasets_list`, `datasets_llms_facets`, `datasets_llms_item`, `datasets_llms_search`, `datasets_numbeo_cities_facets`, `datasets_numbeo_cities_item`, `datasets_numbeo_cities_search`, `datasets_numbeo_countries_item`, `datasets_numbeo_countries_search`, `datasets_pitchbook_advisors_facets`, `datasets_pitchbook_advisors_item`, `datasets_pitchbook_advisors_search`, `datasets_pitchbook_companies_facets`, `datasets_pitchbook_companies_item`, `datasets_pitchbook_companies_search`, `datasets_pitchbook_funds_facets`, `datasets_pitchbook_funds_item`, `datasets_pitchbook_funds_search`, `datasets_pitchbook_investors_facets`, `datasets_pitchbook_investors_item`, `datasets_pitchbook_investors_search`, `datasets_pitchbook_limited_partners_facets`, `datasets_pitchbook_limited_partners_item`, `datasets_pitchbook_limited_partners_search`, `datasets_playstation_games_facets`, `datasets_playstation_games_item`, `datasets_playstation_games_search`, `datasets_producthunt_makers_facets`, `datasets_producthunt_makers_item`, `datasets_producthunt_makers_search`, `datasets_producthunt_products_facets`, `datasets_producthunt_products_item`, `datasets_producthunt_products_search`, `datasets_producthunt_trends_facets`, `datasets_producthunt_trends_search`, `datasets_reddit_trending_search`, `datasets_sec_companies_facets`, `datasets_sec_companies_financials`, `datasets_sec_companies_insider`, `datasets_sec_companies_item`, `datasets_sec_companies_search`, `datasets_sec_institutional_positions_facets`, `datasets_sec_institutional_positions_search`, `datasets_starbucks_stores_facets`, `datasets_starbucks_stores_item`, `datasets_starbucks_stores_nearby`, `datasets_starbucks_stores_search`, `datasets_steam_achievements_search`, `datasets_steam_charts_search`, `datasets_steam_games_facets`, `datasets_steam_games_item`, `datasets_steam_games_search`, `datasets_steam_news_search`, `datasets_steam_playercounts_search`, `datasets_steam_prices_search`, `datasets_steam_reviews_search`, `datasets_techstack_facets`, `datasets_techstack_item`, `datasets_techstack_search`, `datasets_trustmrr_facets`, `datasets_trustmrr_history`, `datasets_trustmrr_item`, `datasets_trustmrr_search`, `datasets_vehicle_listings_facets`, `datasets_vehicle_listings_item`, `datasets_vehicle_listings_price_history`, `datasets_vehicle_listings_search`, `datasets_x_users_facets`, `datasets_x_users_item`, `datasets_x_users_search`, `datasets_youtube_creators_facets`, `datasets_youtube_creators_item`, `datasets_youtube_creators_search`
- **dawn** (5): `dawn_article`, `dawn_author`, `dawn_headlines`, `dawn_news`, `dawn_sections`
- **deadline** (5): `deadline_article`, `deadline_author`, `deadline_headlines`, `deadline_news`, `deadline_sections`
- **deliveroo** (5): `deliveroo_fulfillment_times`, `deliveroo_restaurant`, `deliveroo_restaurant_menu`, `deliveroo_search`, `deliveroo_search_filters`
- **denverpost** (5): `denverpost_article`, `denverpost_author`, `denverpost_headlines`, `denverpost_news`, `denverpost_sections`
- **depop** (10): `depop_brands`, `depop_categories`, `depop_item`, `depop_item_similar`, `depop_search`, `depop_search_facets`, `depop_search_sellers`, `depop_shop`, `depop_sizes`, `depop_suggest`
- **developer** (2): `developer_search`, `developer_sources`
- **discogs** (7): `discogs_artist`, `discogs_artist_releases`, `discogs_label`, `discogs_label_releases`, `discogs_master`, `discogs_release`, `discogs_search`
- **dominos** (6): `dominos_coupons`, `dominos_customization`, `dominos_menu`, `dominos_nutrition`, `dominos_store`, `dominos_store_locator`
- **doordash** (12): `doordash_explore`, `doordash_feed`, `doordash_search`, `doordash_search_autocomplete`, `doordash_search_filters`, `doordash_search_items`, `doordash_store`, `doordash_store_fulfillment`, `doordash_store_info`, `doordash_store_item`, `doordash_store_menu`, `doordash_store_reviews`
- **draftkings** (12): `draftkings_event`, `draftkings_event_context`, `draftkings_event_markets`, `draftkings_featured_leagues`, `draftkings_futures`, `draftkings_league_events`, `draftkings_leagues`, `draftkings_live`, `draftkings_odds`, `draftkings_quick_links`, `draftkings_team`, `draftkings_teams`
- **duckduckgo** (6): `duckduckgo_image`, `duckduckgo_news`, `duckduckgo_search`, `duckduckgo_shopping`, `duckduckgo_suggest`, `duckduckgo_video`
- **dunkin** (4): `dunkin_directory`, `dunkin_menu`, `dunkin_nearby`, `dunkin_store`
- **dw** (5): `dw_article`, `dw_author`, `dw_headlines`, `dw_news`, `dw_sections`
- **ebay** (10): `ebay_item`, `ebay_live_stream`, `ebay_live_stream_items`, `ebay_live_streams`, `ebay_live_streams_batch`, `ebay_search`, `ebay_seller`, `ebay_seller_about`, `ebay_seller_feedback`, `ebay_seller_shop`
- **economictimes** (5): `economictimes_article`, `economictimes_author`, `economictimes_headlines`, `economictimes_news`, `economictimes_sections`
- **engadget** (5): `engadget_article`, `engadget_author`, `engadget_headlines`, `engadget_news`, `engadget_sections`
- **eonline** (5): `eonline_article`, `eonline_author`, `eonline_headlines`, `eonline_news`, `eonline_sections`
- **espn** (9): `espn_athlete`, `espn_game_summary`, `espn_news`, `espn_rankings`, `espn_scoreboard`, `espn_standings`, `espn_team`, `espn_team_roster`, `espn_teams`
- **etsy** (7): `etsy_listing`, `etsy_listing_reviews`, `etsy_search`, `etsy_shop`, `etsy_shop_listings`, `etsy_shop_reviews`, `etsy_shop_search`
- **euronews** (5): `euronews_article`, `euronews_author`, `euronews_headlines`, `euronews_news`, `euronews_sections`
- **everlane** (11): `everlane_collection_products`, `everlane_collections`, `everlane_page`, `everlane_pages`, `everlane_product`, `everlane_product_recommendations`, `everlane_products`, `everlane_search_suggest`, `everlane_sitemap_urls`, `everlane_sitemaps`, `everlane_store`
- **ew** (5): `ew_article`, `ew_author`, `ew_headlines`, `ew_news`, `ew_sections`
- **expedia** (7): `expedia_activities_search`, `expedia_flights_search`, `expedia_locations_search`, `expedia_properties_detail`, `expedia_properties_filters`, `expedia_properties_reviews`, `expedia_properties_search`
- **expresstribune** (5): `expresstribune_article`, `expresstribune_author`, `expresstribune_headlines`, `expresstribune_news`, `expresstribune_sections`
- **extract** (1): `extract`
- **facebook** (2): `facebook_marketplace_search`, `facebook_page`
- **fanatics** (4): `fanatics_categories`, `fanatics_category`, `fanatics_product`, `fanatics_search`
- **fanaticscollect** (7): `fanaticscollect_auctions`, `fanaticscollect_categories`, `fanaticscollect_instant_rips_categories`, `fanaticscollect_listing`, `fanaticscollect_search`, `fanaticscollect_sold_items`, `fanaticscollect_trending_searches`
- **fanaticslive** (8): `fanaticslive_browse`, `fanaticslive_channel`, `fanaticslive_instant_rips`, `fanaticslive_leagues`, `fanaticslive_shop`, `fanaticslive_shop_shows`, `fanaticslive_shops`, `fanaticslive_show`
- **farfetch** (4): `farfetch_categories`, `farfetch_designers`, `farfetch_product`, `farfetch_search`
- **fashionnova** (11): `fashionnova_collection_products`, `fashionnova_collections`, `fashionnova_page`, `fashionnova_pages`, `fashionnova_product`, `fashionnova_product_recommendations`, `fashionnova_products`, `fashionnova_search_suggest`, `fashionnova_sitemap_urls`, `fashionnova_sitemaps`, `fashionnova_store`
- **fashionphile** (12): `fashionphile_collection_products`, `fashionphile_collections`, `fashionphile_page`, `fashionphile_pages`, `fashionphile_product`, `fashionphile_product_recommendations`, `fashionphile_products`, `fashionphile_search`, `fashionphile_search_suggest`, `fashionphile_sitemap_urls`, `fashionphile_sitemaps`, `fashionphile_store`
- **fastcompany** (5): `fastcompany_article`, `fastcompany_author`, `fastcompany_headlines`, `fastcompany_news`, `fastcompany_sections`
- **fiveguys** (10): `fiveguys_directory`, `fiveguys_faq`, `fiveguys_faq_categories`, `fiveguys_menu`, `fiveguys_nearby`, `fiveguys_nutrition`, `fiveguys_ordering_locations`, `fiveguys_ordering_menu`, `fiveguys_search`, `fiveguys_store`
- **fiverr** (3): `fiverr_gig`, `fiverr_search`, `fiverr_seller`
- **flashscore** (54): `flashscore_calendar`, `flashscore_calendar_categories`, `flashscore_competitions`, `flashscore_entity_news`, `flashscore_match_box_score`, `flashscore_match_darts`, `flashscore_match_h2h`, `flashscore_match_highlights`, `flashscore_match_info`, `flashscore_match_lineups`, `flashscore_match_missing_players`, `flashscore_match_momentum`, `flashscore_match_news`, `flashscore_match_odds`, `flashscore_match_player_stats`, `flashscore_match_point_by_point`, `flashscore_match_predicted_lineups`, `flashscore_match_report`, `flashscore_match_standings`, `flashscore_match_stats`, `flashscore_match_tv`, `flashscore_navigation`, `flashscore_news`, `flashscore_news_article`, `flashscore_news_article_body`, `flashscore_news_categories`, `flashscore_news_most_read`, `flashscore_odds_geos`, `flashscore_player`, `flashscore_player_fixtures`, `flashscore_player_injuries`, `flashscore_player_match_log`, `flashscore_player_news`, `flashscore_player_results`, `flashscore_player_transfers`, `flashscore_ranking_categories`, `flashscore_rankings`, `flashscore_scores`, `flashscore_search`, `flashscore_sports`, `flashscore_team`, `flashscore_team_fixtures`, `flashscore_team_news`, `flashscore_team_outright_odds`, `flashscore_team_results`, `flashscore_team_squad`, `flashscore_team_transfers`, `flashscore_top_search`, `flashscore_tournament_archive_seasons`, `flashscore_tournament_events`, `flashscore_tournament_outright_odds`, `flashscore_tournament_seasons`, `flashscore_tournament_standings`, `flashscore_tournament_standings_views`
- **foodpanda** (5): `foodpanda_restaurant`, `foodpanda_restaurant_menu`, `foodpanda_restaurant_reviews`, `foodpanda_search`, `foodpanda_search_cuisines`
- **forbes** (6): `forbes_article`, `forbes_author`, `forbes_billionaires`, `forbes_categories`, `forbes_headlines`, `forbes_person`
- **foreignaffairs** (5): `foreignaffairs_article`, `foreignaffairs_author`, `foreignaffairs_headlines`, `foreignaffairs_topic`, `foreignaffairs_topics`
- **foreignpolicy** (8): `foreignpolicy_article`, `foreignpolicy_author`, `foreignpolicy_headlines`, `foreignpolicy_live`, `foreignpolicy_live_detail`, `foreignpolicy_project`, `foreignpolicy_projects`, `foreignpolicy_topic`
- **fortune** (12): `fortune_article`, `fortune_author`, `fortune_companies`, `fortune_company`, `fortune_company_filters`, `fortune_headlines`, `fortune_news`, `fortune_ranking`, `fortune_ranking_filters`, `fortune_ranking_lists`, `fortune_ranking_years`, `fortune_sections`
- **fotmob** (31): `fotmob_audio_matches`, `fotmob_fifa_ranking_periods`, `fotmob_fifa_rankings`, `fotmob_latest_news`, `fotmob_league`, `fotmob_leagues`, `fotmob_lineup_builder_players`, `fotmob_lineup_builder_team`, `fotmob_match`, `fotmob_match_media`, `fotmob_matches`, `fotmob_news`, `fotmob_news_article`, `fotmob_player`, `fotmob_player_match_stats`, `fotmob_player_matches`, `fotmob_player_stats`, `fotmob_search`, `fotmob_seasons`, `fotmob_stats`, `fotmob_stats_categories`, `fotmob_table`, `fotmob_team`, `fotmob_team_fixtures`, `fotmob_team_news`, `fotmob_transfers`, `fotmob_trending_news`, `fotmob_trending_searches`, `fotmob_tv_guide`, `fotmob_tv_guide_channels`, `fotmob_tv_guide_countries`
- **foxnews** (6): `foxnews_article`, `foxnews_author`, `foxnews_headlines`, `foxnews_news`, `foxnews_search`, `foxnews_sections`
- **foxsports** (4): `foxsports_article`, `foxsports_headlines`, `foxsports_news`, `foxsports_sections`
- **france24** (5): `france24_article`, `france24_author`, `france24_headlines`, `france24_news`, `france24_sections`
- **freemalaysiatoday** (2): `freemalaysiatoday_news`, `freemalaysiatoday_sections`
- **ft** (6): `ft_article`, `ft_author`, `ft_categories`, `ft_headlines`, `ft_news`, `ft_search`
- **gamerant** (5): `gamerant_article`, `gamerant_author`, `gamerant_headlines`, `gamerant_news`, `gamerant_sections`
- **gamesradar** (5): `gamesradar_article`, `gamesradar_author`, `gamesradar_headlines`, `gamesradar_news`, `gamesradar_sections`
- **gbnews** (5): `gbnews_article`, `gbnews_author`, `gbnews_headlines`, `gbnews_news`, `gbnews_sections`
- **gdelt** (12): `gdelt_context`, `gdelt_search`, `gdelt_timeline`, `gdelt_tonechart`, `gdelt_tv_concept_entities`, `gdelt_tv_search`, `gdelt_tv_showchart`, `gdelt_tv_stationchart`, `gdelt_tv_stationdetails`, `gdelt_tv_timeline`, `gdelt_tv_visual_entities`, `gdelt_tv_wordcloud`
- **geocoding** (3): `geocoding_lookup`, `geocoding_reverse`, `geocoding_search`
- **ghanaweb** (9): `ghanaweb_archive`, `ghanaweb_archive_months`, `ghanaweb_article`, `ghanaweb_headlines`, `ghanaweb_news`, `ghanaweb_sections`, `ghanaweb_video`, `ghanaweb_video_sections`, `ghanaweb_videos`
- **github** (17): `github_org`, `github_org_repos`, `github_repo`, `github_repo_contributors`, `github_repo_forks`, `github_repo_languages`, `github_repo_releases`, `github_search_repositories`, `github_search_users`, `github_trending`, `github_trending_developers`, `github_user`, `github_user_events`, `github_user_followers`, `github_user_following`, `github_user_pinned`, `github_user_repos`
- **gizmodo** (5): `gizmodo_article`, `gizmodo_author`, `gizmodo_headlines`, `gizmodo_news`, `gizmodo_sections`
- **globalnews** (5): `globalnews_article`, `globalnews_author`, `globalnews_headlines`, `globalnews_news`, `globalnews_sections`
- **globeandmail** (5): `globeandmail_article`, `globeandmail_author`, `globeandmail_headlines`, `globeandmail_news`, `globeandmail_sections`
- **gmanews** (4): `gmanews_article`, `gmanews_headlines`, `gmanews_news`, `gmanews_sections`
- **goat** (10): `goat_collection`, `goat_countries`, `goat_curated`, `goat_listings_count`, `goat_product`, `goat_product_recommended`, `goat_search`, `goat_search_facets`, `goat_suggest`, `goat_trending_searches`
- **goldin** (5): `goldin_auctions`, `goldin_categories`, `goldin_listing`, `goldin_search`, `goldin_suggest`
- **goodreads** (10): `goodreads_author`, `goodreads_author_books`, `goodreads_author_quotes`, `goodreads_book`, `goodreads_book_editions`, `goodreads_book_reviews`, `goodreads_genre`, `goodreads_list`, `goodreads_lists`, `goodreads_search`
- **goodrx** (20): `goodrx_answer`, `goodrx_answers`, `goodrx_brands`, `goodrx_class`, `goodrx_classes`, `goodrx_comparison`, `goodrx_comparisons`, `goodrx_condition`, `goodrx_condition_drugs`, `goodrx_conditions`, `goodrx_drug_guide`, `goodrx_drug_guides`, `goodrx_drug_info`, `goodrx_drug_options`, `goodrx_drug_prices`, `goodrx_drugs`, `goodrx_health_article`, `goodrx_health_articles`, `goodrx_health_topics`, `goodrx_pet_medications`
- **google** (40): `google_finance_analyst_articles`, `google_finance_chart`, `google_finance_classification`, `google_finance_company`, `google_finance_context`, `google_finance_financials`, `google_finance_markets_category_news`, `google_finance_markets_category_stocks`, `google_finance_markets_earnings`, `google_finance_markets_featured`, `google_finance_markets_headline`, `google_finance_markets_indices`, `google_finance_markets_movers`, `google_finance_markets_top`, `google_finance_markets_trending`, `google_finance_news`, `google_finance_quote`, `google_finance_related`, `google_finance_search`, `google_finance_ticker`, `google_jobs`, `google_map_place`, `google_map_place_photos`, `google_map_place_reviews`, `google_map_search`, `google_news`, `google_news_search`, `google_suggest`, `google_trends_categories`, `google_trends_enums`, `google_trends_explore`, `google_trends_explore_interest_by_region`, `google_trends_explore_interest_over_time`, `google_trends_explore_related_topics`, `google_trends_explore_rising_queries`, `google_trends_explore_top_queries`, `google_trends_locations`, `google_trends_trending`, `google_trends_trending_detail`, `google_videos`
- **google-jobs** (2): `google_jobs_job`, `google_jobs_search`
- **googlepatents** (6): `googlepatents_classification`, `googlepatents_coverage`, `googlepatents_detail`, `googlepatents_recent`, `googlepatents_search`, `googlepatents_suggest`
- **googleplay** (11): `googleplay_app`, `googleplay_categories`, `googleplay_datasafety`, `googleplay_developer`, `googleplay_list`, `googleplay_permissions`, `googleplay_ratings`, `googleplay_reviews`, `googleplay_search`, `googleplay_similar`, `googleplay_suggest`
- **gq** (5): `gq_article`, `gq_author`, `gq_headlines`, `gq_news`, `gq_sections`
- **grailed** (11): `grailed_categories`, `grailed_collection`, `grailed_collections`, `grailed_designers`, `grailed_listing`, `grailed_search`, `grailed_seller`, `grailed_seller_reviews`, `grailed_similar_listings`, `grailed_sold_listings`, `grailed_suggest`
- **greystar** (11): `greystar_article`, `greystar_articles`, `greystar_location`, `greystar_locations`, `greystar_markets`, `greystar_newsroom`, `greystar_newsroom_article`, `greystar_property`, `greystar_search`, `greystar_unit_locations`, `greystar_units`
- **grubhub** (7): `grubhub_availability`, `grubhub_offers`, `grubhub_restaurant`, `grubhub_restaurant_menu`, `grubhub_restaurant_reviews`, `grubhub_search`, `grubhub_timepicker`
- **guardian** (4): `guardian_article`, `guardian_author`, `guardian_headlines`, `guardian_topic`
- **gucci** (10): `gucci_categories`, `gucci_category`, `gucci_product`, `gucci_recommendations`, `gucci_search`, `gucci_size_guide`, `gucci_store`, `gucci_store_search`, `gucci_stores`, `gucci_suggest`
- **gulfnews** (5): `gulfnews_article`, `gulfnews_author`, `gulfnews_headlines`, `gulfnews_news`, `gulfnews_sections`
- **gymshark** (10): `gymshark_collection_products`, `gymshark_collections`, `gymshark_page`, `gymshark_pages`, `gymshark_product`, `gymshark_product_recommendations`, `gymshark_products`, `gymshark_sitemap_urls`, `gymshark_sitemaps`, `gymshark_store`
- **hbr** (4): `hbr_article`, `hbr_categories`, `hbr_headlines`, `hbr_topic`
- **healthgrades** (16): `healthgrades_autocomplete`, `healthgrades_facilities_filters`, `healthgrades_facilities_search`, `healthgrades_facility`, `healthgrades_health_article`, `healthgrades_health_articles`, `healthgrades_health_topics`, `healthgrades_hospital`, `healthgrades_hospital_award_filters`, `healthgrades_hospital_awards`, `healthgrades_locations`, `healthgrades_physician`, `healthgrades_physicians_filters`, `healthgrades_physicians_search`, `healthgrades_specialties`, `healthgrades_top_searches`
- **hermes** (8): `hermes_categories`, `hermes_category`, `hermes_product`, `hermes_product_recommendations`, `hermes_products`, `hermes_search`, `hermes_stores`, `hermes_suggest`
- **hindustantimes** (5): `hindustantimes_article`, `hindustantimes_author`, `hindustantimes_headlines`, `hindustantimes_news`, `hindustantimes_sections`
- **hm** (7): `hm_categories`, `hm_listing`, `hm_product`, `hm_product_related`, `hm_search`, `hm_search_suggestions`, `hm_stores`
- **hollywoodreporter** (5): `hollywoodreporter_article`, `hollywoodreporter_author`, `hollywoodreporter_headlines`, `hollywoodreporter_news`, `hollywoodreporter_sections`
- **homedepot** (6): `homedepot_categories`, `homedepot_category`, `homedepot_product`, `homedepot_product_questions`, `homedepot_search`, `homedepot_suggest`
- **hotels** (7): `hotels_autocomplete`, `hotels_offers`, `hotels_property`, `hotels_rates`, `hotels_reviews`, `hotels_reviews_archive`, `hotels_search`
- **houston-chronicle** (5): `houston_chronicle_article`, `houston_chronicle_author`, `houston_chronicle_headlines`, `houston_chronicle_news`, `houston_chronicle_sections`
- **howtogeek** (1): `howtogeek_news`
- **huffpost** (5): `huffpost_article`, `huffpost_author`, `huffpost_headlines`, `huffpost_news`, `huffpost_sections`
- **ign** (5): `ign_article`, `ign_author`, `ign_headlines`, `ign_news`, `ign_sections`
- **ikea** (9): `ikea_availability`, `ikea_categories`, `ikea_category`, `ikea_product`, `ikea_reviews`, `ikea_search`, `ikea_store`, `ikea_stores`, `ikea_suggest`
- **imdb** (30): `imdb_charts`, `imdb_image_types`, `imdb_name`, `imdb_name_awards`, `imdb_name_credits`, `imdb_name_images`, `imdb_name_videos`, `imdb_search`, `imdb_search_title`, `imdb_title`, `imdb_title_awards`, `imdb_title_box_office`, `imdb_title_company_credits`, `imdb_title_connections`, `imdb_title_credits`, `imdb_title_episodes`, `imdb_title_filming_locations`, `imdb_title_goofs`, `imdb_title_images`, `imdb_title_keywords`, `imdb_title_parental_guide`, `imdb_title_public_facts_analysis`, `imdb_title_quotes`, `imdb_title_ratings`, `imdb_title_release_info`, `imdb_title_reviews`, `imdb_title_similar`, `imdb_title_technical_specs`, `imdb_title_trivia`, `imdb_title_videos`
- **importyeti** (2): `importyeti_company`, `importyeti_search`
- **indeed** (3): `indeed_job`, `indeed_locations_suggest`, `indeed_search`
- **independent** (5): `independent_article`, `independent_author`, `independent_headlines`, `independent_news`, `independent_sections`
- **indianexpress** (5): `indianexpress_article`, `indianexpress_author`, `indianexpress_headlines`, `indianexpress_news`, `indianexpress_sections`
- **indiatoday** (5): `indiatoday_article`, `indiatoday_author`, `indiatoday_headlines`, `indiatoday_news`, `indiatoday_sections`
- **indiewire** (5): `indiewire_article`, `indiewire_author`, `indiewire_headlines`, `indiewire_news`, `indiewire_sections`
- **inews** (5): `inews_article`, `inews_author`, `inews_headlines`, `inews_news`, `inews_sections`
- **inquirer** (5): `inquirer_article`, `inquirer_author`, `inquirer_headlines`, `inquirer_news`, `inquirer_sections`
- **instacart** (6): `instacart_departments`, `instacart_item`, `instacart_search`, `instacart_search_nearby`, `instacart_stores`, `instacart_trending`
- **instagram** (3): `instagram_post`, `instagram_profile`, `instagram_reels`
- **investopedia** (5): `investopedia_article`, `investopedia_author`, `investopedia_headlines`, `investopedia_news`, `investopedia_sections`
- **iol** (5): `iol_article`, `iol_author`, `iol_headlines`, `iol_news`, `iol_sections`
- **irishindependent** (5): `irishindependent_article`, `irishindependent_author`, `irishindependent_headlines`, `irishindependent_news`, `irishindependent_sections`
- **irishtimes** (5): `irishtimes_article`, `irishtimes_author`, `irishtimes_headlines`, `irishtimes_news`, `irishtimes_sections`
- **japantimes** (5): `japantimes_article`, `japantimes_author`, `japantimes_headlines`, `japantimes_news`, `japantimes_sections`
- **jcrew** (8): `jcrew_categories`, `jcrew_category`, `jcrew_product`, `jcrew_product_reviews`, `jcrew_search`, `jcrew_size_chart`, `jcrew_stores`, `jcrew_suggest`
- **jerusalempost** (6): `jerusalempost_article`, `jerusalempost_author`, `jerusalempost_authors`, `jerusalempost_headlines`, `jerusalempost_news`, `jerusalempost_sections`
- **jimmy-johns** (5): `jimmy_johns_menu`, `jimmy_johns_modifiers`, `jimmy_johns_nearby`, `jimmy_johns_sitemap`, `jimmy_johns_store`
- **jobs** (30): `jobs_ashby_board`, `jobs_company_search`, `jobs_eightfold_board`, `jobs_eightfold_job`, `jobs_gem_board`, `jobs_greenhouse_board`, `jobs_greenhouse_job`, `jobs_hiring_signals`, `jobs_icims_board`, `jobs_icims_job`, `jobs_lever_posting`, `jobs_lever_postings`, `jobs_oracle_board`, `jobs_oracle_job`, `jobs_personio_feed`, `jobs_phenom_board`, `jobs_phenom_job`, `jobs_pinpoint_board`, `jobs_recruitee_offer`, `jobs_recruitee_offers`, `jobs_rippling_board`, `jobs_rippling_job`, `jobs_smartrecruiters_posting`, `jobs_smartrecruiters_postings`, `jobs_teamtailor_jobs`, `jobs_ukg_board`, `jobs_workable_posting`, `jobs_workable_postings`, `jobs_workday_board`, `jobs_workday_job`
- **justeat** (4): `justeat_restaurant`, `justeat_restaurant_menu`, `justeat_search`, `justeat_search_filters`
- **justwatch** (21): `justwatch_age_certifications`, `justwatch_discover`, `justwatch_episode_by_id`, `justwatch_episode_offers`, `justwatch_genre_titles`, `justwatch_genres`, `justwatch_monetization_titles`, `justwatch_new`, `justwatch_popular`, `justwatch_provider_titles`, `justwatch_providers`, `justwatch_search`, `justwatch_season_by_id`, `justwatch_season_episodes`, `justwatch_show_seasons`, `justwatch_title`, `justwatch_title_analysis`, `justwatch_title_by_id`, `justwatch_title_media`, `justwatch_title_offers`, `justwatch_title_similar`
- **kalshi** (21): `kalshi_event`, `kalshi_event_history`, `kalshi_event_metadata`, `kalshi_events`, `kalshi_exchange_schedule`, `kalshi_exchange_status`, `kalshi_historical_cutoff`, `kalshi_historical_market`, `kalshi_historical_market_history`, `kalshi_historical_markets`, `kalshi_historical_trades`, `kalshi_market`, `kalshi_market_history`, `kalshi_market_orderbook`, `kalshi_markets`, `kalshi_markets_history`, `kalshi_markets_orderbooks`, `kalshi_multivariate_events`, `kalshi_series`, `kalshi_series_detail`, `kalshi_trades`
- **kfc** (7): `kfc_delivery_estimate`, `kfc_menu`, `kfc_nearby`, `kfc_promotion`, `kfc_promotions`, `kfc_store`, `kfc_stores`
- **khaleejtimes** (5): `khaleejtimes_article`, `khaleejtimes_author`, `khaleejtimes_headlines`, `khaleejtimes_news`, `khaleejtimes_sections`
- **kickstarter** (4): `kickstarter_comments`, `kickstarter_discover`, `kickstarter_project`, `kickstarter_updates`
- **kohls** (4): `kohls_category`, `kohls_product_reviews`, `kohls_stores`, `kohls_suggest`
- **kotaku** (5): `kotaku_article`, `kotaku_author`, `kotaku_headlines`, `kotaku_news`, `kotaku_sections`
- **kroger** (10): `kroger_categories`, `kroger_category`, `kroger_coupons`, `kroger_product`, `kroger_product_reviews`, `kroger_products`, `kroger_related_tags`, `kroger_search`, `kroger_store`, `kroger_suggest`
- **kyliecosmetics** (11): `kyliecosmetics_collection_products`, `kyliecosmetics_collections`, `kyliecosmetics_page`, `kyliecosmetics_pages`, `kyliecosmetics_product`, `kyliecosmetics_product_recommendations`, `kyliecosmetics_products`, `kyliecosmetics_search_suggest`, `kyliecosmetics_sitemap_urls`, `kyliecosmetics_sitemaps`, `kyliecosmetics_store`
- **latimes** (4): `latimes_article`, `latimes_author`, `latimes_headlines`, `latimes_sections`
- **lazada** (5): `lazada_categories`, `lazada_category_products`, `lazada_home`, `lazada_product`, `lazada_search`
- **leboncoin** (2): `leboncoin_listing`, `leboncoin_search`
- **letterboxd** (8): `letterboxd_film`, `letterboxd_film_rating_histogram`, `letterboxd_film_reviews`, `letterboxd_film_similar`, `letterboxd_member`, `letterboxd_person`, `letterboxd_popular`, `letterboxd_search`
- **linkedin** (5): `linkedin_company`, `linkedin_product`, `linkedin_product_categories`, `linkedin_products_search`, `linkedin_showcase`
- **livemint** (5): `livemint_article`, `livemint_author`, `livemint_headlines`, `livemint_news`, `livemint_sections`
- **liverpoolecho** (5): `liverpoolecho_article`, `liverpoolecho_author`, `liverpoolecho_headlines`, `liverpoolecho_news`, `liverpoolecho_sections`
- **livescience** (5): `livescience_article`, `livescience_author`, `livescience_headlines`, `livescience_news`, `livescience_sections`
- **livescore** (16): `livescore_competition`, `livescore_competitions`, `livescore_live_scores`, `livescore_match`, `livescore_match_stats`, `livescore_news`, `livescore_news_article`, `livescore_news_categories`, `livescore_news_feed`, `livescore_news_publishers`, `livescore_player`, `livescore_scores`, `livescore_scores_toc`, `livescore_search`, `livescore_sports`, `livescore_team`
- **lululemon** (5): `lululemon_categories`, `lululemon_category`, `lululemon_outfit`, `lululemon_product`, `lululemon_stores`
- **macrumors** (5): `macrumors_article`, `macrumors_author`, `macrumors_headlines`, `macrumors_news`, `macrumors_sections`
- **macys** (3): `macys_product`, `macys_product_reviews`, `macys_suggest`
- **makeuseof** (5): `makeuseof_article`, `makeuseof_author`, `makeuseof_headlines`, `makeuseof_news`, `makeuseof_sections`
- **malaymail** (4): `malaymail_article`, `malaymail_headlines`, `malaymail_news`, `malaymail_sections`
- **manga** (6): `manga_rankings`, `manga_search`, `manga_title`, `manga_title_characters`, `manga_title_recommendations`, `manga_title_staff`
- **marketwatch** (5): `marketwatch_article`, `marketwatch_author`, `marketwatch_headlines`, `marketwatch_news`, `marketwatch_sections`
- **mashable** (5): `mashable_article`, `mashable_author`, `mashable_headlines`, `mashable_news`, `mashable_sections`
- **mcdonalds** (6): `mcdonalds_categories`, `mcdonalds_item`, `mcdonalds_item_list`, `mcdonalds_menu`, `mcdonalds_restaurant_menu`, `mcdonalds_restaurants`
- **mediaite** (5): `mediaite_article`, `mediaite_author`, `mediaite_headlines`, `mediaite_news`, `mediaite_sections`
- **medicalnewstoday** (5): `medicalnewstoday_article`, `medicalnewstoday_author`, `medicalnewstoday_headlines`, `medicalnewstoday_news`, `medicalnewstoday_sections`
- **men** (5): `men_article`, `men_author`, `men_headlines`, `men_news`, `men_sections`
- **mercari** (5): `mercari_autocomplete`, `mercari_home`, `mercari_item`, `mercari_master`, `mercari_search`
- **meta-jobs** (3): `meta_jobs_job`, `meta_jobs_list`, `meta_jobs_search`
- **metacritic** (10): `metacritic_browse`, `metacritic_game`, `metacritic_game_critic_reviews`, `metacritic_game_user_reviews`, `metacritic_movie`, `metacritic_movie_critic_reviews`, `metacritic_movie_user_reviews`, `metacritic_tv`, `metacritic_tv_critic_reviews`, `metacritic_tv_user_reviews`
- **metaculus** (11): `metaculus_category_questions`, `metaculus_comments_feed`, `metaculus_project_questions`, `metaculus_question`, `metaculus_question_forecast_history`, `metaculus_question_forecasts`, `metaculus_question_metadata`, `metaculus_question_options`, `metaculus_questions`, `metaculus_top_comments`, `metaculus_tournament_questions`
- **metro** (5): `metro_article`, `metro_author`, `metro_headlines`, `metro_news`, `metro_sections`
- **microsoftstore** (14): `microsoftstore_categories`, `microsoftstore_category`, `microsoftstore_charts`, `microsoftstore_editorial`, `microsoftstore_events`, `microsoftstore_product`, `microsoftstore_publisher`, `microsoftstore_recommended`, `microsoftstore_related`, `microsoftstore_reviews`, `microsoftstore_reviews_summary`, `microsoftstore_search`, `microsoftstore_spotlight`, `microsoftstore_suggest`
- **mirror** (5): `mirror_article`, `mirror_author`, `mirror_headlines`, `mirror_news`, `mirror_sections`
- **mlb** (66): `mlb_discovery`, `mlb_editorial_feed`, `mlb_game`, `mlb_game_boxscore`, `mlb_game_play_by_play`, `mlb_league_leaders`, `mlb_league_stats`, `mlb_player`, `mlb_player_stats`, `mlb_prospect_rankings`, `mlb_prospect_stats`, `mlb_schedule`, `mlb_search`, `mlb_standings`, `mlb_statcast`, `mlb_statcast_abs_challenges`, `mlb_statcast_active_spin`, `mlb_statcast_arm_angle`, `mlb_statcast_arm_strength`, `mlb_statcast_arm_strength_player`, `mlb_statcast_arm_value`, `mlb_statcast_arm_value_details`, `mlb_statcast_baserunning`, `mlb_statcast_bat_tracking`, `mlb_statcast_batted_ball`, `mlb_statcast_birthday_index`, `mlb_statcast_catcher_blocking`, `mlb_statcast_catcher_blocking_details`, `mlb_statcast_catcher_framing`, `mlb_statcast_catcher_framing_details`, `mlb_statcast_catcher_pop_time`, `mlb_statcast_catcher_stance`, `mlb_statcast_catcher_throwing`, `mlb_statcast_catcher_throwing_details`, `mlb_statcast_expected`, `mlb_statcast_fielding_run_value`, `mlb_statcast_first_base_receiving`, `mlb_statcast_first_base_receiving_details`, `mlb_statcast_home_runs`, `mlb_statcast_home_runs_details`, `mlb_statcast_oaa`, `mlb_statcast_park_factors`, `mlb_statcast_percentile`, `mlb_statcast_pitch_arsenal`, `mlb_statcast_pitch_arsenal_details`, `mlb_statcast_pitch_arsenals`, `mlb_statcast_pitch_movement`, `mlb_statcast_pitch_tempo`, `mlb_statcast_pitch_tempo_player`, `mlb_statcast_pitch_timer`, `mlb_statcast_player_details`, `mlb_statcast_rolling`, `mlb_statcast_run_value`, `mlb_statcast_running_game`, `mlb_statcast_running_game_details`, `mlb_statcast_sprint_speed`, `mlb_statcast_sprint_speed_teams`, `mlb_statcast_swing_path`, `mlb_statcast_swing_timing`, `mlb_statcast_swing_timing_details`, `mlb_statcast_top_performers`, `mlb_statcast_year_to_year`, `mlb_team_roster`, `mlb_team_stats`, `mlb_teams`, `mlb_transactions`
- **mlive** (1): `mlive_news`
- **modaoperandi** (4): `modaoperandi_categories`, `modaoperandi_designers`, `modaoperandi_product`, `modaoperandi_search`
- **moncler** (6): `moncler_categories`, `moncler_category`, `moncler_product`, `moncler_search`, `moncler_stores`, `moncler_suggest`
- **moneycontrol** (5): `moneycontrol_article`, `moneycontrol_author`, `moneycontrol_headlines`, `moneycontrol_news`, `moneycontrol_sections`
- **monitors** (6): `monitors_checks`, `monitors_create`, `monitors_delete`, `monitors_get`, `monitors_list`, `monitors_update`
- **motleyfool** (5): `motleyfool_article`, `motleyfool_author`, `motleyfool_headlines`, `motleyfool_news`, `motleyfool_sections`
- **nationafrica** (5): `nationafrica_article`, `nationafrica_author`, `nationafrica_headlines`, `nationafrica_news`, `nationafrica_sections`
- **national** (5): `national_article`, `national_author`, `national_headlines`, `national_news`, `national_sections`
- **nationalpost** (5): `nationalpost_article`, `nationalpost_author`, `nationalpost_headlines`, `nationalpost_news`, `nationalpost_sections`
- **nbc** (5): `nbc_article`, `nbc_author`, `nbc_headlines`, `nbc_news`, `nbc_sections`
- **ndtv** (12): `ndtv_article`, `ndtv_author`, `ndtv_headlines`, `ndtv_latest_videos`, `ndtv_live_blog`, `ndtv_live_blogs`, `ndtv_news`, `ndtv_search`, `ndtv_sections`, `ndtv_video`, `ndtv_video_categories`, `ndtv_videos`
- **news18** (5): `news18_article`, `news18_author`, `news18_headlines`, `news18_news`, `news18_sections`
- **news24** (4): `news24_article`, `news24_headlines`, `news24_news`, `news24_sections`
- **newscomau** (5): `newscomau_article`, `newscomau_author`, `newscomau_headlines`, `newscomau_news`, `newscomau_sections`
- **newsmax** (5): `newsmax_article`, `newsmax_author`, `newsmax_headlines`, `newsmax_news`, `newsmax_sections`
- **newsweek** (5): `newsweek_article`, `newsweek_author`, `newsweek_headlines`, `newsweek_news`, `newsweek_sections`
- **newyorker** (5): `newyorker_article`, `newyorker_author`, `newyorker_headlines`, `newyorker_news`, `newyorker_sections`
- **nike** (9): `nike_categories`, `nike_product`, `nike_product_availability`, `nike_product_details`, `nike_product_recommendations`, `nike_product_reviews`, `nike_search`, `nike_stores`, `nike_suggest`
- **ninetofivegoogle** (5): `ninetofivegoogle_article`, `ninetofivegoogle_author`, `ninetofivegoogle_headlines`, `ninetofivegoogle_news`, `ninetofivegoogle_sections`
- **ninetofivemac** (5): `ninetofivemac_article`, `ninetofivemac_author`, `ninetofivemac_headlines`, `ninetofivemac_news`, `ninetofivemac_sections`
- **njcom** (1): `njcom_news`
- **npr** (5): `npr_article`, `npr_author`, `npr_categories`, `npr_headlines`, `npr_topic`
- **numbeo** (8): `numbeo_cost_of_living_city`, `numbeo_cost_of_living_country`, `numbeo_cost_of_living_rankings`, `numbeo_cost_of_living_rankings_by_country`, `numbeo_indices_city`, `numbeo_indices_country`, `numbeo_indices_rankings`, `numbeo_indices_rankings_by_country`
- **nydailynews** (5): `nydailynews_article`, `nydailynews_author`, `nydailynews_headlines`, `nydailynews_news`, `nydailynews_sections`
- **nymag** (5): `nymag_article`, `nymag_author`, `nymag_headlines`, `nymag_news`, `nymag_sections`
- **nypost** (5): `nypost_article`, `nypost_author`, `nypost_headlines`, `nypost_news`, `nypost_sections`
- **nyt** (5): `nyt_article`, `nyt_author`, `nyt_categories`, `nyt_headlines`, `nyt_sections`
- **nzherald** (5): `nzherald_article`, `nzherald_author`, `nzherald_headlines`, `nzherald_news`, `nzherald_sections`
- **ohpolly** (11): `ohpolly_collection_products`, `ohpolly_collections`, `ohpolly_page`, `ohpolly_pages`, `ohpolly_product`, `ohpolly_product_recommendations`, `ohpolly_products`, `ohpolly_search_suggest`, `ohpolly_sitemap_urls`, `ohpolly_sitemaps`, `ohpolly_store`
- **oldnavy** (7): `oldnavy_categories`, `oldnavy_category`, `oldnavy_product`, `oldnavy_product_availability`, `oldnavy_product_reviews`, `oldnavy_search`, `oldnavy_stores`
- **opensea** (36): `opensea_activity`, `opensea_categories`, `opensea_chains`, `opensea_collection`, `opensea_collection_activity`, `opensea_collection_best_deals`, `opensea_collection_chart`, `opensea_collection_depth`, `opensea_collection_holders`, `opensea_collection_items`, `opensea_collection_offers`, `opensea_collection_rarest_items`, `opensea_collection_search_items`, `opensea_collection_social_proof`, `opensea_collection_top_sales`, `opensea_collection_trait_offers`, `opensea_collection_traits`, `opensea_collections`, `opensea_drops`, `opensea_item`, `opensea_item_activity`, `opensea_item_chart`, `opensea_item_depth`, `opensea_item_listings`, `opensea_item_offers`, `opensea_item_owners`, `opensea_most_watched`, `opensea_profile`, `opensea_profile_activity`, `opensea_profile_collections`, `opensea_profile_created`, `opensea_profile_items`, `opensea_profile_search_items`, `opensea_rankings`, `opensea_search_collections`, `opensea_top_movers`
- **opentable** (4): `opentable_restaurant`, `opentable_restaurant_menus`, `opentable_restaurant_reviews`, `opentable_search`
- **otto** (3): `otto_categories`, `otto_product`, `otto_search`
- **pagesix** (5): `pagesix_article`, `pagesix_author`, `pagesix_headlines`, `pagesix_news`, `pagesix_sections`
- **pandamart** (6): `pandamart_search`, `pandamart_store`, `pandamart_store_categories`, `pandamart_store_product`, `pandamart_store_products`, `pandamart_store_search`
- **panera** (13): `panera_at_work_locations`, `panera_cafe`, `panera_catering_delivery_info`, `panera_catering_menu`, `panera_geocode`, `panera_item_detail`, `panera_item_options`, `panera_locations`, `panera_menu`, `panera_quantity_rules`, `panera_retired_products`, `panera_time_slots`, `panera_upsell_suggestions`
- **papajohns** (23): `papajohns_allergens`, `papajohns_colombia_menu`, `papajohns_deals`, `papajohns_directory`, `papajohns_elsalvador_menu`, `papajohns_india_deal`, `papajohns_india_menu`, `papajohns_india_menu_item`, `papajohns_india_stores`, `papajohns_intl_deals`, `papajohns_intl_ingredients`, `papajohns_intl_menu`, `papajohns_intl_offer`, `papajohns_intl_product`, `papajohns_intl_stores`, `papajohns_menu`, `papajohns_menu_item`, `papajohns_nearby`, `papajohns_nutrition`, `papajohns_peru_menu`, `papajohns_poland_menu`, `papajohns_russia_menu`, `papajohns_store`
- **patreon** (4): `patreon_creator`, `patreon_creator_tiers`, `patreon_explore`, `patreon_rss`
- **pcgamer** (5): `pcgamer_article`, `pcgamer_author`, `pcgamer_headlines`, `pcgamer_news`, `pcgamer_sections`
- **pcmag** (5): `pcmag_article`, `pcmag_author`, `pcmag_headlines`, `pcmag_news`, `pcmag_sections`
- **people** (5): `people_article`, `people_author`, `people_headlines`, `people_news`, `people_sections`
- **phillyinquirer** (5): `phillyinquirer_article`, `phillyinquirer_author`, `phillyinquirer_headlines`, `phillyinquirer_news`, `phillyinquirer_sections`
- **philstar** (5): `philstar_article`, `philstar_author`, `philstar_headlines`, `philstar_news`, `philstar_sections`
- **phonearena** (5): `phonearena_article`, `phonearena_author`, `phonearena_headlines`, `phonearena_news`, `phonearena_sections`
- **physorg** (4): `physorg_article`, `physorg_headlines`, `physorg_news`, `physorg_sections`
- **pinterest** (8): `pinterest_board`, `pinterest_categories`, `pinterest_idea`, `pinterest_pin`, `pinterest_search`, `pinterest_user`, `pinterest_user_boards`, `pinterest_user_pins`
- **pitchbook** (5): `pitchbook_advisor`, `pitchbook_company`, `pitchbook_fund`, `pitchbook_investor`, `pitchbook_limited_partner`
- **pizzahut** (6): `pizzahut_bundle_choices`, `pizzahut_delivery_estimate`, `pizzahut_menu`, `pizzahut_modifiers`, `pizzahut_store`, `pizzahut_stores`
- **playstation** (10): `playstation_browse`, `playstation_category`, `playstation_concept`, `playstation_concept_reviews`, `playstation_deals`, `playstation_latest`, `playstation_page`, `playstation_product`, `playstation_search`, `playstation_suggest`
- **politico** (5): `politico_article`, `politico_author`, `politico_categories`, `politico_headlines`, `politico_topic`
- **polygon** (5): `polygon_article`, `polygon_author`, `polygon_headlines`, `polygon_news`, `polygon_sections`
- **polymarket** (30): `polymarket_activity_trades`, `polymarket_clob_market`, `polymarket_dashboard_macro`, `polymarket_event_detail`, `polymarket_event_tags`, `polymarket_events`, `polymarket_events_similar`, `polymarket_homepage_feed`, `polymarket_leaderboard`, `polymarket_market_detail`, `polymarket_market_liquidity`, `polymarket_market_tags`, `polymarket_markets`, `polymarket_predictions`, `polymarket_public_data`, `polymarket_related_tags`, `polymarket_rewards_market`, `polymarket_rewards_markets`, `polymarket_search`, `polymarket_tag`, `polymarket_tags`, `polymarket_token_midpoint`, `polymarket_token_orderbook`, `polymarket_token_price`, `polymarket_token_price_history`, `polymarket_token_spread`, `polymarket_tokens_midpoints`, `polymarket_tokens_orderbooks`, `polymarket_tokens_prices`, `polymarket_tokens_spreads`
- **popeyes** (8): `popeyes_faq`, `popeyes_location`, `popeyes_locations`, `popeyes_menu`, `popeyes_offers`, `popeyes_promotions`, `popeyes_quests`, `popeyes_rewards`
- **popularmechanics** (1): `popularmechanics_news`
- **poshmark** (8): `poshmark_brand`, `poshmark_brands`, `poshmark_categories`, `poshmark_category`, `poshmark_closet`, `poshmark_listing`, `poshmark_search`, `poshmark_trend`
- **prada** (6): `prada_categories`, `prada_category`, `prada_product`, `prada_search`, `prada_stores`, `prada_suggest`
- **pristine-auction** (3): `pristine_auction_categories`, `pristine_auction_lot`, `pristine_auction_search`
- **pristine-marketplace** (13): `pristine_marketplace_collection_products`, `pristine_marketplace_collections`, `pristine_marketplace_page`, `pristine_marketplace_pages`, `pristine_marketplace_product`, `pristine_marketplace_product_recommendations`, `pristine_marketplace_products`, `pristine_marketplace_reviews`, `pristine_marketplace_search`, `pristine_marketplace_search_suggest`, `pristine_marketplace_sitemap_urls`, `pristine_marketplace_sitemaps`, `pristine_marketplace_store`
- **producthunt** (11): `producthunt_about`, `producthunt_alternatives`, `producthunt_category`, `producthunt_category_products`, `producthunt_customers`, `producthunt_launches`, `producthunt_leaderboard`, `producthunt_makers`, `producthunt_product`, `producthunt_reviews`, `producthunt_search`
- **propublica** (5): `propublica_article`, `propublica_author`, `propublica_headlines`, `propublica_news`, `propublica_sections`
- **psa** (19): `psa_autographfacts_categories`, `psa_autographfacts_gallery`, `psa_autographfacts_subject`, `psa_autographfacts_subjects`, `psa_cardfacts_categories`, `psa_cardfacts_checklist`, `psa_cardfacts_sets`, `psa_cert_lookup`, `psa_price_guide_categories`, `psa_price_guide_search`, `psa_price_guide_set`, `psa_probatfacts_categories`, `psa_probatfacts_gallery`, `psa_probatfacts_subject`, `psa_probatfacts_subjects`, `psa_ticketfacts_categories`, `psa_ticketfacts_gallery`, `psa_ticketfacts_subject`, `psa_ticketfacts_subjects`
- **psastore** (11): `psastore_collection_products`, `psastore_collections`, `psastore_page`, `psastore_pages`, `psastore_product`, `psastore_product_recommendations`, `psastore_products`, `psastore_search_suggest`, `psastore_sitemap_urls`, `psastore_sitemaps`, `psastore_store`
- **punch** (5): `punch_article`, `punch_author`, `punch_headlines`, `punch_news`, `punch_sections`
- **quince** (9): `quince_categories`, `quince_navigation`, `quince_product`, `quince_product_faq`, `quince_product_reviews`, `quince_search`, `quince_sitemap_urls`, `quince_sitemaps`, `quince_suggest`
- **qwant** (1): `qwant_suggest`
- **raisingcanes** (6): `raisingcanes_directory`, `raisingcanes_menu`, `raisingcanes_nearby`, `raisingcanes_promotion`, `raisingcanes_promotions`, `raisingcanes_store`
- **rappler** (5): `rappler_article`, `rappler_author`, `rappler_headlines`, `rappler_news`, `rappler_sections`
- **rawstory** (5): `rawstory_article`, `rawstory_author`, `rawstory_headlines`, `rawstory_news`, `rawstory_sections`
- **rebag** (12): `rebag_collection_products`, `rebag_collections`, `rebag_page`, `rebag_pages`, `rebag_product`, `rebag_product_recommendations`, `rebag_products`, `rebag_search`, `rebag_search_suggest`, `rebag_sitemap_urls`, `rebag_sitemaps`, `rebag_store`
- **reddit** (12): `reddit_comments`, `reddit_domain_posts`, `reddit_leads`, `reddit_post`, `reddit_search`, `reddit_subreddit_about`, `reddit_subreddit_comments`, `reddit_subreddit_posts`, `reddit_subreddits_posts`, `reddit_trends`, `reddit_user_comments`, `reddit_user_posts`
- **redfin** (5): `redfin_estimate`, `redfin_property`, `redfin_region_trends`, `redfin_search`, `redfin_similar`
- **research** (10): `research_cancel`, `research_events`, `research_inspect_paper`, `research_read_paper`, `research_related_papers`, `research_results`, `research_search_papers`, `research_sources`, `research_start`, `research_status`
- **resy** (7): `resy_availability`, `resy_cuisines`, `resy_event_detail`, `resy_events`, `resy_locations`, `resy_restaurant`, `resy_search`
- **retailmenot** (13): `retailmenot_autocomplete`, `retailmenot_blog_categories`, `retailmenot_blog_post`, `retailmenot_blog_posts`, `retailmenot_blog_tags`, `retailmenot_cashback`, `retailmenot_categories`, `retailmenot_category`, `retailmenot_deal_event`, `retailmenot_deal_events`, `retailmenot_home`, `retailmenot_store`, `retailmenot_stores`
- **reuters** (6): `reuters_article`, `reuters_articles`, `reuters_author`, `reuters_news`, `reuters_section`, `reuters_sections`
- **reverb** (8): `reverb_categories`, `reverb_listing`, `reverb_makes`, `reverb_price_guide`, `reverb_price_guide_search`, `reverb_search`, `reverb_shop`, `reverb_shop_feedback`
- **rightmove** (8): `rightmove_agent_branch`, `rightmove_agents`, `rightmove_autocomplete`, `rightmove_commercial_search`, `rightmove_new_homes_search`, `rightmove_property`, `rightmove_search`, `rightmove_student_search`
- **rnz** (5): `rnz_article`, `rnz_author`, `rnz_headlines`, `rnz_news`, `rnz_sections`
- **roblox** (4): `roblox_badges`, `roblox_game`, `roblox_rankings`, `roblox_search`
- **rollingstone** (5): `rollingstone_article`, `rollingstone_author`, `rollingstone_headlines`, `rollingstone_news`, `rollingstone_sections`
- **rothys** (11): `rothys_collection_products`, `rothys_collections`, `rothys_page`, `rothys_pages`, `rothys_product`, `rothys_product_recommendations`, `rothys_products`, `rothys_search_suggest`, `rothys_sitemap_urls`, `rothys_sitemaps`, `rothys_store`
- **rottentomatoes** (20): `rottentomatoes_browse_filters`, `rottentomatoes_browse_movies`, `rottentomatoes_browse_tv`, `rottentomatoes_critics_authors`, `rottentomatoes_editorial_content`, `rottentomatoes_editorial_detail`, `rottentomatoes_editorial_search`, `rottentomatoes_editorial_section`, `rottentomatoes_editorial_taxonomies`, `rottentomatoes_editorial_terms`, `rottentomatoes_editorial_types`, `rottentomatoes_episode`, `rottentomatoes_movie`, `rottentomatoes_movie_reviews`, `rottentomatoes_person`, `rottentomatoes_search`, `rottentomatoes_season`, `rottentomatoes_series`, `rottentomatoes_sitemap_urls`, `rottentomatoes_sitemaps`
- **rover** (4): `rover_sitter_profile`, `rover_sitter_search`, `rover_trainer_profile`, `rover_trainer_search`
- **rte** (5): `rte_article`, `rte_author`, `rte_headlines`, `rte_news`, `rte_sections`
- **salon** (5): `salon_article`, `salon_author`, `salon_headlines`, `salon_news`, `salon_sections`
- **samsclub** (5): `samsclub_category`, `samsclub_content`, `samsclub_departments`, `samsclub_product`, `samsclub_product_related`
- **sbsnews** (5): `sbsnews_article`, `sbsnews_author`, `sbsnews_headlines`, `sbsnews_news`, `sbsnews_sections`
- **sciencealert** (5): `sciencealert_article`, `sciencealert_author`, `sciencealert_headlines`, `sciencealert_news`, `sciencealert_sections`
- **scmp** (4): `scmp_article`, `scmp_author`, `scmp_headlines`, `scmp_sections`
- **screenrant** (5): `screenrant_article`, `screenrant_author`, `screenrant_headlines`, `screenrant_news`, `screenrant_sections`
- **seatgeek** (11): `seatgeek_categories`, `seatgeek_cities`, `seatgeek_event`, `seatgeek_events_by_category`, `seatgeek_events_near`, `seatgeek_performer`, `seatgeek_performer_events`, `seatgeek_search`, `seatgeek_trending`, `seatgeek_venue`, `seatgeek_venue_events`
- **seattletimes** (5): `seattletimes_article`, `seattletimes_author`, `seattletimes_headlines`, `seattletimes_news`, `seattletimes_sections`
- **sec** (10): `sec_company_intelligence`, `sec_company_search`, `sec_company_submissions`, `sec_filing`, `sec_filing_sections`, `sec_financials`, `sec_frames`, `sec_full_text_search`, `sec_insider`, `sec_institutional_holdings`
- **sephora** (9): `sephora_brands`, `sephora_categories`, `sephora_category`, `sephora_product`, `sephora_product_questions`, `sephora_product_reviews`, `sephora_search`, `sephora_stores`, `sephora_suggest`
- **sevennewsau** (5): `sevennewsau_article`, `sevennewsau_author`, `sevennewsau_headlines`, `sevennewsau_news`, `sevennewsau_sections`
- **sfgate** (5): `sfgate_article`, `sfgate_author`, `sfgate_headlines`, `sfgate_news`, `sfgate_sections`
- **shakeshack** (4): `shakeshack_locations`, `shakeshack_menu`, `shakeshack_nearby`, `shakeshack_store`
- **shein** (8): `shein_category_filters`, `shein_category_goods`, `shein_category_nav`, `shein_products_aggregation_filters`, `shein_products_detail`, `shein_products_search`, `shein_search_autocomplete`, `shein_search_keywords`
- **shop-app** (16): `shop_app_analysis`, `shop_app_categories`, `shop_app_collection_products`, `shop_app_product`, `shop_app_product_related`, `shop_app_product_reviews`, `shop_app_product_shop`, `shop_app_product_variant`, `shop_app_product_variants`, `shop_app_search`, `shop_app_shop`, `shop_app_shop_locations`, `shop_app_shop_products`, `shop_app_shop_reviews`, `shop_app_shop_typeahead`, `shop_app_suggestions`
- **shopify** (11): `shopify_collection_products`, `shopify_collections`, `shopify_page`, `shopify_pages`, `shopify_product`, `shopify_product_recommendations`, `shopify_products`, `shopify_search_suggest`, `shopify_sitemap_urls`, `shopify_sitemaps`, `shopify_store`
- **similarweb** (2): `similarweb_search`, `similarweb_web`
- **skims** (11): `skims_collection_products`, `skims_collections`, `skims_page`, `skims_pages`, `skims_product`, `skims_product_recommendations`, `skims_products`, `skims_search_suggest`, `skims_sitemap_urls`, `skims_sitemaps`, `skims_store`
- **skynews** (7): `skynews_article`, `skynews_author`, `skynews_headlines`, `skynews_news`, `skynews_sections`, `skynews_video`, `skynews_videos`
- **skysports** (5): `skysports_article`, `skysports_author`, `skysports_headlines`, `skysports_news`, `skysports_sections`
- **slate** (3): `slate_article`, `slate_categories`, `slate_headlines`
- **slickdeals** (11): `slickdeals_categories`, `slickdeals_category`, `slickdeals_comments`, `slickdeals_deal`, `slickdeals_deal_types`, `slickdeals_forums`, `slickdeals_frontpage`, `slickdeals_primary_categories`, `slickdeals_primary_category`, `slickdeals_search`, `slickdeals_search_advanced`
- **sloanreview** (5): `sloanreview_article`, `sloanreview_articles`, `sloanreview_categories`, `sloanreview_headlines`, `sloanreview_topic`
- **smh** (5): `smh_article`, `smh_author`, `smh_headlines`, `smh_news`, `smh_sections`
- **sofascore** (109): `sofascore_categories`, `sofascore_category_tournaments`, `sofascore_draft`, `sofascore_draft_picks`, `sofascore_esports_game`, `sofascore_event`, `sofascore_event_at_bat_pitches`, `sofascore_event_at_bats`, `sofascore_event_average_positions`, `sofascore_event_baseball_top_performers`, `sofascore_event_best_players`, `sofascore_event_comments`, `sofascore_event_esports_games`, `sofascore_event_graph`, `sofascore_event_h2h`, `sofascore_event_highlights`, `sofascore_event_incidents`, `sofascore_event_innings`, `sofascore_event_lineups`, `sofascore_event_managers`, `sofascore_event_odds`, `sofascore_event_player_heatmap`, `sofascore_event_player_statistics`, `sofascore_event_point_by_point`, `sofascore_event_pregame_form`, `sofascore_event_shotmap`, `sofascore_event_statistics`, `sofascore_event_team_heatmap`, `sofascore_event_team_streaks`, `sofascore_event_tennis_power`, `sofascore_event_tv_channels`, `sofascore_event_votes`, `sofascore_live_events`, `sofascore_manager`, `sofascore_manager_events`, `sofascore_mma_card`, `sofascore_mma_schedule`, `sofascore_odds_dropping`, `sofascore_odds_winning`, `sofascore_player`, `sofascore_player_attributes`, `sofascore_player_events`, `sofascore_player_last_year_summary`, `sofascore_player_national_team_statistics`, `sofascore_player_penalty_history`, `sofascore_player_ratings`, `sofascore_player_season_heatmap`, `sofascore_player_season_statistics`, `sofascore_player_statistical_rankings`, `sofascore_player_statistics_seasons`, `sofascore_player_tournaments`, `sofascore_player_transfers`, `sofascore_ranking_types`, `sofascore_rankings`, `sofascore_referee`, `sofascore_referee_events`, `sofascore_referee_statistics`, `sofascore_round_events`, `sofascore_scheduled_events`, `sofascore_scheduled_tournaments`, `sofascore_search`, `sofascore_search_typed`, `sofascore_season_events`, `sofascore_sports`, `sofascore_stage`, `sofascore_stage_categories`, `sofascore_stage_driver_performance`, `sofascore_stage_featured`, `sofascore_stage_schedule`, `sofascore_stage_seasons`, `sofascore_stage_standings`, `sofascore_stage_substages`, `sofascore_standings`, `sofascore_team`, `sofascore_team_achievements`, `sofascore_team_events`, `sofascore_team_goal_distributions`, `sofascore_team_near_events`, `sofascore_team_of_the_week`, `sofascore_team_of_the_week_periods`, `sofascore_team_performance`, `sofascore_team_player_statistics`, `sofascore_team_player_statistics_seasons`, `sofascore_team_players`, `sofascore_team_rankings`, `sofascore_team_season_statistics`, `sofascore_team_statistics_seasons`, `sofascore_team_top_players`, `sofascore_team_tournaments`, `sofascore_team_transfers`, `sofascore_tennis_player_grand_slam_results`, `sofascore_tournament_cuptree`, `sofascore_tournament_info`, `sofascore_tournament_player_of_the_season`, `sofascore_tournament_player_statistics`, `sofascore_tournament_rounds`, `sofascore_tournament_seasons`, `sofascore_tournament_statistics_info`, `sofascore_tournament_team_of_the_season`, `sofascore_tournament_teams`, `sofascore_tournament_top_players`, `sofascore_tournament_top_teams`, `sofascore_tournament_venues`, `sofascore_tournament_winners`, `sofascore_tournaments_with_feature`, `sofascore_trending_events`, `sofascore_trending_players`, `sofascore_venue`, `sofascore_venue_events`
- **sonic** (12): `sonic_availability`, `sonic_categories`, `sonic_deals`, `sonic_directory`, `sonic_item`, `sonic_location_suggest`, `sonic_locations`, `sonic_menu`, `sonic_nearby`, `sonic_nutrition_documents`, `sonic_sitemap`, `sonic_store`
- **soundcloud** (5): `soundcloud_playlist`, `soundcloud_profile`, `soundcloud_search`, `soundcloud_track`, `soundcloud_user_tracks`
- **space** (5): `space_article`, `space_author`, `space_headlines`, `space_news`, `space_sections`
- **sparkfun** (4): `sparkfun_categories`, `sparkfun_category`, `sparkfun_product`, `sparkfun_search`
- **sportingnews** (5): `sportingnews_article`, `sportingnews_author`, `sportingnews_headlines`, `sportingnews_news`, `sportingnews_sections`
- **sportskeeda** (48): `sportskeeda_article`, `sportskeeda_author`, `sportskeeda_college_basketball_schedule`, `sportskeeda_college_basketball_schedule_options`, `sportskeeda_cricket_commentary`, `sportskeeda_cricket_match`, `sportskeeda_depth_chart`, `sportskeeda_draft_picks`, `sportskeeda_draft_picks_options`, `sportskeeda_event_calendar`, `sportskeeda_event_calendar_options`, `sportskeeda_feed`, `sportskeeda_football_data`, `sportskeeda_football_options`, `sportskeeda_guessing_game`, `sportskeeda_guessing_game_entities`, `sportskeeda_guessing_games`, `sportskeeda_nba_queries`, `sportskeeda_news`, `sportskeeda_page_data`, `sportskeeda_page_options`, `sportskeeda_player_stats`, `sportskeeda_profile`, `sportskeeda_quiz`, `sportskeeda_quiz_categories`, `sportskeeda_quizzes`, `sportskeeda_salary_cap`, `sportskeeda_schedule`, `sportskeeda_sections`, `sportskeeda_sitemap_items`, `sportskeeda_sitemaps`, `sportskeeda_standings`, `sportskeeda_standings_options`, `sportskeeda_taxonomy_search`, `sportskeeda_topic`, `sportskeeda_trade_values`, `sportskeeda_transactions`, `sportskeeda_transactions_options`, `sportskeeda_video`, `sportskeeda_videos`, `sportskeeda_wiki_activity`, `sportskeeda_wiki_article`, `sportskeeda_wiki_categories`, `sportskeeda_wiki_contributors`, `sportskeeda_wiki_issues`, `sportskeeda_wiki_options`, `sportskeeda_wiki_pages`, `sportskeeda_wiki_summary`
- **spotify** (30): `spotify_album`, `spotify_album_tracks`, `spotify_albums_search`, `spotify_artist`, `spotify_artist_albums`, `spotify_artist_playlists`, `spotify_artist_related`, `spotify_artists_search`, `spotify_audiobook`, `spotify_audiobook_chapters`, `spotify_audiobooks_search`, `spotify_chapter`, `spotify_episodes_search`, `spotify_featured_charts_by_country`, `spotify_genre`, `spotify_home`, `spotify_playlist`, `spotify_playlists_search`, `spotify_popular_by_country`, `spotify_profile`, `spotify_profile_followers`, `spotify_profile_playlists`, `spotify_profiles_search`, `spotify_search`, `spotify_section`, `spotify_shows_search`, `spotify_track`, `spotify_track_recommended`, `spotify_track_similar_albums`, `spotify_tracks_search`
- **spotify-podcasts** (8): `spotify_podcasts_categories`, `spotify_podcasts_charts`, `spotify_podcasts_episode`, `spotify_podcasts_home`, `spotify_podcasts_search`, `spotify_podcasts_show`, `spotify_podcasts_show_episodes`, `spotify_podcasts_show_recommendations`
- **standard** (5): `standard_article`, `standard_author`, `standard_headlines`, `standard_news`, `standard_sections`
- **starbucks** (5): `starbucks_menu`, `starbucks_nearest_store`, `starbucks_nutrition`, `starbucks_product`, `starbucks_stores`
- **startpage** (1): `startpage_suggest`
- **startribune** (1): `startribune_news`
- **steam** (21): `steam_achievements`, `steam_app`, `steam_category`, `steam_charts_concurrent`, `steam_charts_most_played`, `steam_charts_top_releases`, `steam_community_recommendations`, `steam_featured`, `steam_featured_categories`, `steam_items`, `steam_news`, `steam_package`, `steam_players`, `steam_reviews`, `steam_reviews_histogram`, `steam_search`, `steam_search_results`, `steam_steamspy`, `steam_tags`, `steam_tags_list`, `steam_top_sellers`
- **stevemadden** (11): `stevemadden_collection_products`, `stevemadden_collections`, `stevemadden_page`, `stevemadden_pages`, `stevemadden_product`, `stevemadden_product_recommendations`, `stevemadden_products`, `stevemadden_search_suggest`, `stevemadden_sitemap_urls`, `stevemadden_sitemaps`, `stevemadden_store`
- **stockx** (5): `stockx_brands`, `stockx_categories`, `stockx_product`, `stockx_releases`, `stockx_search`
- **straitstimes** (5): `straitstimes_article`, `straitstimes_author`, `straitstimes_headlines`, `straitstimes_news`, `straitstimes_sections`
- **strava** (4): `strava_challenges`, `strava_club`, `strava_route_detail`, `strava_routes`
- **streeteasy** (11): `streeteasy_areas`, `streeteasy_building`, `streeteasy_market_data_catalog`, `streeteasy_market_data_series`, `streeteasy_market_indices`, `streeteasy_market_inventory`, `streeteasy_quick_search`, `streeteasy_rentals_search`, `streeteasy_sales_search`, `streeteasy_school`, `streeteasy_unit`
- **stubhub** (11): `stubhub_carousel`, `stubhub_categories`, `stubhub_category_events`, `stubhub_explore`, `stubhub_navigation_categories`, `stubhub_performer_events`, `stubhub_search`, `stubhub_suggested_searches`, `stubhub_trending`, `stubhub_trending_events`, `stubhub_venue_events`
- **stuff** (5): `stuff_article`, `stuff_author`, `stuff_headlines`, `stuff_news`, `stuff_sections`
- **substack** (19): `substack_categories`, `substack_category`, `substack_explore`, `substack_leaderboard`, `substack_note`, `substack_note_replies`, `substack_note_restacks`, `substack_notes`, `substack_notes_tabs`, `substack_post`, `substack_publication`, `substack_publication_contributors`, `substack_publication_posts`, `substack_publication_recommendations`, `substack_search`, `substack_user`, `substack_user_activity`, `substack_user_connections`, `substack_user_search`
- **subway** (6): `subway_available_times`, `subway_combos`, `subway_menu`, `subway_nearby`, `subway_sitemap`, `subway_store`
- **sun** (5): `sun_article`, `sun_author`, `sun_headlines`, `sun_news`, `sun_sections`
- **swiggy** (4): `swiggy_collections`, `swiggy_restaurant`, `swiggy_restaurant_menu`, `swiggy_search`
- **taco-bell** (8): `taco_bell_app_menu`, `taco_bell_categories`, `taco_bell_menu`, `taco_bell_nutrition`, `taco_bell_product`, `taco_bell_store`, `taco_bell_store_menu`, `taco_bell_stores`
- **target** (8): `target_categories`, `target_category_products`, `target_filter_options`, `target_product`, `target_questions`, `target_reviews`, `target_search`, `target_stores`
- **techcrunch** (5): `techcrunch_article`, `techcrunch_author`, `techcrunch_headlines`, `techcrunch_news`, `techcrunch_sections`
- **techradar** (5): `techradar_article`, `techradar_author`, `techradar_headlines`, `techradar_news`, `techradar_sections`
- **telegraph** (5): `telegraph_article`, `telegraph_author`, `telegraph_headlines`, `telegraph_news`, `telegraph_sections`
- **tes** (7): `tes_job_detail`, `tes_job_employer`, `tes_job_search`, `tes_resource_detail`, `tes_resource_search`, `tes_resource_shop`, `tes_school_search`
- **tesla-jobs** (2): `tesla_jobs_job`, `tesla_jobs_list`
- **theage** (5): `theage_article`, `theage_author`, `theage_headlines`, `theage_news`, `theage_sections`
- **theatlantic** (4): `theatlantic_article`, `theatlantic_author`, `theatlantic_headlines`, `theatlantic_sections`
- **theblaze** (5): `theblaze_article`, `theblaze_author`, `theblaze_headlines`, `theblaze_news`, `theblaze_sections`
- **thebodyshop** (11): `thebodyshop_collection_products`, `thebodyshop_collections`, `thebodyshop_page`, `thebodyshop_pages`, `thebodyshop_product`, `thebodyshop_product_recommendations`, `thebodyshop_products`, `thebodyshop_search_suggest`, `thebodyshop_sitemap_urls`, `thebodyshop_sitemaps`, `thebodyshop_store`
- **thedailybeast** (5): `thedailybeast_article`, `thedailybeast_author`, `thedailybeast_headlines`, `thedailybeast_news`, `thedailybeast_sections`
- **thehill** (5): `thehill_article`, `thehill_author`, `thehill_headlines`, `thehill_news`, `thehill_sections`
- **thehindu** (5): `thehindu_article`, `thehindu_author`, `thehindu_headlines`, `thehindu_news`, `thehindu_sections`
- **thejournal** (5): `thejournal_article`, `thejournal_author`, `thejournal_headlines`, `thejournal_news`, `thejournal_sections`
- **thenextweb** (5): `thenextweb_article`, `thenextweb_author`, `thenextweb_headlines`, `thenextweb_news`, `thenextweb_sections`
- **therealreal** (11): `therealreal_autocomplete`, `therealreal_categories`, `therealreal_category`, `therealreal_collection`, `therealreal_collections`, `therealreal_conditions`, `therealreal_designer`, `therealreal_designers`, `therealreal_listing`, `therealreal_search`, `therealreal_similar`
- **thestarmy** (5): `thestarmy_article`, `thestarmy_author`, `thestarmy_headlines`, `thestarmy_news`, `thestarmy_sections`
- **theverge** (5): `theverge_article`, `theverge_author`, `theverge_headlines`, `theverge_news`, `theverge_sections`
- **thisismoney** (5): `thisismoney_article`, `thisismoney_author`, `thisismoney_headlines`, `thisismoney_news`, `thisismoney_sections`
- **threads** (10): `threads_post`, `threads_post_replies`, `threads_profile`, `threads_profile_media`, `threads_profile_posts`, `threads_profile_replies`, `threads_profile_reposts`, `threads_profile_topics`, `threads_search`, `threads_topic_search`
- **ticketmaster** (15): `ticketmaster_attraction`, `ticketmaster_attraction_events`, `ticketmaster_attraction_related`, `ticketmaster_attraction_reviews`, `ticketmaster_discover_categories`, `ticketmaster_discover_category_events`, `ticketmaster_discover_cities`, `ticketmaster_discover_city_events`, `ticketmaster_event`, `ticketmaster_search_events`, `ticketmaster_suggest`, `ticketmaster_trending_attractions`, `ticketmaster_venue`, `ticketmaster_venue_enhanced_details`, `ticketmaster_venue_events`
- **ticketweb** (3): `ticketweb_event`, `ticketweb_search`, `ticketweb_venue`
- **tiffany** (8): `tiffany_categories`, `tiffany_category`, `tiffany_content_search`, `tiffany_filters`, `tiffany_product`, `tiffany_search`, `tiffany_stores`, `tiffany_suggest`
- **tiktok** (45): `tiktok_category`, `tiktok_challenge`, `tiktok_challenge_list`, `tiktok_comments`, `tiktok_creative_center_filters`, `tiktok_creative_center_hashtags`, `tiktok_creative_center_top_content`, `tiktok_creative_center_videos`, `tiktok_explore`, `tiktok_mobile_feed`, `tiktok_mobile_hashtag`, `tiktok_mobile_hashtag_posts`, `tiktok_mobile_hashtags`, `tiktok_mobile_live_effects`, `tiktok_mobile_live_gifts`, `tiktok_mobile_live_search`, `tiktok_mobile_music_beats`, `tiktok_mobile_music_collections`, `tiktok_mobile_music_pick`, `tiktok_mobile_music_posts`, `tiktok_mobile_music_related`, `tiktok_mobile_music_trending`, `tiktok_mobile_search`, `tiktok_mobile_search_music`, `tiktok_mobile_search_user`, `tiktok_mobile_trending_categories`, `tiktok_mobile_trending_effects`, `tiktok_popular_trend_country_industry_meta`, `tiktok_post`, `tiktok_posts`, `tiktok_profile`, `tiktok_search`, `tiktok_search_hashtag`, `tiktok_search_user`, `tiktok_top_ads_analysis`, `tiktok_top_ads_detail`, `tiktok_top_ads_filters`, `tiktok_top_ads_list`, `tiktok_top_ads_location_info`, `tiktok_top_ads_locations`, `tiktok_top_ads_recommend`, `tiktok_top_ads_safety`, `tiktok_top_ads_spotlight`, `tiktok_top_ads_suggestions`, `tiktok_trending`
- **time** (5): `time_article`, `time_author`, `time_headlines`, `time_news`, `time_sections`
- **timeslive** (4): `timeslive_article`, `timeslive_headlines`, `timeslive_news`, `timeslive_sections`
- **timesofindia** (5): `timesofindia_article`, `timesofindia_author`, `timesofindia_headlines`, `timesofindia_news`, `timesofindia_sections`
- **timesofisrael** (5): `timesofisrael_article`, `timesofisrael_author`, `timesofisrael_headlines`, `timesofisrael_news`, `timesofisrael_sections`
- **tmdb** (9): `tmdb_collection`, `tmdb_genres`, `tmdb_movie`, `tmdb_movie_list`, `tmdb_person`, `tmdb_person_list`, `tmdb_search`, `tmdb_tv`, `tmdb_tv_list`
- **tmz** (5): `tmz_article`, `tmz_author`, `tmz_headlines`, `tmz_news`, `tmz_sections`
- **tokopedia** (8): `tokopedia_autocomplete`, `tokopedia_category`, `tokopedia_home`, `tokopedia_home_tabs`, `tokopedia_product`, `tokopedia_product_review_filters`, `tokopedia_search`, `tokopedia_search_filters`
- **tomsguide** (5): `tomsguide_article`, `tomsguide_author`, `tomsguide_headlines`, `tomsguide_news`, `tomsguide_sections`
- **tomshardware** (5): `tomshardware_article`, `tomshardware_author`, `tomshardware_headlines`, `tomshardware_news`, `tomshardware_sections`
- **torontostar** (5): `torontostar_article`, `torontostar_author`, `torontostar_headlines`, `torontostar_news`, `torontostar_sections`
- **townhall** (5): `townhall_article`, `townhall_author`, `townhall_headlines`, `townhall_news`, `townhall_sections`
- **tripadvisor** (6): `tripadvisor_autocomplete`, `tripadvisor_enums`, `tripadvisor_hotels`, `tripadvisor_place`, `tripadvisor_reviews`, `tripadvisor_search`
- **tripcom** (2): `tripcom_hotel_detail`, `tripcom_hotels_search`
- **trustmrr** (7): `trustmrr_acquire`, `trustmrr_categories`, `trustmrr_category`, `trustmrr_leaderboard`, `trustmrr_marketplace`, `trustmrr_startup`, `trustmrr_startups`
- **trustpilot** (7): `trustpilot_business`, `trustpilot_business_related`, `trustpilot_business_reviews`, `trustpilot_business_search`, `trustpilot_categories`, `trustpilot_category`, `trustpilot_category_search`
- **twitch** (9): `twitch_channel`, `twitch_clips`, `twitch_schedule`, `twitch_search`, `twitch_streams`, `twitch_team`, `twitch_top_games`, `twitch_videos`, `twitch_vod_comments`
- **ubereats** (5): `ubereats_feed`, `ubereats_search`, `ubereats_store`, `ubereats_store_menu`, `ubereats_store_reviews`
- **ulta** (8): `ulta_categories`, `ulta_category`, `ulta_product`, `ulta_product_questions`, `ulta_product_reviews`, `ulta_search`, `ulta_stores`, `ulta_suggest`
- **upwork** (3): `upwork_freelancer`, `upwork_job`, `upwork_search`
- **usage** (5): `usage_endpoints`, `usage_overview`, `usage_platform_adjacency`, `usage_recent_ips`, `usage_timeseries`
- **usatoday** (5): `usatoday_article`, `usatoday_author`, `usatoday_headlines`, `usatoday_news`, `usatoday_sections`
- **usmagazine** (5): `usmagazine_article`, `usmagazine_author`, `usmagazine_headlines`, `usmagazine_news`, `usmagazine_sections`
- **usptoppubs** (2): `usptoppubs_detail`, `usptoppubs_search`
- **vanguardng** (5): `vanguardng_article`, `vanguardng_author`, `vanguardng_headlines`, `vanguardng_news`, `vanguardng_sections`
- **vanityfair** (5): `vanityfair_article`, `vanityfair_author`, `vanityfair_headlines`, `vanityfair_news`, `vanityfair_sections`
- **variety** (5): `variety_article`, `variety_author`, `variety_headlines`, `variety_news`, `variety_sections`
- **vestiaire** (8): `vestiaire_brands`, `vestiaire_categories`, `vestiaire_conditions`, `vestiaire_product`, `vestiaire_search`, `vestiaire_search_sellers`, `vestiaire_seller`, `vestiaire_suggest`
- **vice** (5): `vice_article`, `vice_author`, `vice_headlines`, `vice_news`, `vice_sections`
- **vinted** (7): `vinted_brand`, `vinted_brands`, `vinted_catalog`, `vinted_categories`, `vinted_category`, `vinted_item`, `vinted_member`
- **vox** (5): `vox_article`, `vox_author`, `vox_headlines`, `vox_news`, `vox_sections`
- **vrbo** (7): `vrbo_locations_search`, `vrbo_properties_rate_calendar`, `vrbo_properties_reviews`, `vrbo_property`, `vrbo_search`, `vrbo_travel_page_detail`, `vrbo_travel_pages`
- **walesonline** (5): `walesonline_article`, `walesonline_author`, `walesonline_headlines`, `walesonline_news`, `walesonline_sections`
- **walgreens** (1): `walgreens_stores`
- **walmart** (3): `walmart_product`, `walmart_product_reviews`, `walmart_search`
- **wapo** (5): `wapo_article`, `wapo_author`, `wapo_headlines`, `wapo_news`, `wapo_sections`
- **wayfair** (3): `wayfair_categories`, `wayfair_category`, `wayfair_product`
- **wccftech** (5): `wccftech_article`, `wccftech_author`, `wccftech_headlines`, `wccftech_news`, `wccftech_sections`
- **web** (9): `web_capabilities`, `web_crawl`, `web_crawl_cancel`, `web_crawl_results`, `web_crawl_status`, `web_map`, `web_scrape`, `web_search`, `web_techstack`
- **wendys** (10): `wendys_categories`, `wendys_directory`, `wendys_item`, `wendys_menu`, `wendys_nearby`, `wendys_nutrition`, `wendys_restaurant`, `wendys_store`, `wendys_store_menu`, `wendys_time_slots`
- **whataburger** (2): `whataburger_sitemap`, `whataburger_store`
- **whatnot** (4): `whatnot_browse`, `whatnot_categories`, `whatnot_live`, `whatnot_seller`
- **wingstop** (6): `wingstop_delivery_store`, `wingstop_directory`, `wingstop_flavors`, `wingstop_menu`, `wingstop_nearby`, `wingstop_store`
- **wired** (5): `wired_article`, `wired_author`, `wired_headlines`, `wired_news`, `wired_sections`
- **wish** (6): `wish_categories`, `wish_product`, `wish_product_related`, `wish_product_reviews`, `wish_search`, `wish_suggest`
- **wolt** (8): `wolt_cities`, `wolt_collections`, `wolt_restaurant`, `wolt_restaurant_availability`, `wolt_restaurant_menu`, `wolt_restaurant_menu_search`, `wolt_search`, `wolt_search_filters`
- **wsj** (2): `wsj_article`, `wsj_author`
- **x** (3): `x_post`, `x_profile`, `x_profile_posts`
- **xbox** (5): `xbox_browse`, `xbox_collection`, `xbox_game`, `xbox_reviews`, `xbox_search`
- **xda** (5): `xda_article`, `xda_author`, `xda_headlines`, `xda_news`, `xda_sections`
- **yahoo-autos** (3): `yahoo_autos_article`, `yahoo_autos_category`, `yahoo_autos_home`
- **yahoo-entertainment** (3): `yahoo_entertainment_article`, `yahoo_entertainment_category`, `yahoo_entertainment_home`
- **yahoo-finance** (39): `yahoo_finance_calendar_results`, `yahoo_finance_calendars`, `yahoo_finance_download`, `yahoo_finance_industries`, `yahoo_finance_industry`, `yahoo_finance_lookup`, `yahoo_finance_market_status`, `yahoo_finance_market_summary`, `yahoo_finance_screener`, `yahoo_finance_screener_custom`, `yahoo_finance_screeners`, `yahoo_finance_search`, `yahoo_finance_sector`, `yahoo_finance_sectors`, `yahoo_finance_ticker_actions`, `yahoo_finance_ticker_analysts`, `yahoo_finance_ticker_calendar`, `yahoo_finance_ticker_capital_gains`, `yahoo_finance_ticker_dividends`, `yahoo_finance_ticker_earnings`, `yahoo_finance_ticker_earnings_dates`, `yahoo_finance_ticker_financials`, `yahoo_finance_ticker_funds`, `yahoo_finance_ticker_history`, `yahoo_finance_ticker_history_metadata`, `yahoo_finance_ticker_holders`, `yahoo_finance_ticker_info`, `yahoo_finance_ticker_isin`, `yahoo_finance_ticker_news`, `yahoo_finance_ticker_options`, `yahoo_finance_ticker_options_expiration`, `yahoo_finance_ticker_quote`, `yahoo_finance_ticker_sec_filings`, `yahoo_finance_ticker_shares`, `yahoo_finance_ticker_shares_full`, `yahoo_finance_ticker_splits`, `yahoo_finance_ticker_sustainability`, `yahoo_finance_ticker_valuation`, `yahoo_finance_trending`
- **yahoo-health** (3): `yahoo_health_article`, `yahoo_health_category`, `yahoo_health_home`
- **yahoo-life** (2): `yahoo_life_article`, `yahoo_life_home`
- **yahoo-news** (7): `yahoo_news_article`, `yahoo_news_category`, `yahoo_news_comment_replies`, `yahoo_news_comments`, `yahoo_news_home`, `yahoo_news_related`, `yahoo_news_suggest`
- **yahoo-search** (6): `yahoo_search`, `yahoo_search_images`, `yahoo_search_local`, `yahoo_search_news`, `yahoo_search_suggest`, `yahoo_search_videos`
- **yahoo-shopping** (7): `yahoo_shopping_article`, `yahoo_shopping_category`, `yahoo_shopping_home`, `yahoo_shopping_shopping_list`, `yahoo_shopping_shopping_lists`, `yahoo_shopping_store`, `yahoo_shopping_stores`
- **yahoo-sports** (18): `yahoo_sports_game`, `yahoo_sports_golf_leaderboard`, `yahoo_sports_golf_schedule`, `yahoo_sports_mma_fight_card`, `yahoo_sports_mma_schedule`, `yahoo_sports_motorsports_race`, `yahoo_sports_motorsports_schedule`, `yahoo_sports_news`, `yahoo_sports_olympics_medals`, `yahoo_sports_player`, `yahoo_sports_scoreboard`, `yahoo_sports_standings`, `yahoo_sports_team`, `yahoo_sports_team_roster`, `yahoo_sports_team_schedule`, `yahoo_sports_tennis_rankings`, `yahoo_sports_tennis_schedule`, `yahoo_sports_tennis_scoreboard`
- **yahoo-tech** (3): `yahoo_tech_article`, `yahoo_tech_category`, `yahoo_tech_home`
- **yandex** (2): `yandex_search`, `yandex_suggest`
- **yardbarker** (5): `yardbarker_article`, `yardbarker_author`, `yardbarker_headlines`, `yardbarker_news`, `yardbarker_sections`
- **yelp** (8): `yelp_business`, `yelp_business_menu`, `yelp_business_photos`, `yelp_business_review_highlights`, `yelp_business_reviews`, `yelp_business_reviews_search`, `yelp_geocode`, `yelp_search`
- **yoox** (4): `yoox_categories`, `yoox_designers`, `yoox_product`, `yoox_search`
- **youtube** (14): `youtube_captions`, `youtube_channel_playlists`, `youtube_channel_search`, `youtube_channel_shorts`, `youtube_channel_videos`, `youtube_comments`, `youtube_playlist`, `youtube_profile`, `youtube_search`, `youtube_suggest`, `youtube_tag`, `youtube_transcript`, `youtube_transcript_languages`, `youtube_video`
- **zalando** (6): `zalando_categories`, `zalando_category`, `zalando_markets`, `zalando_product`, `zalando_search`, `zalando_suggest`
- **zappos** (5): `zappos_brand`, `zappos_brands`, `zappos_product`, `zappos_search`, `zappos_suggest`
- **zara** (6): `zara_categories`, `zara_category_products`, `zara_product`, `zara_search`, `zara_stores`, `zara_suggest`
- **zaxbys** (3): `zaxbys_menu`, `zaxbys_nearby`, `zaxbys_store`
- **zdnet** (5): `zdnet_article`, `zdnet_author`, `zdnet_headlines`, `zdnet_news`, `zdnet_sections`
- **zillow** (3): `zillow_autocomplete`, `zillow_property`, `zillow_search`
- **zomato** (6): `zomato_cities`, `zomato_collection`, `zomato_collections`, `zomato_restaurant`, `zomato_restaurant_menu`, `zomato_search`
<!-- END MCP.SO TOOLS -->
