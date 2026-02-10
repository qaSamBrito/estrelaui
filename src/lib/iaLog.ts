/**
 * Logs da integração com IA (OpenAI / URL).
 * - Sempre: console.debug (request/response).
 * - Produção: defina VITE_IA_LOG_URL no .env para enviar os mesmos payloads a um
 *   coletor de logs (POST JSON com type "request" | "response", timestamp, provider, status, etc.).
 */

const LOG_URL =
  typeof import.meta !== "undefined" && (import.meta as unknown as { env?: { VITE_IA_LOG_URL?: string } }).env?.VITE_IA_LOG_URL;

export type IALogRequest = {
  type: "request";
  provider: string;
  promptLength: number;
  promptPreview: string;
  timestamp: number;
};

export type IALogResponse = {
  type: "response";
  status: string;
  textLength?: number;
  message?: string;
  timestamp: number;
};

function sendToMonitoring(payload: IALogRequest | IALogResponse): void {
  if (!LOG_URL || typeof fetch === "undefined") return;
  try {
    fetch(LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget; não interromper o fluxo em caso de falha do coletor
    });
  } catch {
    // ignore
  }
}

export function logIARequest(payload: Omit<IALogRequest, "type" | "timestamp">): void {
  const full: IALogRequest = { ...payload, type: "request", timestamp: Date.now() };
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[IA] request", payload);
  }
  sendToMonitoring(full);
}

export function logIAResponse(payload: Omit<IALogResponse, "type" | "timestamp">): void {
  const full: IALogResponse = { ...payload, type: "response", timestamp: Date.now() };
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[IA] response", payload);
  }
  sendToMonitoring(full);
}
