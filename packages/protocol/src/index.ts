export const ARTIFACT_STATE_SCHEMA = "artifact.state.v1" as const;
export const FEEDBACK_EVENT_SCHEMA = "agent.feedback.v1" as const;
export const ARTIFACT_PATCH_SCHEMA = "artifact.patch.v1" as const;
export const CAPABILITY_MANIFEST_SCHEMA = "capability.manifest.v1" as const;

export type ArtifactAction = {
  id: string;
  label: string;
  side_effect?: boolean;
  requires_confirmation?: boolean;
  required_permission?: string;
};

export type AssetReference = {
  asset_id: string;
  type: string;
  uri?: string;
  width?: number;
  height?: number;
  hash?: string;
};

export type ArtifactState = {
  schema: typeof ARTIFACT_STATE_SCHEMA;
  artifact_id: string;
  version: number;
  view: string;
  props: Record<string, unknown>;
  assets?: AssetReference[];
  actions?: ArtifactAction[];
  metadata?: Record<string, unknown>;
};

export type FeedbackTarget = {
  kind?: string;
  asset_id?: string;
  component_id?: string;
  [key: string]: unknown;
};

export type FeedbackEvent = {
  schema: typeof FEEDBACK_EVENT_SCHEMA;
  event_id?: string;
  artifact_id: string;
  artifact_version: number;
  event_type: string;
  target?: FeedbackTarget;
  payload: Record<string, unknown>;
  source?: Record<string, unknown>;
  created_at?: string;
};

export type JsonPatchOperation =
  | { op: "add"; path: string; value: unknown }
  | { op: "replace"; path: string; value: unknown }
  | { op: "remove"; path: string }
  | { op: "test"; path: string; value: unknown };

export type ArtifactPatch = {
  schema: typeof ARTIFACT_PATCH_SCHEMA;
  artifact_id: string;
  base_version: number;
  ops: JsonPatchOperation[];
  metadata?: Record<string, unknown>;
};

export type ComponentCapability = {
  version: string;
  events?: string[];
  actions?: string[];
  props_schema?: Record<string, unknown>;
  features?: string[];
};

export type CapabilityManifest = {
  schema: typeof CAPABILITY_MANIFEST_SCHEMA;
  runtime: { name: string; version: string };
  protocols: Record<string, string[]>;
  components: Record<string, ComponentCapability>;
  actions?: Record<string, Record<string, unknown>>;
  budget?: Record<string, unknown>;
};
