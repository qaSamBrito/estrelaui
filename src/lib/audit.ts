/**
 * Auditoria - UID00001-2026
 * Registro de ações para rastreabilidade e consulta.
 * Persistência em localStorage (substituível por API).
 */

export type AuditAction =
  | "gerador.tela_criada"
  | "gerador.tela_editada"
  | "gerador.tela_excluida"
  | "gerador.tela_concluida"
  | "componente.sugestao_criada"
  | "componente.sugestao_editada"
  | "componente.sugestao_aprovada"
  | "componente.sugestao_recusada";

export type AuditEntry = {
  id: string;
  action: AuditAction;
  entityId?: string;
  entityName?: string;
  details?: Record<string, unknown>;
  timestamp: number;
  userAgent?: string;
};

const AUDIT_KEY = "estrelaui-audit";
const MAX_ENTRIES = 500;

function loadAudit(): AuditEntry[] {
  try {
    const stored = localStorage.getItem(AUDIT_KEY);
    if (stored) return JSON.parse(stored) as AuditEntry[];
  } catch {
    // ignore
  }
  return [];
}

function saveAudit(entries: AuditEntry[]) {
  const trimmed = entries.slice(-MAX_ENTRIES);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(trimmed));
}

export function logAudit(
  action: AuditAction,
  opts?: { entityId?: string; entityName?: string; details?: Record<string, unknown> }
) {
  const entry: AuditEntry = {
    id: crypto?.randomUUID?.() ?? String(Date.now()),
    action,
    entityId: opts?.entityId,
    entityName: opts?.entityName,
    details: opts?.details,
    timestamp: Date.now(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
  const entries = [...loadAudit(), entry];
  saveAudit(entries);
  return entry;
}

export function getAudit(filters?: {
  action?: AuditAction;
  entityId?: string;
  since?: number;
}): AuditEntry[] {
  let entries = loadAudit();
  if (filters?.action) entries = entries.filter((e) => e.action === filters.action);
  if (filters?.entityId) entries = entries.filter((e) => e.entityId === filters.entityId);
  if (filters?.since) entries = entries.filter((e) => e.timestamp >= filters.since!);
  entries = entries.sort((a, b) => b.timestamp - a.timestamp);
  return entries;
}
