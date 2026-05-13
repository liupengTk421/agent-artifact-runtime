import { describe, expect, it } from "vitest";
import { ARTIFACT_PATCH_SCHEMA, ARTIFACT_STATE_SCHEMA, FEEDBACK_EVENT_SCHEMA } from "./index.js";

describe("protocol constants", () => {
  it("exports stable v1 schema identifiers", () => {
    expect(ARTIFACT_STATE_SCHEMA).toBe("artifact.state.v1");
    expect(FEEDBACK_EVENT_SCHEMA).toBe("agent.feedback.v1");
    expect(ARTIFACT_PATCH_SCHEMA).toBe("artifact.patch.v1");
  });
});
