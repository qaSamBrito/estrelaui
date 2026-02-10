import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Check, X, ExternalLink, Lightbulb, Search, Sparkles, Loader2 } from "lucide-react";
import { logAudit } from "@/lib/audit";
import { componentsData } from "@/lib/componentExport";
import { exportIdToSectionId, exportIdToCategoryId } from "@/pages/ComponentLibrary";

const STORAGE_KEY = "estrelaui-component-suggestions";

export type ComponentSuggestionStatus = "pendente" | "aprovado" | "recusado";

export type ComponentSuggestion = {
  id: string;
  name: string;
  category: string;
  description: string;
  useCase: string;
  status: ComponentSuggestionStatus;
  createdAt: number;
  updatedAt?: number;
  rejectedReason?: string;
};

type ComponentListItem =
  | (ComponentSuggestion & { source: "sugestao" })
  | {
      id: string;
      name: string;
      category: string;
      description: string;
      useCase: string;
      status: "aprovado";
      createdAt: number;
      source: "repositorio";
    };

const categories = [
  "Botões",
  "Formulários",
  "Layout",
  "Navegação",
  "Feedback",
  "Dados",
  "Overlay",
  "Design System",
  "Outro"
];

const PAGE_SIZE = 6;

const OPENAI_SYSTEM_PROMPT_COMPONENT =
  "Você é um assistente de documentação de design system. Com base no nome do componente, categoria, caso de uso e na descrição inicial fornecida pelo usuário, gere uma única descrição técnica e clara para o componente. A descrição deve: ser em português; descrever o propósito visual e funcional; mencionar validações, estados (erro, desabilitado) e integração com formulários quando fizer sentido; seguir padrão de documentação de design system (EstrelaUI/NORTE). Retorne apenas o texto da descrição, sem título, sem explicação adicional.";

async function improveDescriptionWithIA(
  name: string,
  category: string,
  useCase: string,
  description: string
): Promise<string> {
  const key = (import.meta as unknown as { env?: { VITE_OPENAI_API_KEY?: string } }).env?.VITE_OPENAI_API_KEY?.trim();
  if (!key) throw new Error("Configure VITE_OPENAI_API_KEY no .env para usar Melhorar com IA.");
  const userContent = `Nome do componente: ${name || "(não informado)"}\nCategoria: ${category || "(não informada)"}\nCaso de uso: ${useCase || "(não informado)"}\n\nDescrição inicial do usuário:\n${description}`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: OPENAI_SYSTEM_PROMPT_COMPONENT },
        { role: "user", content: userContent },
      ],
      max_tokens: 512,
    }),
  });
  if (!res.ok) {
    let message = "Erro ao chamar a IA.";
    try {
      const err = await res.json() as { error?: { message?: string } };
      message = err?.error?.message ?? message;
    } catch {
      const text = await res.text();
      if (text) message = `Erro ${res.status}: ${text.slice(0, 200)}`;
      else message = `Erro ${res.status}: ${res.statusText}`;
    }
    throw new Error(message);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text ?? description;
}

