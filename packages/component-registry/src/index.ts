export type ComponentSpec = {
  name: string;
  version: string;
  propsSchema: Record<string, unknown>;
  events: string[];
  actions?: string[];
  features?: string[];
};

export const DecisionPanelSpec: ComponentSpec = {
  name: "DecisionPanel",
  version: "1.0.0",
  propsSchema: {
    type: "object",
    required: ["title", "options"],
    properties: {
      title: { type: "string" },
      options: { type: "array" }
    }
  },
  events: ["choice_selected", "decision"]
};

export const TextFeedbackBoxSpec: ComponentSpec = {
  name: "TextFeedbackBox",
  version: "1.0.0",
  propsSchema: {
    type: "object",
    properties: {
      placeholder: { type: "string" },
      value: { type: "string" }
    }
  },
  events: ["text_feedback"]
};

export const ImageAnnotatorSpec: ComponentSpec = {
  name: "ImageAnnotator",
  version: "1.0.0",
  propsSchema: {
    type: "object",
    required: ["image_id", "tools"],
    properties: {
      image_id: { type: "string" },
      image_uri: { type: "string" },
      tools: { type: "array", items: { enum: ["point", "box", "text"] } },
      annotations: { type: "array" }
    }
  },
  events: ["point_comment", "box_comment", "text_feedback"],
  features: ["normalized_coordinates"]
};

export const defaultComponentRegistry = {
  DecisionPanel: DecisionPanelSpec,
  TextFeedbackBox: TextFeedbackBoxSpec,
  ImageAnnotator: ImageAnnotatorSpec
} as const;

export function createCatalog(version = "2026-05-13.base") {
  return {
    schema: "component.catalog.v1",
    version,
    components: defaultComponentRegistry
  };
}
