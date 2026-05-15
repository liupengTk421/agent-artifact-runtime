import { describe, expect, it } from "vitest";
import { applyArtifactPatch, PatchApplyError } from "./applyPatch.js";
import type { ArtifactPatch, ArtifactState } from "@agent-artifact-runtime/protocol";

describe("applyArtifactPatch", () => {
  const baseState: ArtifactState = {
    schema: "artifact.state.v1",
    artifact_id: "art_1",
    version: 1,
    view: "ImageFeedbackPanel",
    props: { annotations: [{ id: "ann_0" }] }
  };

  it("adds an annotation and increments version", () => {
    const patch: ArtifactPatch = {
      schema: "artifact.patch.v1",
      artifact_id: "art_1",
      base_version: 1,
      ops: [{ op: "add", path: "/props/annotations/-", value: { id: "ann_1" } }]
    };

    const next = applyArtifactPatch(baseState, patch);

    expect(next.version).toBe(2);
    expect((next.props.annotations as unknown[])).toHaveLength(2);
    expect((baseState.props.annotations as unknown[])).toHaveLength(1);
  });

  it("throws when array add index is out of bounds", () => {
    const patch: ArtifactPatch = {
      schema: "artifact.patch.v1",
      artifact_id: "art_1",
      base_version: 1,
      ops: [{ op: "add", path: "/props/annotations/3", value: { id: "ann_1" } }]
    };

    expect(() => applyArtifactPatch(baseState, patch)).toThrowError(PatchApplyError);
    expect(() => applyArtifactPatch(baseState, patch)).toThrowError("Invalid array index: 3");
  });

  it("throws when removing from negative array index", () => {
    const patch: ArtifactPatch = {
      schema: "artifact.patch.v1",
      artifact_id: "art_1",
      base_version: 1,
      ops: [{ op: "remove", path: "/props/annotations/-1" }]
    };

    expect(() => applyArtifactPatch(baseState, patch)).toThrowError("Invalid array index: -1");
  });

  it("throws when patch base version does not match", () => {
    const patch: ArtifactPatch = {
      schema: "artifact.patch.v1",
      artifact_id: "art_1",
      base_version: 2,
      ops: [{ op: "test", path: "/version", value: 1 }]
    };

    expect(() => applyArtifactPatch(baseState, patch)).toThrowError("Patch base_version 2 does not match state version 1");
  });
});
