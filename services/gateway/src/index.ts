export type GatewayStatus = {
  ok: true;
  service: "agent-artifact-gateway";
};

export function status(): GatewayStatus {
  return { ok: true, service: "agent-artifact-gateway" };
}
