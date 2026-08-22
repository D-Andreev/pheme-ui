## Summary

Scaffolded the initial `pheme-ui` project structure: TypeScript build via
`tsup` (ESM + CJS + `.d.ts`), Vitest + Testing Library test setup, ESLint
flat config, Storybook (Vite builder) with two example components, the
Tailwind theme config from the issue (content-glob typo fixed) backed by
CSS variable design tokens for both dark (default) and light themes, MIT
license, npm-publish-ready `package.json`, Changesets versioning, and three
GitHub Actions workflows (CI, Storybook→Pages deploy, release). No chat
components are implemented yet — per clarify round 2, this PR ships
structure only.

## Branch

`workflow/issue-2` (base: `main`)

## Changes

- **Toolchain**: `package.json` (public `pheme-ui`, MIT, `main`/`module`/`types`
  wired to `tsup` output, `sideEffects: ["*.css"]`, Node `>=20` engine, pnpm
  packageManager pin), `tsconfig.json` (strict), `tsup.config.ts` (ESM+CJS+dts,
  copies `src/styles/tokens.css` → `dist/styles.css` on success),
  `vitest.config.ts` + `vitest.setup.ts` (jsdom, `@testing-library/jest-dom`),
  `eslint.config.mjs` (flat config: `@eslint/js`, `typescript-eslint`,
  `eslint-plugin-react`/`react-hooks`).
- **Design tokens**: `src/styles/tokens.css` — CSS custom properties for
  dark (`:root` default) and light (`[data-theme="light"]`) themes, values
  read off the approved design mockup (colors, spacing, radius, shadows,
  font stack). `danger`/`success` status-color values are an assumption —
  the mockup didn't define them (see `workflow/PROJECT.md` § Language for
  the rationale and what to revisit).
- **Tailwind**: `tailwind.config.js` is issue #2's provided config verbatim,
  with the `content` glob's missing `*` restored (`./src/**/*.{js,ts,jsx,tsx,html}`)
  and a `.storybook/**` glob added so story files aren't purged.
  `postcss.config.js` wires `tailwindcss` + `autoprefixer`.
  `src/styles/globals.css` is the Storybook-only Tailwind entrypoint
  (`@tailwind base/components/utilities` + tokens import); the published
  package ships only `dist/styles.css` (tokens, no Tailwind directives) —
  consumers add `pheme-ui`'s `dist` to their own Tailwind `content` globs
  (documented in `README.md`).
- **Components** (`src/components/`): `Button` (primary/secondary/ghost
  variants, `icon`/`block` modifiers, forwardRef) and `Card` +
  `CardTitle`/`CardBody` (generic surface shell — the intended basis for a
  future `MessageBubble`, not that component itself). Each has a render
  test and Storybook stories with `autodocs`. Barrel exports at
  `src/components/*/index.ts` and `src/index.ts`.
- **Storybook**: `.storybook/main.ts` (Vite builder, `addon-essentials`),
  `.storybook/preview.ts` (loads `globals.css`, dark/light theme toolbar
  toggle via `data-theme`).
