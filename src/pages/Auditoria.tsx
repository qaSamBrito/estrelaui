import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ScrollText } from "lucide-react";
import { getAudit, type AuditEntry, type AuditAction } from "@/lib/audit";

const ACTION_LABELS: Record<AuditAction, string> = {
  "gerador.tela_criada": "Tela criada",
  "gerador.tela_editada": "Tela editada",
  "gerador.tela_excluida": "Tela excluída",
  "gerador.tela_concluida": "Tela concluída",
  "componente.sugestao_criada": "Sugestão criada",
  "componente.sugestao_editada": "Sugestão editada",
  "componente.sugestao_aprovada": "Sugestão aprovada",
  "componente.sugestao_recusada": "Sugestão recusada",
};

const PAGE_SIZE = 15;

function entryMatchesSearch(entry: AuditEntry, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  const actionLabel = ACTION_LABELS[entry.action] ?? entry.action;
  const haystack = [
    actionLabel,
    entry.entityId ?? "",
    entry.entityName ?? "",
    entry.details ? JSON.stringify(entry.details) : "",
  ].join(" ");
  return haystack.toLowerCase().includes(lower);
}

export default function Auditoria() {
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterEntityId, setFilterEntityId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredEntries = useMemo(() => {
    const filters: Parameters<typeof getAudit>[0] = {};
    if (filterAction !== "all") filters.action = filterAction as AuditAction;
    if (filterEntityId.trim()) filters.entityId = filterEntityId.trim();
    let entries = getAudit(filters ?? {});
    const q = searchQuery.trim();
    if (q) entries = entries.filter((e) => entryMatchesSearch(e, q));
    return entries;
  }, [filterAction, filterEntityId, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, page]);

  return (
    <div className="flex flex-col">
      <div className="container py-4 px-4">
        <h1 className="text-2xl font-semibold text-primary">Auditoria</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Consulte o histórico de ações do sistema. Todas as operações são registradas.
        </p>
      </div>

      <div className="container px-4 pb-12 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Pesquisa e filtros
            </CardTitle>
            <CardDescription>
              Pesquise em ação, contexto ou detalhes. Filtre por tipo de ação ou ID do protótipo/sugestão afetada.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="audit-search">Pesquisar</Label>
              <Input
                id="audit-search"
                placeholder="Ex.: tela criada, Botões, abc-123"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-action">Ação</Label>
              <Select
                value={filterAction}
                onValueChange={(v) => {
                  setFilterAction(v);
                  setPage(1);
                }}
              >
                <SelectTrigger id="audit-action">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.entries(ACTION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-entity-id">ID da entidade</Label>
              <Input
                id="audit-entity-id"
                placeholder="Ex.: abc-123"
                value={filterEntityId}
                onChange={(e) => {
                  setFilterEntityId(e.target.value);
                  setPage(1);
                }}
              />
              <p className="text-xs text-muted-foreground">
                ID do protótipo ou sugestão afetada pela ação (coluna Contexto).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ScrollText className="h-4 w-4" />
              Registros
            </CardTitle>
            <CardDescription className="text-sm">
              {filteredEntries.length} registro(s) encontrado(s). Ordenados do mais recente ao mais antigo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Nenhum registro de auditoria encontrado.
              </p>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ação</TableHead>
                        <TableHead>Contexto</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {ACTION_LABELS[entry.action] ?? entry.action}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {entry.entityName && <span>{entry.entityName}</span>}
                            {entry.entityId && (
                              <span className="ml-2 text-xs">ID: {entry.entityId}</span>
                            )}
                            {!entry.entityName && !entry.entityId && "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            {entry.details && Object.keys(entry.details).length > 0 ? (
                              <pre className="rounded bg-muted p-2 text-xs overflow-x-auto max-w-[200px]">
                                {JSON.stringify(entry.details)}
                              </pre>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
