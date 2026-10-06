# Crawlora MCP release checklist

The GitHub release workflow is the source of truth for npm and official MCP
Registry publication. Its automated job blocks on those authoritative
publication checks; account-managed and bot-protected directories remain visible
as warnings. The cross-directory sync is complete only after the manual
surfaces below show the current version and catalog counts, or have a recorded
current blocker and next action.

## Automated gates

- `npm test` lists the complete embedded tool catalog.
- `npm run sync:readme-tools` regenerates the MCP.so `## Tools` section from
  `tools.json`; CI and release fail if `npm run check:readme-tools` detects drift.
- `node scripts/validate-release.mjs` checks package, registry manifest, README,
  tool count, and platform-group count for drift.
- npm publishes with GitHub Actions OIDC provenance and is verified by exact
  version, `latest` dist-tag, and the published npm provenance attestation.
- The official MCP Registry is published with the DNS-authenticated
  `MCP_PRIVATE_KEY` secret and verified by its `isLatest` entry.
- `node scripts/verify-published.mjs` checks npm, the official registry,
  Glama, Smithery, and MCP.so. npm and official-registry publication failures
  block the job; account-managed or bot-protected public listings are reported
  as `WARN` and written to the GitHub Actions summary until they can be
  refreshed manually. Smithery's private scan/API-key requirement makes its
  public snapshot advisory in CI; a stale listing still requires manual refresh.
- The same verification summary lists the additional directory surfaces below
  with an explicit status, so account-gated, unlisted, or paused directories
  cannot disappear silently from the release process.
