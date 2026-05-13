export type PostMessageBridgeOptions = {
  frame: HTMLIFrameElement;
  allowedOrigin?: string;
  onFeedback: (message: unknown) => void;
};

export function createPostMessageBridge({ frame, allowedOrigin = "*", onFeedback }: PostMessageBridgeOptions) {
  function handler(event: MessageEvent) {
    if (event.source !== frame.contentWindow) return;
    if (allowedOrigin !== "*" && event.origin !== allowedOrigin) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;
    if ((data as { type?: string }).type !== "agent.feedback") return;
    onFeedback(data);
  }
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

export function createSandboxedIframe(srcdoc?: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.setAttribute("referrerpolicy", "no-referrer");
  iframe.setAttribute("title", "Agent artifact");
  if (srcdoc) iframe.srcdoc = srcdoc;
  return iframe;
}

export function createStrictCspMeta(): string {
  return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none';">`;
}
