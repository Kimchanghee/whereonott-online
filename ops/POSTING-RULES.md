# Posting rules
Local code only. Never deploy examples or drafts. Full gate requires at least eight non-draft substantive buying guides. Each guide and post must meet the unchanged 1,400 non-space Korean character floor and four answered question H2s. Three initial guides remain draft: true.

Each hourly candidate: research Google/Naver and read 3–5 original articles; record sources and gaps; remain in home-cinema lane; verify exact option and affiliate landing page; save dated evidence; use only sourced specifications; secure meaningful image rights and inspect the actual images; write provider disclosure first, direct answer, four question sections, fit/avoid and purchase checks, sources, visible FAQ. Same exact product URL in card/in-text/end CTA, rel sponsored nofollow noopener. No invented use, reviews, price or availability.

Template: use src/content/posts/_examples/pass-example.md for field structure ONLY, not its fake content. Set draft: false only after editorial verification. Sources and evidence metadata are not independent proof of eligibility, image rights or product identity. Full source+HTML gate, build, check and local dryrun precede parent-controlled release. No account work in this branch task.

Ads default off; PUBLIC_ADS_ENABLED and PUBLIC_CMP_VERIFIED are both required for loader. Parent verifies CMP/account state. GA4 Consent Mode is not a consent UI.

## Screening-room post format (approved 2026-10-21, enforced by scripts/gate.mjs for posts with `updated` >= 2026-10-21)
The template (src/pages/picks/[slug].astro) renders, in order: disclosure (first block) → kicker/breadcrumb → H1 → byline (발행·수정·링크 확인) → full-bleed cover photo → dark "먼저 결론" box with `answer` → compact product card (thumb photo, name, option, one button) → body → FAQ → checklist → end CTA with thumbnail → sources → related guides. Desktop adds a sticky 300px product card beside the 720px column. Do not hand-write any of these blocks in the body.

Manuscript requirements (gate errors if missing):
- Body: 1,800–2,800 visible characters including spaces (tables and figcaptions count; markup and alt text do not) and still ≥ 1,400 non-space characters. Short paragraphs (1–3 sentences).
- 4–6 H2s in the body, every one phrased as the reader's question and followed directly by an answer paragraph or its photo.
- At least one comparison/spec table (`<div class="spec-compare" role="region" aria-label="…" tabindex="0"><table>…</table><p class="spec-compare__src">출처</p></div>`), values only from the facts/evidence files.
- `faq`: 1–3 items. `checklist`: ≥ 3 purchase checks; optional `checklistNote` (구성품·가격·배송은 판매 페이지 확인).
- No monospace: no backticks, `<code>`, `<pre>` or monospace fonts.
- Never override `disclosure` in frontmatter; the provider disclosure renders first automatically.
- No prices, ratings, review counts, sales counts, invented use or firsthand claims (BANNED_FIRST_HAND still applies).

Photo requirements (gate errors if missing):
- ≥ 6 distinct photos (frontmatter `images` entries with `rights: generated|provider-api`, excluding `thumb-*` crops). Generate only with the user-designated GENEXIS gpt-image bridge from real official manufacturer reference images; record reference URLs in `whereonott.online-concept-assets/refs/<product>/SOURCES.json`, manifests/logs/receipts in `channel-ops/ops/state/<job>/`, outputs in `channel-ops/ops/content/<job>/`.
- QA every output against the official reference for shape, colour, ports/buttons and item count before use; reject and regenerate mismatches; record the verdict per file in `ops/queue/image-specs/<slug>.json`.
- WebP only, src under `/images/picks/<slug>/<unique-basename>.webp`; basenames unique within the post. Build with `node scripts/build-queue-images.mjs ops/queue/image-specs/<slug>.json` (writes `ops/queue/images/<slug>/…` and syncs inline width/height).
- Every frontmatter image except the cover and `thumb-*` must appear in the body as `<figure class="fig"><img src="…" alt="…" width="…" height="…" loading="lazy" decoding="async"><figcaption>…</figcaption></figure>` directly next to the paragraph it supports; every inline image must be listed in frontmatter (the publisher copies files by basename via the manuscript's `src:` lines). A `thumb-<name>.webp` crop is used for the product card and end CTA.
- No "AI image"/production captions or alt text; describe what is visible.
- List every image path in `ops/queue/ready.json` item.images (`ops/queue/images/<slug>/<basename>`).

Validation before a queued item is ready: `node scripts/gate.mjs --source ops/queue/<slug>.md`, then `node scripts/dryrun-stage.mjs --queue <slug>` (isolated stage: places the manuscript + images, builds the new template, runs the full built-page gate and a local preview check, removes the stage). Update `dryRunPassedAt` only when that passes.
