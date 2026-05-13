# Threat Model

## Trust assumptions

- Agent output is untrusted until validated.
- User feedback is untrusted until validated.
- Components are trusted only if they come from the approved catalog.

## Main risks

- Arbitrary script injection.
- Unknown action execution.
- Version-confused patch application.
- Asset exfiltration through external URLs.
- Prompt injection through feedback text.

## Default mitigations

- Component registry allowlist.
- JSON Schema validation.
- Patch `base_version` checks.
- Action registry with explicit confirmation.
- Event log audit.
- Sandboxed iframe for untrusted HTML export.
