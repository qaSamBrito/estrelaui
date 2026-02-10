import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Search, List } from "lucide-react";
import { cn } from "@/lib/utils";

type IndexItem = { id: string; level: 2 | 3; title: string };
type Section = { id: string; level: 2 | 3; title: string; body: string };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "sec";
}

function parseManual(md: string): { index: IndexItem[]; sections: Section[] } {
  const index: IndexItem[] = [];
  const sections: Section[] = [];
  const lines = md.split("\n");
  let current: Section | null = null;
  let body: string[] = [];
  let intro: string[] = [];

  const flush = () => {
    if (current) {
      current.body = body.join("\n").trim();
      sections.push(current);
      body = [];
    }
  };

  for (const line of lines) {
    const h2 = line.match(/^## ?(.+)$/);
    const h3 = line.match(/^### ?(.+)$/);
    if (h2) {
      flush();
      if (sections.length === 0 && intro.length > 0) {
        sections.push({
          id: "intro",
          level: 2,
          title: "Manual de Uso",
          body: intro.join("\n").trim(),
        });
        index.push({ id: "intro", level: 2, title: "Manual de Uso" });
        intro = [];
      }
      const title = h2[1].trim();
      const id = slugify(title);
      current = { id, level: 2, title, body: [] };
      index.push({ id, level: 2, title });
    } else if (h3) {
      flush();
      const title = h3[1].trim();
      const id = slugify(title);
      current = { id, level: 3, title, body: [] };
      index.push({ id, level: 3, title });
    } else if (current) {
      body.push(line);
    } else {
      intro.push(line);
    }
  }
  flush();
  if (sections.length === 0 && intro.length > 0) {
    sections.push({
      id: "intro",
      level: 2,
      title: "Manual de Uso",
      body: intro.join("\n").trim(),
    });
    index.push({ id: "intro", level: 2, title: "Manual de Uso" });
  }

  return { index, sections };
}

function sectionMatchesSearch(section: Section, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase();
  return (
    section.title.toLowerCase().includes(lower) ||
    section.body.toLowerCase().includes(lower)
  );
}

export default function Manual() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/MANUAL-DE-USO.md")
      .then((res) => {
        if (!res.ok) throw new Error("Manual não encontrado");
        return res.text();
      })
      .then(setContent)
      .catch(() => setError("Não foi possível carregar o manual."))
      .finally(() => setLoading(false));
  }, []);

  const { index, sections } = useMemo(() => {
    if (!content) return { index: [] as IndexItem[], sections: [] as Section[] };
    return parseManual(content);
  }, [content]);

  const filteredIndex = useMemo(() => {
    if (!searchQuery.trim()) return index;
    const q = searchQuery.toLowerCase();
    return index.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        sections.some(
          (s) => s.id === item.id && s.body.toLowerCase().includes(q)
        )
    );
  }, [index, sections, searchQuery]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    return sections.filter((s) => sectionMatchesSearch(s, searchQuery));
  }, [sections, searchQuery]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <FileText className="h-5 w-5" />
            Erro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="shrink-0 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Manual de Uso – Sistema Gerador EstrelaUI
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Padrão NORTE – UID00001-2026 (Usabilidade e Design de Interfaces)
            </p>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Pesquisar no manual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
              aria-label="Pesquisar no manual"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 p-4 pt-0">
          {/* Índice - desktop: sidebar; mobile: select */}
          <aside
            className="w-56 shrink-0 hidden lg:block border-r border-border pr-4 overflow-y-auto"
            aria-label="Índice do manual"
          >
            <nav className="sticky top-0">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <List className="h-4 w-4" aria-hidden="true" />
                Índice
              </p>
              <ul className="space-y-1">
                {filteredIndex.length === 0 ? (
                  <li className="text-sm text-muted-foreground py-1">
                    Nenhum resultado para &quot;{searchQuery}&quot;
                  </li>
                ) : (
                  filteredIndex.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        "text-sm",
                        item.level === 3 && "pl-3"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "w-full text-left py-1.5 px-2 rounded-md transition-colors hover:bg-muted hover:text-foreground",
                          activeId === item.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </nav>
          </aside>

          {/* Índice mobile: select "Ir para seção" */}
          <div className="lg:hidden shrink-0 w-full">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <List className="h-4 w-4" aria-hidden="true" />
              Ir para seção
            </Label>
            <Select
              value={activeId ?? ""}
              onValueChange={(id) => {
                setActiveId(id);
                scrollToSection(id);
              }}
            >
              <SelectTrigger className="w-full" aria-label="Selecionar seção do manual">
                <SelectValue placeholder="Selecione uma seção" />
              </SelectTrigger>
              <SelectContent>
                {filteredIndex.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <span className={cn(item.level === 3 && "pl-2")}>
                      {item.title}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            {filteredSections.length === 0 ? (
              <p className="text-muted-foreground py-8">
                Nenhuma seção encontrada para &quot;{searchQuery}&quot;.
              </p>
            ) : (
              <div className="space-y-8">
                {filteredSections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-4"
                  >
                    {section.level === 2 ? (
                      <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 mb-3">
                        {section.title}
                      </h2>
                    ) : (
                      <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                        {section.title}
                      </h3>
                    )}
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-ul:text-muted-foreground prose-li:my-0.5 prose-table:text-sm prose-th:font-medium prose-td:py-2">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-foreground bg-transparent p-0 overflow-x-auto border-0">
                        {section.body}
                      </pre>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
