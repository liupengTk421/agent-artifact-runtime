# Security Policy

Agent-generated content is considered untrusted unless it has been validated and rendered through approved components.

## Rules

- Do not execute arbitrary model-generated JavaScript.
- Do not let artifact components directly call production APIs.
- All feedback events must pass schema validation.
- All patches must include `base_version` and must be applied only to the matching artifact version.
- Unknown actions are rejected by default.
- Side-effectful actions must require explicit confirmation.
- For untrusted HTML export, render inside a sandboxed iframe with a restrictive CSP.

## Reporting

Open a private security advisory or contact the maintainers directly before public disclosure.
