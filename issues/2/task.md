# Task: issue-2

## Title
Initial structure of project

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
