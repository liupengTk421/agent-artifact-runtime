import { describe, expect, it } from "vitest";
import { applyArtifactPatch } from "./applyPatch.js";
import type { ArtifactPatch, ArtifactState } from "@agent-artifact-runtime/protocol";

describe("applyArtifactPatch", () => {
  it("adds an annotation and increments version", () => {
    const state: ArtifactState = {
      schema: "artifact.state.v1",
      artifact_id: "art_1",
      version: 1,
      view: "ImageFeedbackPanel",
      props: { annotations: [] }
    };
    const patch: ArtifactPatch = {
      schema: "artifact.patch.v1",
      artifact_id: "art_1",
      base_version: 1,
      ops: [{ op: "add", path: "/props/annotations/-", value: { id: "ann_1" } }]
    };
    const next = applyArtifactPatch(state, patch);
    expect(next.version).toBe(2);
    expect((next.props.annotations as unknown[])).toHaveLength(1);
  });
});
