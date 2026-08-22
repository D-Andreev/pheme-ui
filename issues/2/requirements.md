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

## Acceptance criteria
- [ ] Package scaffolded with TypeScript, `tsup` build producing ESM + CJS + `.d.ts`
- [ ] Vitest test setup with `@testing-library/react`, at least one passing example test
- [ ] ESLint flat config (`typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`) with a lint script
- [ ] GitHub Actions workflow(s) running build, lint, and test on PRs/pushes
- [ ] Storybook configured (Vite builder) and able to run locally
- [ ] Changesets configured for versioning + npm publish via GitHub Actions
- [ ] Tailwind theme config in place per the issue's provided config (CSS custom-property-backed tokens)
- [ ] Minimal example component(s) with stories/docs, no real implementation yet
- [ ] ...

## Approved by human
- [ ] Pending — say `approve requirements` in the session when ready
