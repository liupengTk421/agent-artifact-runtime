import type { FeedbackEvent } from "@agent-artifact-runtime/protocol";

export type FeedbackEmitter = (event: FeedbackEvent) => void;

export type ArtifactComponentProps<TProps = Record<string, unknown>> = {
  artifactId: string;
  artifactVersion: number;
  props: TProps;
  emitFeedback: FeedbackEmitter;
};
