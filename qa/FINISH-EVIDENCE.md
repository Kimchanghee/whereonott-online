# Bounded verification receipt
Commands executed locally with ASTRO_TELEMETRY_DISABLED=1:
- pnpm install --frozen-lockfile --package-import-method copy --store-dir .pnpm-store: exit 0.
- node node_modules/astro/astro.js build --force: successful 13-page build, see build-finish.log.
- node --test tests/*.test.mjs: 7 tests passed, see test-finish.log.
- node node_modules/astro/astro.js check: a completed run reported 0 errors, 0 warnings, 2 hints; latest rerun output retained verbatim. Do not infer completion from timeout.
- node scripts/gate.mjs: intentionally nonzero, see gate-finish.log. No launch bypass.
No successful publication, deployment or local full publish dryrun claimed.

Correction: final build-finish.log was overwritten by an interrupted rerun and is NOT a successful final-tree build receipt. Earlier 13-page success was observed before final hub-link additions. Gate log predates those additions.
