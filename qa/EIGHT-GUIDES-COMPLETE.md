# Eight-guide local completion

- Base: 9c80090 on v2-cloudflare-static. The original four guide files are unchanged.
- Added four independently scoped Korean guides: screen/ambient light, cable certification/length, projector stand safety, audio layout/TV speaker decision.
- Official originals were read; source log: content/research/eight-guides-source-log.json. Epson PDF pp.150–154 read. Manufacturer figures are model-scoped.
- pnpm build: exit 0, 21 pages. pnpm check: exit 0, 0 errors/0 warnings/2 hints. pnpm test: exit 0, 12/12.
- node scripts/gate.mjs --json: exit 0, 8 substantive guides, no site errors. No release fixture was added.
- Same QA Node process owned Astro preview and Edge browser. Final built home plus all 8 guides checked at actual CSS widths 390 and 1440 (18 observations); no overflow, ads scripts, or affiliate CTA. HTTP missing-path response 404. Browser closed and preview stopped in finally.
- Screenshots and machine receipt: qa/eight-edge/. Two representative full-page renders visually inspected; automatic viewport/status checks cover all 18.
- No deployment, account operations, ad enablement, or affiliate enablement.
