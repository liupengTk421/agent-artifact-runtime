import type { ArtifactState, FeedbackEvent } from "@agent-artifact-runtime/protocol";
import { DecisionPanel, ImageAnnotator, TextFeedbackBox } from "@agent-artifact-runtime/components";

export type ArtifactRendererProps = {
  state: ArtifactState;
  onFeedback: (event: FeedbackEvent) => void;
};

export function ArtifactRenderer({ state, onFeedback }: ArtifactRendererProps) {
  const common = {
    artifactId: state.artifact_id,
    artifactVersion: state.version,
    emitFeedback: onFeedback
  };

  switch (state.view) {
    case "DecisionPanel":
      return <DecisionPanel {...common} props={state.props as any} />;
    case "TextFeedbackBox":
      return <TextFeedbackBox {...common} props={state.props as any} />;
    case "ImageAnnotator":
    case "ImageFeedbackPanel":
      return <ImageAnnotator {...common} props={state.props as any} />;
    default:
      return (
        <section>
          <h2>Unknown artifact view</h2>
          <p>{state.view}</p>
          <pre>{JSON.stringify(state.props, null, 2)}</pre>
        </section>
      );
  }
}
