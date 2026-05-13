import type { ArtifactPatch, ArtifactState, FeedbackEvent } from "@agent-artifact-runtime/protocol";
import { applyArtifactPatch } from "../patch/applyPatch.js";

export type RuntimeEvent =
  | { type: "feedback"; event: FeedbackEvent }
  | { type: "patch"; patch: ArtifactPatch };

export function replayEvents(initialState: ArtifactState, events: RuntimeEvent[]): ArtifactState {
  return events.reduce((state, event) => {
    if (event.type === "patch") return applyArtifactPatch(state, event.patch);
    return state;
  }, initialState);
}
