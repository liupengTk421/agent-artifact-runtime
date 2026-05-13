# Agent Artifact Runtime

A protocol-first runtime for human-agent artifacts: agents produce structured UI state and patches; humans provide structured feedback through rendered components; the runtime validates, logs, replays, and safely routes the interaction loop.

This repository is an initial monorepo scaffold for building:

- **Artifact State**: versioned UI/data state for an agent-generated artifact.
- **Feedback Event**: structured human feedback from forms, clicks, region annotations, text, and speech transcripts.
- **Artifact Patch**: low-token incremental updates instead of full HTML regeneration.
- **Renderer**: deterministic UI rendering from state.
- **Host Bridge**: sandboxed message bridge and feedback validation boundary.
- **Gateway**: trusted backend boundary for storage, agent calls, tool/action execution, and audit.
- **CLI / DevTools**: validate, render, replay, migrate, inspect.

## Why this exists

HTML is powerful as the interaction surface between humans and agents, but repeatedly asking models to generate full HTML is expensive and fragile. This project separates:

```text
Agent output:      UI state / semantic patch
Human feedback:    structured feedback events
Runtime output:    deterministic HTML / React / Web Components
Audit trail:       event log + artifact versions
```

## First milestone

The first milestone is a working `image-feedback` loop:

```text
agent creates artifact_state
  → renderer shows ImageAnnotator
  → user draws a box and adds text
  → host emits feedback_event
  → agent returns artifact_patch
  → core applies patch
  → event log can be replayed
```

## Repository layout

```text
packages/protocol          Protocol types and JSON schemas
packages/core              Validation, patch application, replay, migration
packages/components        React feedback components
packages/renderer-react    ArtifactState → React renderer
packages/host              iframe/postMessage host bridge and policy checks
packages/agent-kit         Context composer and model-output policy helpers
packages/cli               validate / patch / replay / render commands
apps/playground            Local demo and debugging UI
examples/image-feedback    Minimal working example fixture
tasks/issues.json          Development tasks for GitHub issue creation
scripts/bootstrap-github.sh One-command GitHub repository setup script
```

## Quick start

```bash
corepack enable
pnpm install
pnpm build
pnpm test
```

Run the playground:

```bash
pnpm dev
```

Validate and replay the example:

```bash
pnpm artifact validate examples/image-feedback/artifact.state.json
pnpm artifact replay --state examples/image-feedback/initial.state.json --events examples/image-feedback/events.jsonl
```

## Create the GitHub repository

The current ChatGPT GitHub connector available in this session does not expose write operations, so the repository scaffold includes a script that creates the repo and issues through GitHub CLI:

```bash
cd agent-artifact-runtime
./scripts/bootstrap-github.sh
```

By default, it creates a **private** repository named `agent-artifact-runtime` under the authenticated GitHub account. To create a public repository:

```bash
PUBLIC=1 ./scripts/bootstrap-github.sh
```

To use a different name:

```bash
REPO_NAME=my-runtime ./scripts/bootstrap-github.sh
```

## Development principle

Do not let agents emit arbitrary HTML in production. Let agents emit structured state, feedback interpretations, and patches. Let the runtime render trusted components and validate every transition.
