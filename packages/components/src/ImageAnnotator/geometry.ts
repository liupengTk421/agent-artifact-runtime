export type NormalizedBox = {
  type: "box";
  coordinate_system: "normalized";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function normalizeBox(start: { x: number; y: number }, end: { x: number; y: number }, rect: DOMRect): NormalizedBox {
  const x1 = Math.min(start.x, end.x) / rect.width;
  const y1 = Math.min(start.y, end.y) / rect.height;
  const x2 = Math.max(start.x, end.x) / rect.width;
  const y2 = Math.max(start.y, end.y) / rect.height;
  return {
    type: "box",
    coordinate_system: "normalized",
    x1: Number(x1.toFixed(4)),
    y1: Number(y1.toFixed(4)),
    x2: Number(x2.toFixed(4)),
    y2: Number(y2.toFixed(4))
  };
}
