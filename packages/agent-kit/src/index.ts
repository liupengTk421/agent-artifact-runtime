import type { ArtifactState, FeedbackEvent, CapabilityManifest } from "@agent-artifact-runtime/protocol";

export type ContextBudget = {
  maxInputTokens?: number;
  maxOutputTokens?: number;
  preferredOutput?: "patch" | "state" | "html";
};

export function composePatchContext(args: {
  state: ArtifactState;
  feedback: FeedbackEvent;
  manifest?: CapabilityManifest;
  budget?: ContextBudget;
}) {
  return {
    task: "generate_artifact_patch",
    artifact: {
      artifact_id: args.state.artifact_id,
      version: args.state.version,
      view: args.state.view,
      props: args.state.props
    },
    feedback: args.feedback,
    capabilities: args.manifest,
    output_contract: {
      schema: "artifact.patch.v1",
      must_match_base_version: args.state.version,
      preferred_output: args.budget?.preferredOutput ?? "patch",
      max_output_tokens: args.budget?.maxOutputTokens ?? 800
    }
  };
}

export function patchSystemInstruction() {
  return [
    "You update agent artifacts by returning artifact.patch.v1 JSON only.",
    "Do not return full HTML unless explicitly requested by the host capability manifest.",
    "Every patch must include artifact_id, base_version, and JSON Patch operations.",
    "Never invent unsupported components or actions."
  ].join("\n");
}
