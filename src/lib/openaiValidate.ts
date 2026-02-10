/**
 * Validação da chave da API OpenAI (conexão e indicação de billing).
 * Usa GET /v1/models como endpoint leve para verificar autenticação.
 */

export type ValidateResult =
  | { ok: true; message: string }
  | { ok: false; message: string; code?: "invalid_key" | "billing" | "rate_limit" | "network" };

export async function validateOpenAIKey(apiKey: string): Promise<ValidateResult> {
  const key = apiKey?.trim();
  if (!key) {
    return { ok: false, message: "Chave não informada.", code: "invalid_key" };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      return { ok: true, message: "Chave válida. Conexão com a OpenAI OK." };
    }

    const body = await res.text();
    let parsed: { error?: { message?: string; code?: string; type?: string } } = {};
    try {
      parsed = JSON.parse(body);
    } catch {
      // body não é JSON
    }

    const msg = parsed?.error?.message ?? body.slice(0, 200);

    switch (res.status) {
      case 401:
        return {
          ok: false,
          message: `Chave inválida ou revogada. Verifique em https://platform.openai.com/api-keys. ${msg ? `Detalhe: ${msg}` : ""}`,
          code: "invalid_key",
        };
      case 402:
        return {
          ok: false,
          message: "Pagamento ou billing necessário. Confira em https://platform.openai.com/account/billing.",
          code: "billing",
        };
      case 429:
        return {
          ok: false,
          message: `Limite de uso ou taxa excedida. Pode ser billing ou rate limit. ${msg ? `Detalhe: ${msg}` : ""}`,
          code: "rate_limit",
        };
      default:
        return {
          ok: false,
          message: `OpenAI retornou ${res.status}. ${msg || ""}`,
          code: "invalid_key",
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro de rede ou timeout.";
    return { ok: false, message: `Não foi possível validar a chave. ${message}`, code: "network" };
  }
}
