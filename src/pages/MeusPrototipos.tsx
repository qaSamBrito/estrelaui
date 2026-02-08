import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, Trash2 } from "lucide-react";

const STORAGE_KEY = "estrelaui-generator-specs";

type Field = { id: string; label: string; type: string; placeholder?: string };
type ScreenSpec = {
  type: "crud" | "login" | "generic";
  title: string;
  subtitle: string;
  entity: string;
  fields: Field[];
  listColumns: string[];
  features: string[];
  stack: string;
  prompt: string;
};
type SavedSpec = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt?: number;
  status: "draft" | "final";
  tags: string[];
  modoPO: boolean;
  spec: ScreenSpec;
};

export default function MeusPrototipos() {
  const [specs, setSpecs] = useState<SavedSpec[]>([]);
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<"none" | "tag">("none");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const normalizeTags = (tags?: string[]) => (tags && tags.length > 0 ? tags : ["#geral"]);
  const migrateSpec = (item: Partial<SavedSpec>, index: number): SavedSpec => {
    if (!item.spec) {
      throw new Error("Invalid spec");
    }
    return {
      id: item.id ?? `${Date.now()}-${index}`,
      name: item.name ?? item.spec.title ?? `Protótipo ${index + 1}`,
      createdAt: item.createdAt ?? Date.now(),
      updatedAt: item.updatedAt ?? item.createdAt ?? Date.now(),
      status: item.status ?? "final",
      tags: normalizeTags(item.tags),
      modoPO: item.modoPO ?? false,
      spec: item.spec,
    };
  };

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SavedSpec>[];
        const mapped = parsed
          .filter((item): item is Partial<SavedSpec> & { spec: ScreenSpec } => Boolean(item && item.spec))
          .map((item, index) => migrateSpec(item, index));
        setSpecs(mapped);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Excluir este protótipo?")) {
      setSpecs((prev) => prev.filter((s) => s.id !== id));
    }
  };

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(specs));
  }, [specs]);

  const filteredSpecs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const ordered = [...specs].sort(
      (a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt),
    );
    if (!q) return ordered;
    return ordered.filter((item) => {
      const haystack = [
        item.name,
        item.spec.title,
        item.spec.entity,
        item.tags.join(" "),
        item.status,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [specs, search]);

  const allTags = useMemo(() => {
    const tags = specs.flatMap((item) => normalizeTags(item.tags));
    return Array.from(new Set(tags));
  }, [specs]);

  const specsByTag = useMemo(() => {
    const map = new Map<string, SavedSpec[]>();
    filteredSpecs.forEach((item) => {
      normalizeTags(item.tags).forEach((tag) => {
        if (!map.has(tag)) {
          map.set(tag, []);
        }
        map.get(tag)!.push(item);
      });
    });
    return map;
  }, [filteredSpecs]);

  const visibleTagEntries = useMemo(() => {
    if (groupBy !== "tag") return [];
    const entries = Array.from(specsByTag.entries()).sort(([a], [b]) => a.localeCompare(b));
    if (activeTag) {
      return entries.filter(([tag]) => tag === activeTag);
    }
    return entries;
  }, [specsByTag, groupBy, activeTag]);

  return (
    <div className="flex flex-col">
      <div className="container py-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Meus Protótipos</h1>
          <p className="text-sm text-muted-foreground">
            Protótipos salvos para reaproveitar ou completar para backend
          </p>
        </div>
        <Button asChild>
          <Link to="/gerador/nova">
            <Plus className="h-4 w-4 mr-2" />
            Novo protótipo
          </Link>
        </Button>
      </div>

      <div className="container px-4 pb-12 space-y-6">
        {specs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhum protótipo salvo ainda
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Gere uma tela no Gerador e salve para aparecer aqui.
              </p>
              <Link to="/gerador/nova">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova geração
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Pesquisa e agrupamento
                </CardTitle>
                <CardDescription>
                  Filtre protótipos por nome, entidade, tags ou status. Agrupe por tags para visualizar entregas por contexto.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="search-prototipo">Pesquisar</Label>
                  <Input
                    id="search-prototipo"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ex.: produtos, sprint 12, #crud"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Agrupar por</Label>
                  <Select
                    value={groupBy}
                    onValueChange={(value) => {
                      setGroupBy(value as "none" | "tag");
                      setActiveTag(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sem agrupamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem agrupamento</SelectItem>
                      <SelectItem value="tag">Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {groupBy === "tag" && allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={activeTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTag(null)}
                >
                  Todas as tags
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={activeTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}

            {filteredSpecs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum protótipo encontrado para o filtro atual.
                </CardContent>
              </Card>
            ) : groupBy === "tag" ? (
              visibleTagEntries.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    Nenhum protótipo com as tags selecionadas.
                  </CardContent>
                </Card>
              ) : (
                visibleTagEntries.map(([tag, items]) => (
                  <div key={tag} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{tag}</Badge>
                      <span className="text-xs text-muted-foreground">{items.length} item(s)</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <PrototypeCard key={`${tag}-${item.id}`} item={item} onDelete={handleDelete} />
                      ))}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSpecs.map((item) => (
                  <PrototypeCard key={item.id} item={item} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type PrototypeCardProps = {
  item: SavedSpec;
  onDelete: (id: string) => void;
};

function PrototypeCard({ item, onDelete }: PrototypeCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
          <Badge variant={item.status === "final" ? "default" : "secondary"} className="shrink-0 text-xs">
            {item.status === "final" ? "Final" : "Rascunho"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-1">{item.spec.subtitle}</CardDescription>
        <p className="text-xs text-muted-foreground mt-1">
          Atualizado em {new Date(item.updatedAt ?? item.createdAt).toLocaleString("pt-BR")}
        </p>
        <div className="flex flex-wrap gap-1 pt-1">
          {item.tags.map((tag) => (
            <Badge key={`${item.id}-${tag}`} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-2 pt-0">
        <p className="text-xs text-muted-foreground">
          Entidade: {item.spec.entity} · {item.spec.fields.length} campos · Stack: {item.spec.stack.toUpperCase()}
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/gerador/nova" state={item} className="w-full">
              Carregar e editar
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
