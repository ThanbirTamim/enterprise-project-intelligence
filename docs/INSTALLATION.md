# Installation

## Requirements

- Node.js >= 18 (the reference scripts use only built-in Node APIs; no install step is required to
  run them).
- An AI coding agent that supports the Agent Skills convention (a `SKILL.md` file with YAML
  frontmatter per skill directory), to actually use the skills as agent instructions.

## Option A — clone and use locally

```bash
git clone https://github.com/ThanbirTamim/enterprise-project-intelligence.git
cd enterprise-project-intelligence
node scripts/cli.mjs list
```

Point your agent's skills directory at this repo's `skills/` folder, or copy individual
`skills/<name>/` directories into your agent's own skills directory.

## Option B — install as an npm package

Published at
[`@thanbir-tamim/enterprise-project-intelligence-agent`](https://www.npmjs.com/package/@thanbir-tamim/enterprise-project-intelligence-agent):

```bash
npm install -g @thanbir-tamim/enterprise-project-intelligence-agent
```

Before any new release, run:

```bash
npm run validate
npm test
npm run release-audit
npm run pack:dry-run   # inspect exactly what would be published
```

and manually review the dry-run tarball contents — the automated checks are a safeguard, not a
guarantee of confidentiality (see `SECURITY.md`).

## Dependency philosophy

The toolkit intentionally ships with zero required third-party dependencies. If you add an optional
dependency (e.g., a real PPTX/DOCX/PDF parser) to extend format support, document it explicitly in
`docs/SUPPORTED_FORMATS.md` and add it as an optional peer dependency, not a hard requirement.
