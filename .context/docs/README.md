# Documentation Index

Welcome to the repository knowledge base. Start with the project overview, then dive into specific guides as needed.

## Core Guides

- [Project Overview](./project-overview.md)
- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
- [Tooling & Productivity Guide](./tooling.md)

## Architecture & Decisions

- [Architecture Decision Records (ADRs)](./adr/README.md) - Decisões arquiteturais importantes
- [Request for Comments (RFCs)](./rfc/README.md) - Propostas de mudanças técnicas

## Issues & Solutions

- [Build Issues](./issues/design-system-build-issue.md) - Issues críticas de build
- [Status Final: Resolução de Issues](./issues/final-status.md) - Status final das issues resolvidas
- [CSS Export Plan](../plans/css-export-plan.md) - Plano de exportação de CSS
- [CSS Export Implementation](./css-export-implementation.md) - Implementação da exportação de CSS
- [CSS Export Summary](./css-export-summary.md) - Resumo da exportação de CSS

## Implementation Plans

- [Build Fixes Implementation](../plans/build-fixes-implementation.md) - Plano de implementação para correções de build
- [Standalone App Removal](../plans/standalone-app-removal.md) - Plano de remoção da aplicação standalone

## Executive Summaries

- [Build Fixes Summary](./executive-summaries/build-fixes-summary.md) - Resumo executivo das correções de build
- [App Removal Summary](./executive-summaries/app-removal-summary.md) - Resumo executivo da remoção da aplicação standalone

## Completed Changes

- [Build Fixes Implementation](./completed-changes/build-fixes-implementation.md) - Mudanças implementadas para correções de build
- [Standalone App Removal](./completed-changes/standalone-app-removal.md) - Documentação da remoção concluída da aplicação standalone

## Repository Snapshot

- `CHANGELOG.md/`
- `CONTRIBUTING.md/`
- `docs/` — Living documentation produced by this tool.
- `eslint.config.js/`
- `index.html/`
- `package-lock.json/`
- `package.json/`
- `playwright.config.ts/`
- `plop-templates/`
- `plopfile.mjs/`
- `postcss.config.mjs/`
- `prettier.config.mjs/`
- `public/`
- `README.md/`
- `release.config.js/`
- `scripts/`
- `src/` — TypeScript source files and CLI entrypoints.
- `storybook-static/`
- `tests/` — Automated tests and fixtures.
- `tsconfig.app.json/`
- `tsconfig.json/`
- `tsconfig.node.json/`
- `tsconfig.storybook.json/`
- `vite.config.ts/`
- `vitest.shims.d.ts/`

## Document Map

| Guide | File | Primary Inputs |
| --- | --- | --- |
| Project Overview | `project-overview.md` | Roadmap, README, stakeholder notes |
| Development Workflow | `development-workflow.md` | Branching rules, CI config, contributing guide |
| Testing Strategy | `testing-strategy.md` | Test configs, CI gates, known flaky suites |
| Tooling & Productivity Guide | `tooling.md` | CLI scripts, IDE configs, automation workflows |
| Build Issues | `issues/design-system-build-issue.md` | Bug reports, build errors, consumer issues |
| ADRs | `adr/*.md` | Architecture decisions, context, consequences |
| RFCs | `rfc/*.md` | Technical proposals, design decisions |
| Implementation Plans | `../plans/*.md` | Task breakdown, timeline, success criteria |
| Executive Summaries | `executive-summaries/*.md` | High-level summaries of major changes |
| Completed Changes | `completed-changes/*.md` | Documentation of implemented changes |

## Quick Links

### Build & Distribution

- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)
- [ADR-0002: Provider Exports in Production Build](./adr/0002-provider-exports-in-build.md)
- [RFC-0001: Removal of Conditional Development Exports](./rfc/0001-conditional-exports-removal.md)
- [Implementation Plan](../plans/build-fixes-implementation.md)
- [Executive Summary](./executive-summaries/build-fixes-summary.md)
- [Completed Changes](./completed-changes/build-fixes-implementation.md)
