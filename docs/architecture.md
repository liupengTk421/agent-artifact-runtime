# Architecture

The runtime is centered on three protocol objects:

```text
ArtifactState     what is being shown
FeedbackEvent     what the human did or said
ArtifactPatch     how the agent wants to change the artifact
```

The runtime guarantees that artifacts evolve through validated patches and logged events.

## Flow

```text
ArtifactState → Renderer → Human interaction → FeedbackEvent → Agent → ArtifactPatch → Core → ArtifactState(version+1)
```

## Boundaries

- Components emit events, not API calls.
- Agents emit patches, not arbitrary UI code.
- Core applies patches, not business actions.
- Gateway executes actions after permission checks.
