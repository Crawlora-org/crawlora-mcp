# Crawlora MCP release checklist

The GitHub release workflow is the source of truth for publication. A release
is complete only when the automated job is green and the manual directory
surfaces below show the same version and catalog counts.

## Automated gates

- `npm test` lists the complete embedded tool catalog.
- `node scripts/validate-release.mjs` checks package, registry manifest, README,
  tool count, and platform-group count for drift.
- npm publishes with GitHub Actions OIDC provenance and is verified by exact
  version and `latest` dist-tag.
- The official MCP Registry is published with the DNS-authenticated
  `MCP_PRIVATE_KEY` secret and verified by its `isLatest` entry.
- `node scripts/verify-published.mjs` checks npm, the official registry,
  Glama, Smithery, and MCP.so. Any stale, blocked, or unavailable directory
  fails the job and is written to the GitHub Actions summary.

## Required GitHub configuration

- npm trusted publishing must name this repository and
  `.github/workflows/release.yml`; the job needs `id-token: write`.
- `MCP_PRIVATE_KEY` must contain the private key paired with the
  `crawlora.net` DNS TXT record used by the official MCP Registry publisher.
- Never put a Crawlora API key in the repository, workflow YAML, logs, or
  public registry metadata. Smithery's capability scan requires that key in
  its private browser form, so it remains a deliberate manual step.

## Manual directory refresh

When the directory verification job identifies stale content, refresh the
affected listing before rerunning the job:

1. [Glama profile](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp/admin/profile):
   update the description, then save it. In **Repository**, click **Sync
   Server** so the current GitHub commit and tool schema are rescanned.
2. [Smithery releases](https://smithery.ai/servers/crawlora/crawlora/releases):
   publish a new release from `https://mcp.crawlora.net/mcp`, keep `x-api-key`
   secret and required, and provide the scan key only in Smithery's private
   credential form. Confirm the release reaches `SUCCESS`.
3. [MCP.so listing](https://mcp.so/servers/crawlora-mcp): use **Edit** and
   save the public description/overview with the current counts. Confirm the
   public page, not only the editor, contains the current markers.
4. Rerun **MCP directory drift** and confirm all four directory checks pass.

## Weekly SDK, skills, and profile batch

The MCP repo cannot safely publish the sibling SDKs or marketplace listings
without their repository-specific credentials. The maintainer batch must also
complete:

- regenerate and test the six SDK repositories from the public OpenAPI spec;
- update SDK changelogs, recipes, coverage lines, versions, and registry
  packages;
- refresh `Crawlora-org/.github/profile/README.md` with every language form,
  integration version, and current tool/platform counts;
- sync `crawlora-skills` and `crawlora-openclaw-skill` into their published
  skill directories and verify their marketplace pages;
- refresh the MCP manifest/readme and verify the MCP.so, Smithery, Glama, and
  official registry pages again.

Do not mark the batch complete from a successful npm publish alone. The public
pages and registry metadata are the acceptance checks.
