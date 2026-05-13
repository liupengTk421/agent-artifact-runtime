# Contributing

This project is protocol-first. When adding features, change things in this order:

1. Update or draft the schema.
2. Update protocol types.
3. Add validator coverage.
4. Update renderer/component behavior.
5. Add replay fixtures.
6. Update agent-kit prompts and policies.

## Module boundaries

- `packages/protocol` defines schemas, types, versions, and constants only.
- `packages/core` owns validation, patch application, event replay, and migration.
- `packages/components` emits feedback events; it does not call agents or business APIs.
- `packages/renderer-react` renders artifact state; it does not mutate state.
- `packages/host` owns sandboxing and message boundaries.
- `services/gateway` will own trusted storage, model calls, action execution, and audit.

## Pull request checklist

- [ ] Schema changes are documented.
- [ ] Contract tests added or updated.
- [ ] Replay fixtures added for behavior changes.
- [ ] No component directly calls business APIs.
- [ ] No agent output path accepts arbitrary scripts.
