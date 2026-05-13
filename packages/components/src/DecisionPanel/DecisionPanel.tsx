import type { ArtifactComponentProps } from "../shared/FeedbackEmitter.js";

export type DecisionOption = { id: string; label: string; description?: string };
export type DecisionPanelProps = {
  title: string;
  summary?: string;
  options: DecisionOption[];
};

export function DecisionPanel({ artifactId, artifactVersion, props, emitFeedback }: ArtifactComponentProps<DecisionPanelProps>) {
  return (
    <section>
      <h2>{props.title}</h2>
      {props.summary ? <p>{props.summary}</p> : null}
      <div style={{ display: "grid", gap: 8 }}>
        {props.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => emitFeedback({
              schema: "agent.feedback.v1",
              artifact_id: artifactId,
              artifact_version: artifactVersion,
              event_type: "choice_selected",
              payload: { option_id: option.id, label: option.label },
              source: { component: "DecisionPanel" }
            })}
          >
            <strong>{option.label}</strong>
            {option.description ? <span> — {option.description}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
