import { useState } from "react";
import type { ArtifactComponentProps } from "../shared/FeedbackEmitter.js";

export type TextFeedbackBoxProps = {
  placeholder?: string;
  value?: string;
  submitLabel?: string;
};

export function TextFeedbackBox({ artifactId, artifactVersion, props, emitFeedback }: ArtifactComponentProps<TextFeedbackBoxProps>) {
  const [value, setValue] = useState(props.value ?? "");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        emitFeedback({
          schema: "agent.feedback.v1",
          artifact_id: artifactId,
          artifact_version: artifactVersion,
          event_type: "text_feedback",
          payload: { text: value },
          source: { component: "TextFeedbackBox" }
        });
      }}
    >
      <textarea
        value={value}
        placeholder={props.placeholder ?? "Write feedback…"}
        onChange={(event) => setValue(event.currentTarget.value)}
        style={{ width: "100%", minHeight: 96 }}
      />
      <button type="submit">{props.submitLabel ?? "Submit feedback"}</button>
    </form>
  );
}
