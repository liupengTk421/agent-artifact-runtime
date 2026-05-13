import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ArtifactRenderer } from "@agent-artifact-runtime/renderer-react";
import { applyArtifactPatch } from "@agent-artifact-runtime/core";
import type { ArtifactPatch, ArtifactState, FeedbackEvent } from "@agent-artifact-runtime/protocol";

const initialState: ArtifactState = {
  schema: "artifact.state.v1",
  artifact_id: "art_img_001",
  version: 1,
  view: "ImageFeedbackPanel",
  props: {
    image_id: "img_001",
    title: "Image feedback demo",
    tools: ["point", "box", "text"],
    annotations: []
  },
  actions: [
    { id: "submit_feedback", label: "Submit feedback", side_effect: false },
    { id: "regenerate_region", label: "Regenerate region", side_effect: true, requires_confirmation: true }
  ]
};

function createMockPatch(state: ArtifactState, event: FeedbackEvent): ArtifactPatch {
  return {
    schema: "artifact.patch.v1",
    artifact_id: state.artifact_id,
    base_version: state.version,
    ops: [
      {
        op: "add",
        path: "/props/annotations/-",
        value: {
          id: `ann_${Date.now()}`,
          type: event.event_type,
          region: event.payload.region,
          text: event.payload.text,
          status: "pending"
        }
      }
    ]
  };
}

function App() {
  const [state, setState] = useState(initialState);
  const [events, setEvents] = useState<unknown[]>([]);

  function onFeedback(event: FeedbackEvent) {
    const patch = createMockPatch(state, event);
    const next = applyArtifactPatch(state, patch);
    setEvents((all) => [...all, { type: "feedback", event }, { type: "patch", patch }]);
    setState(next);
  }

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Agent Artifact Runtime Playground</h1>
      <p>Draw a box in the image area, enter feedback, and submit it. The mock agent will return an artifact patch.</p>
      <ArtifactRenderer state={state} onFeedback={onFeedback} />
      <h2>Current state</h2>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 16 }}>{JSON.stringify(state, null, 2)}</pre>
      <h2>Event log</h2>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 16 }}>{JSON.stringify(events, null, 2)}</pre>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
