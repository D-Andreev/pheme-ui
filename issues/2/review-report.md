# Review Report

**Fresh-eyes:** judgments based on artifacts and diff only (`main...HEAD` on `workflow/issue-2`).

## Verdict
APPROVE WITH NOTES

## Scenario verification

### Scenarios verified

| # | Scenario | Method | Result | Notes |
|---|----------|--------|--------|-------|
| 1 | Design tokens match the mockup's structure (dark default, light override, accent/neutral/section ramps, radius, shadow, spacing, font stack) | code trace | pass | `tokens.css` is well-organized `:root` + `[data-theme="light"]` overrides; `danger`/`success` values remain a documented, disclosed assumption (see Gaps below) |
| 2 | Tailwind config fidelity vs. issue #2's provided config | code trace | pass | Content glob correctly includes the `*` (task.md's transcription of the issue already had it right; the code comment accurately explains the discrepancy vs. the raw issue body); `.storybook/**` glob addition is a reasonable, non-breaking extra |
| 3 | Package boundaries — `main`/`module`/`types`/`exports` wired to `tsup` output, `sideEffects` set correctly | code trace | pass | `exports["./styles.css"]` subpath matches the README's `import "pheme-ui/styles.css"` usage; `sideEffects: ["*.css"]` correctly preserves the CSS while allowing JS tree-shaking |
| 4 | CI shape — `ci.yml` doesn't deploy, `storybook-pages.yml` only triggers on `main`, `release.yml` uses `changesets/action` | code trace | pass | All three workflows match the intended shape; `storybook-smoke` runs as a separate job in `ci.yml` on PRs as required |
| 5 | Two minimal example components, structure-only, with stories + trivial render tests | code trace | pass | `Button` and `Card`/`CardTitle`/`CardBody` are pure structural shells; no chat logic. Tests assert rendering, variant/elevation class application, and click behavior — matches implement-handoff's cited 9/9 passing |
| 6 | Button variant class composition — do variant classes ever conflict with base classes | code trace | 🟡 fail | `ghost` variant's `px-ds-1` collides with the unconditional base `px-[calc(var(--space-3)*1.2)]` — see Issues found |
| 7 | ESLint config completeness vs. declared devDependencies | code trace | 🟡 fail | `eslint-plugin-storybook` is a devDependency but isn't imported/wired into `eslint.config.mjs` — see Issues found |

### Requirements coverage

All twelve acceptance criteria in `requirements.md` are met per the diff — cross-checked against `implement-handoff.md`'s per-AC checklist, which lines up with what's actually in the tree (package.json fields, workflows, tokens, Tailwind config, LICENSE, Changesets config, component set). No gaps found in AC coverage itself.

### Issues found (from review)

- 🟡 Minor: `Button`'s `ghost` variant combines two Tailwind padding-x utilities that target the same CSS properties — `src/components/Button/Button.tsx`.
- 🟡 Minor: `eslint-plugin-storybook` is declared but unused — `eslint.config.mjs`, `package.json`.

### Implement test results (cited, not re-run)

- `pnpm lint` → clean. `pnpm typecheck` → clean. `pnpm test` (Vitest) → 2 files, 9/9 passing. `pnpm build` (tsup) → clean, produces ESM/CJS/d.ts + `styles.css`. `pnpm build-storybook` → clean, spot-checked compiled CSS contains both themes' tokens and expected utility classes.

### Gaps in test coverage

- No test exercises the `ghost` variant's rendered class list (only `primary`/`secondary` are asserted against by class-name substring), so the padding conflict noted above wouldn't be caught by the current suite.
- `icon`/`block` Button modifiers and `Card`'s `none`/`md` elevations beyond the two asserted (`sm`, `lg`) aren't covered by tests — acceptable for a structure-only PR, but worth a follow-up test pass once real usage lands.
- `danger`/`success` token values are a disclosed assumption (not sourced from the design mockup) — already called out in `implement-handoff.md` and merged into `workflow/PROJECT.md`; no test or story exercises them yet since no shipped component uses those colors.

### Tests/build in review
- **Not run** — review is diff + code reading only; implement phase owns execution.

## Principles review

### Summary
The scaffold is thorough and clearly organized: toolchain, tokens, Tailwind wiring, Storybook, CI/CD, and the two shell components all match the extensively clarified requirements. The two issues found are both small, non-blocking correctness/tidiness nits rather than structural problems with the scaffold.

### Critical (must fix)
- None.

### Suggestions (should consider)
- `src/components/Button/Button.tsx`: the `ghost` variant's `px-ds-1` is applied after the base variant-agnostic padding (`px-[calc(var(--space-3)*1.2)]`) rather than replacing it — both are padding-x utilities so which one wins in the compiled CSS depends on Tailwind's internal utility-generation order, not on the order the classes appear in the string. Worth confirming visually in Storybook (toggle the Ghost story) and, if the tighter padding isn't applied, restructuring so the base padding is computed conditionally per-variant instead of unconditionally then overridden.
- `eslint.config.mjs` / `package.json`: `eslint-plugin-storybook` is installed but never referenced. Either wire it in (e.g. `...storybook.configs['flat/recommended']` scoped to `**/*.stories.tsx`) so story files get Storybook-specific lint rules, or drop the dependency if it wasn't meant to be used yet.

### Nice to have
- `--color-accent-ink` and `--color-code-ground` in `tailwind.config.js` rely entirely on their CSS `var(..., fallback)` defaults since neither is defined in `tokens.css`'s `:root` block — harmless today since no shipped component uses them, but worth a short code comment (or a `workflow/PROJECT.md` note) so a future implementer doesn't assume they're theme-aware without checking.

### Scenario overlap avoided
- Did not re-run `pnpm test`/`pnpm build`/`pnpm build-storybook` — cited implement-handoff's recorded results (9/9 tests, clean build, clean Storybook build) instead of re-executing them.

### Principles applied
- Security: no user input handling, secrets, or network calls introduced in this PR; nothing to flag.
- Design/maintainability: barrel exports, `forwardRef` on `Button`, generic `Card` shell reusable as a future `MessageBubble` base — all reasonable structural choices for a component-library seed.
- Conventions: flat ESLint config, `tsup` dual ESM/CJS build, Changesets release flow, and CI job split (build/lint/test vs. Storybook smoke) all follow current ecosystem norms for a publishable React component library.

## Recommendation
Mergeable as-is — both notes are small, well-isolated nits (a class-composition ordering quirk and an unused lint dependency) that don't block shipping the scaffold; worth a quick follow-up pass rather than a blocking fix.