export default function Componentes() {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Outro");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [suggestions, setSuggestions] = useState<ComponentSuggestion[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showExcluirDialog, setShowExcluirDialog] = useState(false);
  const [specToExcluir, setSpecToExcluir] = useState<string | null>(null);
  const [showValidarDialog, setShowValidarDialog] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [validacaoAcao, setValidacaoAcao] = useState<"aprovar" | "recusar">("aprovar");
  const [rejectedReason, setRejectedReason] = useState("");
  type ImproveIAModal = "closed" | "empty" | "preview";
  const [improveIAModal, setImproveIAModal] = useState<ImproveIAModal>("closed");
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const [editableSuggestedDescription, setEditableSuggestedDescription] = useState("");
  const [isImprovingIA, setIsImprovingIA] = useState(false);
  const [improveIAError, setImproveIAError] = useState<string | null>(null);

  const repoComponents = useMemo<ComponentListItem[]>(() => {
    const baseDate = new Date("2026-02-01T12:00:00").getTime();
    return componentsData.map((component, index) => ({
      id: `repo-${component.id ?? index}`,
      name: component.name,
      category: component.category,
      description: component.description,
      useCase: component.usage.bestPractices.join("; "),
      status: "aprovado" as const,
      createdAt: baseDate + index * 60000,
      source: "repositorio" as const,
    }));
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ComponentSuggestion[];
        const migrated = parsed.map((s) => ({
          ...s,
          status: (s as ComponentSuggestion).status ?? "pendente",
        }));
        setSuggestions(migrated);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
  }, [suggestions]);

  const suggestionItems = useMemo<ComponentListItem[]>(
    () => suggestions.map((item) => ({ ...item, source: "sugestao" as const })),
    [suggestions],
  );

  const allItems = useMemo<ComponentListItem[]>(
    () => [...repoComponents, ...suggestionItems],
    [repoComponents, suggestionItems],
  );

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (filterCategory !== "all") {
      items = items.filter((item) => item.category === filterCategory);
    }
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q) ||
        (item.useCase ?? "").toLowerCase().includes(q),
    );
  }, [allItems, searchQuery, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  const handleCadastrarNovo = () => {
    setViewMode("form");
    setEditingId(null);
    setName("");
    setCategory("Outro");
    setDescription("");
    setUseCase("");
    setSubmitted(false);
  };

  const handleEditar = (item: ComponentSuggestion) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setUseCase(item.useCase);
    setViewMode("form");
    setSubmitted(false);
    logAudit("componente.sugestao_editada", { entityId: item.id, entityName: item.name });
  };

  const handleExcluir = (id: string) => {
    setSpecToExcluir(id);
    setShowExcluirDialog(true);
  };

  const confirmExcluir = () => {
    if (specToExcluir) {
      setSuggestions((prev) => prev.filter((s) => s.id !== specToExcluir));
    }
    setShowExcluirDialog(false);
    setSpecToExcluir(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = editingId ?? (window.crypto?.randomUUID?.() ?? String(Date.now()));
    const now = Date.now();
    if (editingId) {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, name: name.trim(), category, description: description.trim(), useCase: useCase.trim(), updatedAt: now }
            : s
        )
      );
      logAudit("componente.sugestao_editada", { entityId: id, entityName: name.trim() });
    } else {
      const newItem: ComponentSuggestion = {
        id,
        name: name.trim(),
        category,
        description: description.trim(),
        useCase: useCase.trim(),
        status: "pendente",
        createdAt: now
      };
      setSuggestions((prev) => [newItem, ...prev]);
      logAudit("componente.sugestao_criada", { entityId: id, entityName: name.trim() });
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setViewMode("list");
      setEditingId(null);
    }, 1500);
  };

  const handleValidar = (id: string, acao: "aprovar" | "recusar") => {
    setValidatingId(id);
    setValidacaoAcao(acao);
    setRejectedReason("");
    setShowValidarDialog(true);
  };

  const confirmValidacao = () => {
    if (!validatingId) return;
    const now = Date.now();
    if (validacaoAcao === "aprovar") {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === validatingId
            ? { ...s, status: "aprovado" as const, updatedAt: now }
            : s
        )
      );
      const item = suggestions.find((s) => s.id === validatingId);
      logAudit("componente.sugestao_aprovada", {
        entityId: validatingId,
        entityName: item?.name,
        details: { msg: "Atualizar repositório (mock)" }
      });
    } else {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === validatingId
            ? { ...s, status: "recusado" as const, updatedAt: now, rejectedReason: rejectedReason }
            : s
        )
      );
      const item = suggestions.find((s) => s.id === validatingId);
      logAudit("componente.sugestao_recusada", {
        entityId: validatingId,
        entityName: item?.name,
        details: { reason: rejectedReason }
      });
    }
    setShowValidarDialog(false);
    setValidatingId(null);
  };

  const handleMelhorarComIA = async () => {
    if (!description.trim()) {
      setImproveIAModal("empty");
      return;
    }
    setIsImprovingIA(true);
    setImproveIAError(null);
    try {
      const improved = await improveDescriptionWithIA(name, category, useCase, description);
      setSuggestedDescription(improved);
      setEditableSuggestedDescription(improved);
      setImproveIAModal("preview");
    } catch (e) {
      setImproveIAError(e instanceof Error ? e.message : "Erro ao aprimorar com IA.");
      setImproveIAModal("preview");
      setSuggestedDescription(description);
      setEditableSuggestedDescription(description);
    } finally {
      setIsImprovingIA(false);
    }
  };

  const applySuggestedDescription = () => {
    setDescription(editableSuggestedDescription);
    setImproveIAModal("closed");
    setSuggestedDescription("");
    setEditableSuggestedDescription("");
    setImproveIAError(null);
  };

  const statusBadge = (status: ComponentSuggestionStatus) => {
    const variants: Record<ComponentSuggestionStatus, "default" | "secondary" | "destructive" | "outline"> = {
      pendente: "secondary",
      aprovado: "default",
      recusado: "destructive"
    };
    const labels = { pendente: "Pendente", aprovado: "Aprovado", recusado: "Recusado" };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  if (viewMode === "form") {
    return (
      <div className="flex flex-col">
        <div className="container py-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">
              {editingId ? "Editar componente" : "Sugerir novo componente"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Descreva o componente. Após inserir ou alterar, a sugestão irá para validação por QA ou PO.
            </p>
          </div>
          <Button variant="outline" size="default" onClick={() => setViewMode("list")}>
            Voltar para listagem
          </Button>
        </div>

        <div className="container py-6 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Descreva o componente
              </CardTitle>
              <CardDescription>
                O time de design e dev usará sua sugestão para avaliar e implementar no padrão NORTE.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do componente *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex.: Data Range Picker, Wizard Steps"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="description">Descrição do componente</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleMelhorarComIA}
                      disabled={isImprovingIA}
                      className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      aria-label="Melhorar descrição com IA"
                    >
                      {isImprovingIA ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" aria-hidden />
                      )}
                      Melhorar com IA
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="O que o componente faz? Quais são suas principais características visuais ou funcionais?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">Caso de uso</Label>
                  <Textarea
                    id="useCase"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    placeholder="Em que cenários esse componente seria usado?"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col gap-4 pt-2">
                  {submitted && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {editingId ? "Alterações salvas!" : "Sugestão registrada! Irá para validação."}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setViewMode("list")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="default" size="default" disabled={!name.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      {editingId ? "Salvar alterações" : "Enviar sugestão"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Dialog open={improveIAModal === "empty"} onOpenChange={(open) => !open && setImproveIAModal("closed")}>
          <DialogContent className="sm:max-w-md" aria-describedby="improve-ia-empty-desc">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden />
                Melhorar com IA
              </DialogTitle>
              <DialogDescription id="improve-ia-empty-desc">
                Escreva pelo menos uma descrição inicial para que a IA possa aprimorar.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="default" onClick={() => setImproveIAModal("closed")}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={improveIAModal === "preview"} onOpenChange={(open) => !open && (setImproveIAModal("closed"), setImproveIAError(null))}>
          <DialogContent className="sm:max-w-lg" aria-describedby="improve-ia-preview-desc">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden />
                Sugestão da IA
              </DialogTitle>
              <DialogDescription id="improve-ia-preview-desc">
                Revise o texto abaixo. Você pode editar antes de aplicar. A descrição continua sujeita à validação de QA/PO.
              </DialogDescription>
            </DialogHeader>
            {improveIAError && (
              <p className="text-sm text-destructive" role="alert">
                {improveIAError}
              </p>
            )}
            <Textarea
              value={editableSuggestedDescription}
              onChange={(e) => setEditableSuggestedDescription(e.target.value)}
              placeholder="Descrição sugerida pela IA"
              rows={6}
              className="font-sans resize-y"
              aria-label="Descrição sugerida pela IA (editável)"
            />
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button variant="outline" size="default" onClick={() => setImproveIAModal("closed")}>
                Cancelar
              </Button>
              <Button variant="default" size="default" onClick={applySuggestedDescription}>
                <Check className="h-4 w-4 mr-2" aria-hidden />
                Aceitar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="container py-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Componentes</h1>
          <p className="text-sm text-muted-foreground">
            Pesquise componentes já publicados no repositório EstrelaUI ou sugestões em análise. Cadastre novos itens para validação.
          </p>
        </div>
        <Button variant="default" size="default" onClick={handleCadastrarNovo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo componente
        </Button>
      </div>

      <div className="container px-4 pb-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Pesquisa e filtros
            </CardTitle>
            <CardDescription>
              Filtre componentes por nome, categoria ou descrição.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search-componente">Pesquisar</Label>
              <Input
                id="search-componente"
                placeholder="Ex.: botão, formulário, #navegação"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-categoria">Componente</Label>
              <Select
                value={filterCategory}
                onValueChange={(v) => {
                  setFilterCategory(v);
                  setPage(1);
                }}
              >
                <SelectTrigger id="filter-categoria">
                  <SelectValue placeholder="Todos os componentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Botões">Botões</SelectItem>
                  <SelectItem value="Navegação">Navegação</SelectItem>
                  <SelectItem value="Formulários">Formulários</SelectItem>
                  <SelectItem value="Layout">Layout</SelectItem>
                  <SelectItem value="Feedback">Feedback</SelectItem>
                  <SelectItem value="Dados">Dados</SelectItem>
                  <SelectItem value="Overlay">Overlay</SelectItem>
                  <SelectItem value="Design System">Design System</SelectItem>
                  <SelectItem value="Tipografia">Tipografia</SelectItem>
                  <SelectItem value="Tags & Categorias">Tags & Categorias</SelectItem>
                  <SelectItem value="Fluxo & Progresso">Fluxo & Progresso</SelectItem>
                  <SelectItem value="Data & Hora">Data & Hora</SelectItem>
                  <SelectItem value="Arquivos & Mídia">Arquivos & Mídia</SelectItem>
                  <SelectItem value="Avaliação">Avaliação</SelectItem>
                  <SelectItem value="Utilitários">Utilitários</SelectItem>
                  <SelectItem value="Loading">Loading</SelectItem>
                  <SelectItem value="Ícones">Ícones</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Nenhum componente encontrado." : "Nenhuma sugestão de componente ainda."}
              </p>
              {!searchQuery && (
                <Button variant="default" size="default" onClick={handleCadastrarNovo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo componente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                      {item.source === "repositorio" ? (
                        <Badge variant="outline">Repositório</Badge>
                      ) : (
                        statusBadge(item.status)
                      )}
                    </div>
                    <CardDescription className="line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {item.description || item.useCase || "-"}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.category} ·{" "}
                      {new Date(
                        item.source === "repositorio"
                          ? item.createdAt
                          : ((item as ComponentSuggestion).updatedAt ?? item.createdAt)
                      ).toLocaleString("pt-BR")}
                    </p>
                    {item.source === "sugestao" && item.status === "recusado" && item.rejectedReason && (
                      <p className="text-xs text-destructive mt-1">Motivo: {item.rejectedReason}</p>
                    )}
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-wrap gap-2 pt-2">
                    {item.source === "sugestao" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEditar(item)} className="shrink-0">
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        {item.status === "pendente" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleValidar(item.id, "aprovar")} className="shrink-0">
                              <Check className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleValidar(item.id, "recusar")} className="shrink-0">
                              <X className="h-4 w-4 mr-1" />
                              Recusar
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleExcluir(item.id)} className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-muted/50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button asChild variant="outline" size="sm" className="shrink-0">
                        <Link
                          to={
                            (() => {
                              const exportId = item.id.replace("repo-", "");
                              const sectionId = exportIdToSectionId[exportId];
                              const categoryId = exportIdToCategoryId[exportId];
                              if (!sectionId) return "/";
                              const search = categoryId ? `?categoria=${categoryId}` : "";
                              return `/${search}#${sectionId}`;
                            })()
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ver na biblioteca
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="default"
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
                  size="default"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={improveIAModal === "empty"} onOpenChange={(open) => !open && setImproveIAModal("closed")}>
        <DialogContent className="sm:max-w-md" aria-describedby="improve-ia-empty-desc">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              Melhorar com IA
            </DialogTitle>
            <DialogDescription id="improve-ia-empty-desc">
              Escreva pelo menos uma descrição inicial para que a IA possa aprimorar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="default" onClick={() => setImproveIAModal("closed")}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={improveIAModal === "preview"} onOpenChange={(open) => !open && (setImproveIAModal("closed"), setImproveIAError(null))}>
        <DialogContent className="sm:max-w-lg" aria-describedby="improve-ia-preview-desc">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              Sugestão da IA
            </DialogTitle>
            <DialogDescription id="improve-ia-preview-desc">
              Revise o texto abaixo. Você pode editar antes de aplicar. A descrição continua sujeita à validação de QA/PO.
            </DialogDescription>
          </DialogHeader>
          {improveIAError && (
            <p className="text-sm text-destructive" role="alert">
              {improveIAError}
            </p>
          )}
          <Textarea
            value={editableSuggestedDescription}
            onChange={(e) => setEditableSuggestedDescription(e.target.value)}
            placeholder="Descrição sugerida pela IA"
            rows={6}
            className="font-sans resize-y"
            aria-label="Descrição sugerida pela IA (editável)"
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="outline" size="default" onClick={() => setImproveIAModal("closed")}>
              Cancelar
            </Button>
            <Button variant="default" size="default" onClick={applySuggestedDescription}>
              <Check className="h-4 w-4 mr-2" aria-hidden />
              Aceitar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showExcluirDialog} onOpenChange={setShowExcluirDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sugestão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta sugestão de componente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExcluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showValidarDialog} onOpenChange={setShowValidarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{validacaoAcao === "aprovar" ? "Aprovar sugestão" : "Recusar sugestão"}</AlertDialogTitle>
            <AlertDialogDescription>
              {validacaoAcao === "aprovar"
                ? "Ao aprovar, a sugestão será marcada como aprovada e o repositório será atualizado (fluxo mock)."
                : "Informe o motivo da recusa para que o solicitante possa ajustar."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {validacaoAcao === "recusar" && (
            <div className="py-2">
              <Label>Motivo da recusa</Label>
              <Input
                value={rejectedReason}
                onChange={(e) => setRejectedReason(e.target.value)}
                placeholder="Ex.: Descrição insuficiente, caso de uso não claro"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmValidacao}>
              {validacaoAcao === "aprovar" ? "Aprovar" : "Recusar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