- **CI/CD** (`.github/workflows/`): `ci.yml` (lint + typecheck + test + build
  on PRs/push to `main`, plus a separate Storybook-build smoke-test job),
  `storybook-pages.yml` (deploys `storybook-static` to GitHub Pages on
  merge to `main` — this is the project's demo, no separate demo app),
  `release.yml` (Changesets `changesets/action` — version PR or npm publish
  on push to `main`).
- **Publishing**: `LICENSE` (MIT), `.changeset/config.json` (`access: public`,
  `baseBranch: main`).
- **Docs**: `README.md` — install/usage (including the "add `dist` to your
  Tailwind content globs" note), component table, dev scripts, release flow.
- **Language**: merged clarify's (empty) `language.md` into
  `workflow/PROJECT.md` with three notes — the "Nocturne" token naming,
  the danger/success color assumption, and Button/Card's shell-only scope.

## TDD cycles

- **Button**: wrote `Button.test.tsx` (renders children; defaults to
  `primary` variant + `type="button"`; applies requested `variant`; fires
  `onClick` when enabled; does not fire `onClick` when `disabled`) against
  a not-yet-existing `Button.tsx` → red (`Cannot find module './Button'`) →
  implemented `Button.tsx` → green (5/5).
- **Card**: wrote `Card.test.tsx` (renders `CardTitle`/`CardBody` children;
  defaults to `sm` elevation; applies requested `elevation`; applies no
  shadow class when `elevation="none"`) against a not-yet-existing
  `Card.tsx` → red → implemented `Card.tsx` + `CardTitle`/`CardBody` →
  green (4/4). One follow-up cycle: initial `Card.test.tsx` used a literal
  apostrophe inside JSX text, which `pnpm lint` flagged
  (`react/no-unescaped-entities`) — reworded the test string, re-ran lint
  green.

## Test results

Ran on the work branch (`workflow/issue-2`) after `pnpm install`:

- `pnpm lint` → clean, 0 errors/warnings.
- `pnpm typecheck` (`tsc --noEmit`) → clean.
- `pnpm test` (`vitest run`) → **2 test files, 9 tests, all passing**
  (`Card.test.tsx` 4/4, `Button.test.tsx` 5/5).
- `pnpm build` (`tsup`) → clean, produces `dist/index.{js,mjs,d.ts,d.mts}` +
  `dist/styles.css`, no warnings (an earlier `"use client"` banner attempt
  triggered an esbuild "module level directives" warning — removed, not
  required by the ACs).
- `pnpm build-storybook` → clean build of `storybook-static/`; spot-checked
  the compiled preview CSS contains both theme's `--color-bg` values and
  the expected Tailwind utility classes (`.text-accent`, `.shadow-sm`,
  `.rounded-md`), confirming the token file and Tailwind config are wired
  together correctly.
- One dependency fix needed along the way: `pnpm install` initially
  resolved a transitive `vite@7` that unmet `@storybook/react-vite`'s
  `vite@^4-6` peer range; pinned `vite@^5.4.11` as an explicit devDependency
  to satisfy both Storybook 8.6 and Vitest 3.2's ranges — peer warning gone
  on reinstall.

Build/Storybook-build output directories (`dist/`, `storybook-static/`)
were removed before committing; both are gitignored.

## Acceptance criteria

- [x] Package scaffolded with TypeScript, `tsup` build producing ESM + CJS + `.d.ts`
- [x] Vitest test setup with `@testing-library/react`, at least one passing example test (9 passing)
- [x] ESLint flat config (`typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`) with a lint script
- [x] GitHub Actions workflow(s) running build, lint, and test on PRs/pushes (`ci.yml`)
- [x] Storybook configured (Vite builder) and able to run locally (`pnpm storybook`)
- [x] CI includes a `storybook build` smoke-test job on PRs (`ci.yml`); a separate workflow deploys Storybook to GitHub Pages on merge to `main` (`storybook-pages.yml`) — no separate demo app
- [x] Tailwind `fontFamily` keeps the `"Inter", "system-ui", "sans-serif"` stack as declared; no font files/packages bundled in the library
- [x] `LICENSE` file (MIT) and `package.json` `"license": "MIT"`
- [x] Changesets configured for versioning + npm publish via GitHub Actions (`release.yml`, `.changeset/config.json`)
- [x] Package named `pheme-ui` (unscoped), public, with `main`/`module`/`types` fields wired to `tsup` output and `sideEffects` set appropriately (`["*.css"]`, since `dist/styles.css` has side effects but the JS entries are pure)
- [x] Tailwind theme config in place per the issue's provided config (content-glob typo fixed; see Changes)
- [x] CSS variable tokens shipped for both dark (`:root` default) and light (`[data-theme="light"]`) themes, matching the design mockup; no theme-toggle component/logic in this PR
- [x] Exactly two minimal example components (`Button`, `Card`/`MessageBubble` shell) with stories + trivial render tests; no real chat implementation yet

## Suggested review scenarios

1. **Design tokens match the mockup.** Diff `src/styles/tokens.css` against
   the design artifact's `:root` block and its "Light theme" swatch — bg,
   surface, text, divider, accent ramp, neutral ramp, section colors,
   radius, shadow, spacing, font stack should all line up. `danger`/
   `success` values are a documented assumption, not sourced from the
   mockup — flag if that assumption should instead block the PR.
2. **Tailwind config fidelity.** Confirm `tailwind.config.js` matches issue
   #2's config aside from the one intentional fix (content glob's missing
   `*`) and the added `.storybook/**` glob.
3. **Consumer story works.** `pnpm install && pnpm storybook`, open both
   `Button` and `Card` stories, toggle the theme control in the toolbar,
   and confirm dark/light both render sensibly (colors, shadows, radius).
4. **Package boundaries.** Check `pnpm build` output — `dist/` should
   contain ESM, CJS, `.d.ts`, and `styles.css` only; no Tailwind
   `@tailwind` directives should leak into the shipped CSS (only plain
   custom-property declarations).
5. **CI shape.** Read the three workflow files — confirm `ci.yml` doesn't
   run on a schedule/deploy anything, `storybook-pages.yml` only triggers
   on `main`, and `release.yml` uses `changesets/action` rather than a
   hand-rolled publish step.
