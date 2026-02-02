import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChipShowcase() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["React", "TypeScript"]);
  const [filterTags, setFilterTags] = useState<string[]>(["Ativo"]);
  const allTags = ["React", "TypeScript", "Node.js", "Python", "Java", "Go"];
  const filterOptions = ["Ativo", "Inativo", "Pendente", "Concluído"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFilter = (filter: string) => {
    setFilterTags(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Chips Básicos"
        description="Tags simples para categorização e identificação"
        category="Tags"
        code={`import { Badge } from "@/components/ui/badge";

<div className="flex flex-wrap gap-2">
  <Badge variant="secondary">React</Badge>
  <Badge variant="secondary">TypeScript</Badge>
  <Badge variant="secondary">Tailwind</Badge>
  <Badge variant="secondary">Node.js</Badge>
</div>`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind</Badge>
          <Badge variant="secondary">Node.js</Badge>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Chips Removíveis"
        description="Tags que podem ser removidas pelo usuário"
        category="Tags"
        code={`import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const [tags, setTags] = useState(["React", "TypeScript"]);

const removeTag = (tag: string) => {
  setTags(prev => prev.filter(t => t !== tag));
};

<div className="flex flex-wrap gap-2">
  {tags.map((tag) => (
    <Badge key={tag} variant="secondary" className="pr-1 gap-1">
      {tag}
      <button
        onClick={() => removeTag(tag)}
        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  ))}
</div>`}
      >
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="pr-1 gap-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedTags.length === 0 && (
            <span className="text-sm text-muted-foreground">Nenhuma tag selecionada</span>
          )}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Chips Selecionáveis"
        description="Tags que podem ser ativadas/desativadas"
        category="Tags"
        code={`import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const [selected, setSelected] = useState<string[]>(["React"]);
const options = ["React", "Vue", "Angular", "Svelte"];

const toggleOption = (option: string) => {
  setSelected(prev =>
    prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
  );
};

<div className="flex flex-wrap gap-2">
  {options.map((option) => (
    <button
      key={option}
      onClick={() => toggleOption(option)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border transition-colors",
        selected.includes(option)
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-input hover:bg-accent"
      )}
    >
      {selected.includes(option) && <Check className="h-3 w-3" />}
      {option}
    </button>
  ))}
</div>`}
      >
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border transition-colors",
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input hover:bg-accent"
              )}
            >
              {selectedTags.includes(tag) && <Check className="h-3 w-3" />}
              {tag}
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Chips de Filtro"
        description="Chips usados como filtros ativos"
        category="Tags"
        code={`import { useState } from "react";
import { cn } from "@/lib/utils";

const [filters, setFilters] = useState<string[]>(["Ativo"]);
const options = ["Ativo", "Inativo", "Pendente", "Concluído"];

<div className="flex flex-wrap gap-2">
  {options.map((filter) => (
    <button
      key={filter}
      onClick={() => toggleFilter(filter)}
      className={cn(
        "px-3 py-1 rounded-md text-sm font-medium transition-colors",
        filters.includes(filter)
          ? "bg-primary/10 text-primary border border-primary/30"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {filter}
    </button>
  ))}
</div>`}
      >
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                filterTags.includes(filter)
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Chips Coloridos"
        description="Chips com cores semânticas para diferentes estados"
        category="Tags"
        code={`import { Badge } from "@/components/ui/badge";

<div className="flex flex-wrap gap-2">
  <Badge className="bg-success hover:bg-success/80">Aprovado</Badge>
  <Badge className="bg-warning hover:bg-warning/80 text-warning-foreground">Pendente</Badge>
  <Badge className="bg-destructive hover:bg-destructive/80">Rejeitado</Badge>
  <Badge className="bg-info hover:bg-info/80">Em Análise</Badge>
  <Badge variant="outline">Neutro</Badge>
</div>`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-success hover:bg-success/80">Aprovado</Badge>
          <Badge className="bg-warning hover:bg-warning/80 text-warning-foreground">Pendente</Badge>
          <Badge className="bg-destructive hover:bg-destructive/80">Rejeitado</Badge>
          <Badge className="bg-info hover:bg-info/80">Em Análise</Badge>
          <Badge variant="outline">Neutro</Badge>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Chips com Avatares"
        description="Chips com imagem ou iniciais do usuário"
        category="Tags"
        code={`<div className="flex flex-wrap gap-2">
  <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-muted">
    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-medium">
      JD
    </div>
    <span className="text-sm">João da Silva</span>
  </div>
  <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-muted">
    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground font-medium">
      MS
    </div>
    <span className="text-sm">Maria Santos</span>
    <button className="hover:bg-muted-foreground/20 rounded-full p-0.5">
      <X className="h-3 w-3" />
    </button>
  </div>
</div>`}
      >
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-muted">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-medium">
              JD
            </div>
            <span className="text-sm">João da Silva</span>
          </div>
          <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-muted">
            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground font-medium">
              MS
            </div>
            <span className="text-sm">Maria Santos</span>
            <button className="hover:bg-muted-foreground/20 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
