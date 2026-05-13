import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { ArtifactComponentProps } from "../shared/FeedbackEmitter.js";
import { normalizeBox, type NormalizedBox } from "./geometry.js";

export type ImageAnnotation = { id: string; type: string; region?: NormalizedBox; text?: string; status?: string };
export type ImageAnnotatorProps = {
  image_id: string;
  image_uri?: string;
  title?: string;
  tools?: Array<"point" | "box" | "text">;
  annotations?: ImageAnnotation[];
};

export function ImageAnnotator({ artifactId, artifactVersion, props, emitFeedback }: ArtifactComponentProps<ImageAnnotatorProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState<NormalizedBox | null>(null);
  const [text, setText] = useState("");

  function pointFromEvent(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, rect };
  }

  return (
    <section>
      <h2>{props.title ?? "Image feedback"}</h2>
      <div
        ref={containerRef}
        role="img"
        aria-label="Annotatable image"
        onPointerDown={(event) => {
          const point = pointFromEvent(event);
          setStart({ x: point.x, y: point.y });
        }}
        onPointerUp={(event) => {
          if (!start) return;
          const point = pointFromEvent(event);
          setBox(normalizeBox(start, { x: point.x, y: point.y }, point.rect));
          setStart(null);
        }}
        style={{ position: "relative", width: "100%", minHeight: 320, border: "1px solid #ddd", display: "grid", placeItems: "center", userSelect: "none" }}
      >
        {props.image_uri ? <img src={props.image_uri} alt="Target" style={{ maxWidth: "100%", display: "block" }} /> : <p>Image asset: {props.image_id}</p>}
        {props.annotations?.map((annotation) => annotation.region ? (
          <div key={annotation.id} title={annotation.text} style={{
            position: "absolute",
            left: `${annotation.region.x1 * 100}%`,
            top: `${annotation.region.y1 * 100}%`,
            width: `${(annotation.region.x2 - annotation.region.x1) * 100}%`,
            height: `${(annotation.region.y2 - annotation.region.y1) * 100}%`,
            border: "2px solid currentColor",
            pointerEvents: "none"
          }} />
        ) : null)}
      </div>
      <textarea value={text} onChange={(event) => setText(event.currentTarget.value)} placeholder="Describe what should change in the selected area…" style={{ width: "100%", minHeight: 80, marginTop: 8 }} />
      <button
        type="button"
        disabled={!box}
        onClick={() => {
          if (!box) return;
          emitFeedback({
            schema: "agent.feedback.v1",
            artifact_id: artifactId,
            artifact_version: artifactVersion,
            event_type: "box_comment",
            target: { kind: "image", asset_id: props.image_id },
            payload: { region: box, text },
            source: { component: "ImageAnnotator", input_method: "pointer+text" }
          });
        }}
      >
        Submit region feedback
      </button>
    </section>
  );
}