- `npm run check:release`, `npm run test:publication`, and
  `npm run check:published` are the canonical local/CI commands; workflows do
  not maintain a second copy of those checks.

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
3. [MCP.so listing](https://mcp.so/servers/crawlora-mcp): the README's generated
   `## Tools` section is the source for the tool catalog. Use **Edit** and save
   the public description/overview with the current counts, then confirm the
   public page shows a non-empty Tools section (not “No tools detected”).
4. Rerun **MCP directory drift**. Confirm the official registry passes, review
   each directory warning, and refresh any account-managed listing before
   reporting the directory sync complete.

## Additional directory surfaces

These surfaces are tracked in every directory-drift and post-publication
summary, but are not blocking HTTP checks because their update flows are
account-gated, lack a stable public listing endpoint, or are currently paused:

1. [MCP Servers.org](https://mcpservers.org/servers/crawlora-net-mcp): an
   update request has been submitted. Recheck the listing after the maintainer
   refreshes it and confirm it shows the current tool and platform-group counts
   derived from `tools.json`.
2. [GoodFirms](https://www.goodfirms.co/software/crawlora): the claimed page
   was still showing `549` hosted MCP tools. Sign in to the vendor account and
   update the profile to the current counts derived from `tools.json`.
3. [StackShare search](https://stackshare.io/?q=crawlora): no Crawlora listing
   was found. Creating a new listing is a separate account-authorized action,
   not a refresh of an existing page.
4. [PulseMCP](https://www.pulsemcp.com/): the site currently says new server
   submissions and listing changes are paused. Retry this check when the
   submission flow reopens.

The release is not complete until each item has either reached the current
counts or has an explicit, current external-status note like the ones above.

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
- refresh the MCP manifest/readme and verify the MCP.so, Smithery, Glama,
  official registry, MCP Servers.org, GoodFirms, StackShare, and PulseMCP
  statuses again.

Do not mark the batch complete from a successful npm publish alone. The public
pages and registry metadata are the acceptance checks.

## 2026-09-29 public listing status

The `crawlora-mcp@1.17.7` release is published with npm provenance, and the
official MCP Registry reports `1.17.7` / 3,209 tools. The post-publish checker
passed npm and the official registry. It warned that the Glama, Smithery, and
MCP.so listings omit the current 3,209 tools / 438 platform groups.

Live page review found:

- [Glama](https://glama.ai/mcp/servers/Crawlora-org/crawlora-mcp): the public
  listing did not expose the current structured tool count to the checker. The
  authenticated TDQS scan was not available in this run. Sync the server from
  its admin profile, then review the 87 added news/sports tools and six changed
  MLB schemas as recorded in the API release checklist.
- [Smithery](https://smithery.ai/servers/crawlora/crawlora): the public page
  still says 3,099 tools / 420 groups and shows the last publication as June 5,
  2026. Its account-managed scan requires the private capability-scan
  credential; do not put that key in this repository or public metadata.
- [MCP.so](https://mcp.so/servers/crawlora-mcp): the public description says
  319 tools, the overview still says 1,873 tools / 215 groups, and the Tools
  section says “No tools detected.” Sign in, save the current overview, and
  refresh the README-derived Tools index; recheck the public page afterward.
- [MCP Servers.org](https://mcpservers.org/servers/crawlora-net-mcp): the
  public page still describes “300+” tools and offers “Request update”; the
  previously submitted request has not produced a current listing. Wait for the
  maintainer update, then verify the exact counts.
- [GoodFirms](https://www.goodfirms.co/software/crawlora): the claimed profile
  still says 549 MCP tools and 578 endpoints. A vendor-account sign-in is
  required to edit it; update after account access, then verify the public page.
- [StackShare search](https://stackshare.io/?q=crawlora): the public search and
  direct page could not be fetched by the available reader, so current listing
  status is unverified. Do not create a new listing; retry a read-only lookup
  when the public page is accessible.
- [PulseMCP](https://www.pulsemcp.com/): the live home page still says new
  server submissions and listing changes are paused. Retry when the flow
  reopens.

These account-gated or externally paused surfaces remain open follow-ups. The
successful registry and npm checks do not establish that the third-party pages
have refreshed.

## 2026-10-06 release and directory status

`crawlora-mcp@1.17.9` is published on npm with a verified SLSA provenance
attestation, and the Official MCP Registry reports `1.17.9` / 3,475 tools. The
release workflow's first post-publish check ran before npm propagation and
reported the package missing; its idempotent rerun found the published package,
verified provenance and the Official MCP Registry, and completed successfully
(GitHub Actions run 37401230314). The package was not republished on retry.

The release's live directory check reports:

- **Glama:** public listing does not expose 3,475 structured tools. An
  authenticated admin rescan and TDQS review of the ten newly added definitions
  remain pending.
- **Smithery:** public description does not show 3,475 tools / 468 groups. The
  account-managed scan requires the private capability-scan credential.
- **MCP.so:** public overview does not show 3,475 tools / 468 groups. The
  anonymous directory check reached the page, but the signed-in browser editor
  was unavailable in this run.
- **MCP Servers.org:** latest readable page still says “300+” tools and offers
  “Request update”; the existing request remains unresolved. No duplicate was
  submitted.
- **GoodFirms:** latest readable page still says 549 hosted tools / 578
  endpoints; editing the claimed listing requires the vendor account.
- **StackShare:** the public search URL could not be read by the available web
  reader. No new listing was created.
- **PulseMCP:** the page checked today says submissions and listing changes
  remain paused.
- **GitHub About:** repository description refreshed to “3,475 tools across
  468 platform groups” and read back successfully.

The local authenticated-browser inventory was unavailable because the Mac was
locked and the Chrome/Brave request-header policy could not load. No account
login, credential workaround, duplicate listing, or new StackShare listing was
attempted. Retry Glama, Smithery, and MCP.so edits when the signed-in browser
session is accessible; use the existing MCP Servers.org request, GoodFirms
vendor account, and PulseMCP reopening rather than creating duplicate work.

### 2026-09-29 directory follow-up

Rechecked with `node scripts/verify-directory-drift.mjs` under the installed
Node 22 runtime. The Official MCP Registry passes at `1.17.7` / 3,209 tools;
Glama, Smithery, and MCP.so remain warnings because their public pages do not
show the current 3,209 tools / 438 platform groups. MCP.so still says 319 tools
in its description, 1,873 tools / 215 groups in its overview, and “No tools
detected” in its README-derived Tools section. Its editor is behind Sign In.
Glama's admin profile is unavailable in the signed-out browser. Smithery's
release flow remains account-managed and needs the private capability-scan
credential; no credential was available in this session, so no scan/release
was attempted.

Additional directory checks on the same date:

- **MCP Servers.org:** still describes “300+” tools and exposes “Request
  update.” The existing request remains unresolved; do not file a duplicate.
- **GoodFirms:** still claims 549 MCP tools across 578 endpoints. Its profile
  is marked claimed and vendor account sign-in is required to edit it.
- **StackShare:** public lookup remains inaccessible to the available reader;
  listing state is unverified. Do not create a new listing as part of refresh.
- **PulseMCP:** the live home page says new server submissions and listing
  changes are still paused.

The public listing pages were reviewed anonymously; the available browser
session had no authenticated directory accounts. Resume these refreshes when
the existing owner sessions or MCP Servers.org response are available. These
are external access/review blockers, not publication failures in npm or the
official registry release.
