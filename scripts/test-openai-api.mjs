#!/usr/bin/env node
/**
 * Script para testar a API OpenAI (validação + chat).
 * Usa VITE_OPENAI_API_KEY do .env na raiz do projeto.
 * Uso: node scripts/test-openai-api.mjs
 *      ou: VITE_OPENAI_API_KEY=sk-... node scripts/test-openai-api.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^VITE_OPENAI_API_KEY=(.*)$/);
    if (match) {
      const value = match[1].trim().replace(/^["']|["']$/g, "");
      if (value) process.env.VITE_OPENAI_API_KEY = value;
      break;
    }
  }
}

loadEnv();

const key = process.env.VITE_OPENAI_API_KEY?.trim();

async function testModels() {
  console.log("\n1. Validando chave (GET /v1/models)...");
  const res = await fetch("https://api.openai.com/v1/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });
  console.log("   Status:", res.status, res.statusText);
  if (!res.ok) {
    const body = await res.text();
    let msg = body.slice(0, 300);
    try {
      const j = JSON.parse(body);
      if (j?.error?.message) msg = j.error.message;
    } catch {}
    console.log("   Erro:", msg);
    return false;
  }
  const data = await res.json();
  const count = data.data?.length ?? 0;
  console.log("   OK. Modelos listados:", count);
  return true;
}

async function testChat() {
  console.log("\n2. Testando chat (POST /v1/chat/completions)...");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Responda em uma frase." },
        { role: "user", content: "Diga apenas: API OK." },
      ],
      max_tokens: 50,
    }),
  });
  console.log("   Status:", res.status, res.statusText);
  if (!res.ok) {
    const body = await res.text();
    let msg = body.slice(0, 300);
    try {
      const j = JSON.parse(body);
      if (j?.error?.message) msg = j.error.message;
    } catch {}
    console.log("   Erro:", msg);
    return false;
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  console.log("   Resposta:", text || "(vazia)");
  return true;
}

async function main() {
  console.log("Teste da API OpenAI (EstrelaUI Gerador)");
  if (!key) {
    console.error("\nChave não encontrada. Defina VITE_OPENAI_API_KEY no .env na raiz do projeto ou:");
    console.error("  VITE_OPENAI_API_KEY=sk-... node scripts/test-openai-api.mjs");
    process.exit(1);
  }
  console.log("Chave:", key.slice(0, 10) + "..." + key.slice(-4));

  try {
    const modelsOk = await testModels();
    const chatOk = await testChat();
    console.log("\n--- Resultado ---");
    console.log("Validação (GET /v1/models):", modelsOk ? "OK" : "FALHOU");
    console.log("Chat (POST /v1/chat/completions):", chatOk ? "OK" : "FALHOU");
    process.exit(modelsOk && chatOk ? 0 : 1);
  } catch (err) {
    console.error("\nErro:", err.message);
    process.exit(1);
  }
}

main();
