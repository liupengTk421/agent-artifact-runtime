import type { ArtifactPatch, ArtifactState, JsonPatchOperation } from "@agent-artifact-runtime/protocol";

export class PatchApplyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PatchApplyError";
  }
}

function clone<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function parsePath(path: string): string[] {
  if (path === "") return [];
  if (!path.startsWith("/")) throw new PatchApplyError(`Invalid JSON pointer: ${path}`);
  return path
    .slice(1)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function getParent(doc: any, path: string): { parent: any; key: string } {
  const parts = parsePath(path);
  if (parts.length === 0) throw new PatchApplyError("Cannot modify document root in this runtime");
  let current = doc;
  for (const part of parts.slice(0, -1)) {
    if (current == null || !(part in current)) throw new PatchApplyError(`Path not found: ${path}`);
    current = current[part];
  }
  return { parent: current, key: parts[parts.length - 1] };
}

function readPath(doc: any, path: string): unknown {
  const parts = parsePath(path);
  let current = doc;
  for (const part of parts) {
    if (current == null || !(part in current)) throw new PatchApplyError(`Path not found: ${path}`);
    current = current[part];
  }
  return current;
}

function parseArrayIndex(key: string, path: string): number {
  const index = Number(key);
  if (!Number.isInteger(index)) throw new PatchApplyError(`Invalid array index: ${key}`);
  if (index < 0) throw new PatchApplyError(`Invalid array index: ${key}`);
  return index;
}

function applyOp(doc: any, op: JsonPatchOperation): void {
  if (op.op === "test") {
    const actual = readPath(doc, op.path);
    if (JSON.stringify(actual) !== JSON.stringify(op.value)) {
      throw new PatchApplyError(`Test operation failed at ${op.path}`);
    }
    return;
  }

  const { parent, key } = getParent(doc, op.path);

  if (op.op === "remove") {
    if (Array.isArray(parent)) {
      const index = parseArrayIndex(key, op.path);
      if (index >= parent.length) throw new PatchApplyError(`Invalid array index: ${key}`);
      parent.splice(index, 1);
    } else {
      if (!(key in parent)) throw new PatchApplyError(`Path not found: ${op.path}`);
      delete parent[key];
    }
    return;
  }

  if (op.op === "add") {
    if (Array.isArray(parent)) {
      if (key === "-") {
        parent.push(op.value);
      } else {
        const index = parseArrayIndex(key, op.path);
        if (index > parent.length) throw new PatchApplyError(`Invalid array index: ${key}`);
        parent.splice(index, 0, op.value);
      }
    } else {
      parent[key] = op.value;
    }
    return;
  }

  if (op.op === "replace") {
    if (Array.isArray(parent)) {
      const index = parseArrayIndex(key, op.path);
      if (index >= parent.length) {
        throw new PatchApplyError(`Invalid array index: ${key}`);
      }
      parent[index] = op.value;
    } else {
      if (!(key in parent)) throw new PatchApplyError(`Path not found: ${op.path}`);
      parent[key] = op.value;
    }
    return;
  }

  throw new PatchApplyError(`Unsupported op: ${(op as { op: string }).op}`);
}

export function applyArtifactPatch(state: ArtifactState, patch: ArtifactPatch): ArtifactState {
  if (patch.artifact_id !== state.artifact_id) {
    throw new PatchApplyError(`Patch artifact_id ${patch.artifact_id} does not match state ${state.artifact_id}`);
  }
  if (patch.base_version !== state.version) {
    throw new PatchApplyError(`Patch base_version ${patch.base_version} does not match state version ${state.version}`);
  }
  const next = clone(state);
  for (const op of patch.ops) applyOp(next, op);
  next.version = state.version + 1;
  return next;
}
