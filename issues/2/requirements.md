# Requirements: issue-2

## Original ask
Create initial structure of project. This will be a react library with different UI components to build AI chats.

For this PR let's focus on initial structure, github actions to build, lint and test. Storybook config to display elements.

For design we'll use https://claude.ai/code/artifact/c170f2a6-0cf7-4231-8b97-9e7edd929465 . If you can't read this let me know and I'll upload it manually.

This will be the tailwind config
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
theme: {
extend: {
colors: {
bg: "var(--color-bg)",
surface: "var(--color-surface)",
text: "var(--color-text)",
divider: "var(--color-divider)",
... (full config provided in issue body, see GitHub issue #2 for source of truth)
},
},
},
plugins: [],
};

ACs:

Initial structure, typescript, build, test, lint.
Storybook config
Library publish to npm config
Example components use and docs, but very minimal, no implementation yet.
Tailwind theme config.

## Clarifications
| # | Question | Answer | Recommended |
|---|----------|--------|-------------|
| 1 | What toolchain (package manager, bundler, test runner, lint, Storybook builder, publish flow)? | Accepted recommendation: pnpm; `tsup` (ESM+CJS+d.ts); Vitest + `@testing-library/react`; ESLint flat config + `typescript-eslint` + `eslint-plugin-react`/`react-hooks`; Storybook latest (Vite builder); Changesets for versioning/changelog/npm publish via GitHub Actions; React `>=18` peer dep; Node `>=20` | pnpm, tsup, Vitest, ESLint flat config, Storybook (Vite builder), Changesets, React >=18, Node >=20 |
| 2 | Which components ship as "minimal examples" in this initial PR, given the design mockup covers messages, reasoning/tool calls, rich text/code/math, media, sources/charts, composer, mobile, and light theme? | Accepted recommendation: structure only — 2-3 foundational primitives (`Button` and a `Card`/`MessageBubble` shell, no real chat logic), each with a story + trivial render test. Rest of the mockup's component inventory becomes backlog for follow-up issues. | Button + Card/MessageBubble shell only; rest deferred |
| 3 | Should this PR ship both dark (default) and light theme CSS variable tokens, or defer light theme? | Accepted recommendation: ship CSS variable tokens for both themes (dark `:root` defaults + `[data-theme="light"]` override), Tailwind wired to those variables per the issue's config. No theme-toggle component/logic yet — that's product code. | Ship both themes' tokens now; no toggle logic |
| 4 | What npm package name/scope, and public or private? | Accepted recommendation: unscoped `pheme-ui`, public npm package, `package.json` `main`/`module`/`types` pointing at `tsup` output, `sideEffects: false` | Unscoped `pheme-ui`, public |
| 5 | Should Storybook be deployed (GitHub Pages/Chromatic) in this PR, or local-only? | **Rejected recommendation** — deploy Storybook to GitHub Pages via a GitHub Actions workflow that runs on merge to `main` (not local-only) | Local-only; CI builds as smoke test, no deploy |
| 6 | Should the library bundle/ship the Inter font, or just declare the font-family stack and leave loading to the consumer? | Accepted recommendation: don't bundle a font; keep `"Inter", "system-ui", "sans-serif"` stack as-is in Tailwind config, consumer owns font loading | Declare stack only; consumer loads font |
| 7 | What license for the public npm package? | Accepted recommendation: MIT | MIT |
| 8 | Is the "demo" the Storybook-on-Pages deployment, or a separate standalone demo app? | Accepted recommendation: Storybook deployed to GitHub Pages **is** the demo; no separate demo app | Storybook on Pages = the demo |

## Acceptance criteria
- [ ] Package scaffolded with TypeScript, `tsup` build producing ESM + CJS + `.d.ts`
- [ ] Vitest test setup with `@testing-library/react`, at least one passing example test
- [ ] ESLint flat config (`typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`) with a lint script
- [ ] GitHub Actions workflow(s) running build, lint, and test on PRs/pushes
- [ ] Storybook configured (Vite builder) and able to run locally
- [ ] CI includes a `storybook build` smoke-test job on PRs; a separate GitHub Actions workflow deploys Storybook to GitHub Pages on merge to `main` — this deployed Storybook **is** the project's demo (no separate demo app)
- [ ] Tailwind `fontFamily` keeps the `"Inter", "system-ui", "sans-serif"` stack as declared; no font files/packages bundled in the library
- [ ] `LICENSE` file (MIT) and `package.json` `"license": "MIT"`
- [ ] Changesets configured for versioning + npm publish via GitHub Actions
- [ ] Package named `pheme-ui` (unscoped), public, with `main`/`module`/`types` fields wired to `tsup` output and `sideEffects: false`
- [ ] Tailwind theme config in place per the issue's provided config (CSS custom-property-backed tokens)
- [ ] CSS variable tokens shipped for both dark (`:root` default) and light (`[data-theme="light"]`) themes, matching the design mockup; no theme-toggle component/logic in this PR
- [ ] Exactly two minimal example components (`Button`, `Card`/`MessageBubble` shell) with stories + trivial render tests; no real chat implementation yet

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
