import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Square, 
  FormInput, 
  Bell, 
  LayoutGrid, 
  Tag, 
  Table2, 
  MessageSquare, 
  List, 
  MousePointer2, 
  Loader2, 
  Info,
  PanelLeft,
  PanelTop,
  Navigation,
  Palette,
  Type,
  Image,
  ChevronDown
} from "lucide-react";
import { ButtonShowcase } from "@/components/library/ButtonShowcase";
import { InputShowcase } from "@/components/library/InputShowcase";
import { AlertShowcase } from "@/components/library/AlertShowcase";
import { CardShowcase } from "@/components/library/CardShowcase";
import { BadgeShowcase } from "@/components/library/BadgeShowcase";
import { TableShowcase } from "@/components/library/TableShowcase";
import { DialogShowcase } from "@/components/library/DialogShowcase";
import { SelectShowcase } from "@/components/library/SelectShowcase";
import { TabsShowcase } from "@/components/library/TabsShowcase";
import { ProgressShowcase } from "@/components/library/ProgressShowcase";
import { TooltipShowcase } from "@/components/library/TooltipShowcase";
import { IconGallery } from "@/components/library/IconGallery";
import { HeaderShowcase } from "@/components/library/HeaderShowcase";
import { SidebarShowcase } from "@/components/library/SidebarShowcase";
import { BreadcrumbShowcase } from "@/components/library/BreadcrumbShowcase";
import { PaginationShowcase } from "@/components/library/PaginationShowcase";
import { DropdownShowcase } from "@/components/library/DropdownShowcase";
import { AvatarShowcase } from "@/components/library/AvatarShowcase";
import { TypographyShowcase } from "@/components/library/TypographyShowcase";
import { ColorsShowcase } from "@/components/library/ColorsShowcase";

const categories = [
  { id: "todos", label: "Todos", icon: LayoutGrid },
  { id: "design", label: "Design System", icon: Palette },
  { id: "tipografia", label: "Tipografia", icon: Type },
  { id: "botoes", label: "Botões", icon: Square },
  { id: "formularios", label: "Formulários", icon: FormInput },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "navegacao", label: "Navegação", icon: Navigation },
  { id: "feedback", label: "Feedback", icon: Bell },
  { id: "dados", label: "Dados", icon: Table2 },
  { id: "overlay", label: "Overlay", icon: MessageSquare },
  { id: "icones", label: "Ícones", icon: Image },
];

const components = [
  { id: "colors", name: "Cores e Gradientes", category: "design", component: ColorsShowcase },
  { id: "typography", name: "Tipografia", category: "tipografia", component: TypographyShowcase },
  { id: "buttons", name: "Botões", category: "botoes", component: ButtonShowcase },
  { id: "inputs", name: "Inputs e Campos", category: "formularios", component: InputShowcase },
  { id: "select", name: "Select e Checkboxes", category: "formularios", component: SelectShowcase },
  { id: "cards", name: "Cards", category: "layout", component: CardShowcase },
  { id: "header", name: "Header", category: "layout", component: HeaderShowcase },
  { id: "sidebar", name: "Menu Lateral", category: "navegacao", component: SidebarShowcase },
  { id: "breadcrumb", name: "Breadcrumb", category: "navegacao", component: BreadcrumbShowcase },
  { id: "tabs", name: "Tabs", category: "navegacao", component: TabsShowcase },
  { id: "pagination", name: "Paginação", category: "navegacao", component: PaginationShowcase },
  { id: "alerts", name: "Alertas", category: "feedback", component: AlertShowcase },
  { id: "progress", name: "Progresso e Loading", category: "feedback", component: ProgressShowcase },
  { id: "badges", name: "Badges", category: "feedback", component: BadgeShowcase },
  { id: "tables", name: "Tabelas", category: "dados", component: TableShowcase },
  { id: "dialogs", name: "Dialogs e Modais", category: "overlay", component: DialogShowcase },
  { id: "dropdowns", name: "Dropdowns", category: "overlay", component: DropdownShowcase },
  { id: "tooltips", name: "Tooltips", category: "overlay", component: TooltipShowcase },
  { id: "avatars", name: "Avatares", category: "layout", component: AvatarShowcase },
  { id: "icons", name: "Galeria de Ícones", category: "icones", component: IconGallery },
];

export default function ComponentLibrary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "todos" || comp.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-corporate flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary">NORTE</h1>
              <p className="text-xs text-muted-foreground">Design System</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-md ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Buscar componentes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-auto">
            <Button variant="outline" size="sm" asChild>
              <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer">
                Todos os Ícones Lucide
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Info Banner */}
        <div className="meta-block mb-8">
          <div className="flex items-start gap-4">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Padrão UID00001-2026 – Usabilidade e Design de Interfaces</h3>
              <p className="text-sm text-muted-foreground">
                Esta biblioteca segue as diretrizes do Sistema de Padrões Estrela. Clique no ícone de código em qualquer componente para copiar e colar no seu projeto.
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="shrink-0"
                >
                  <cat.icon className="h-4 w-4 mr-2" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Components */}
        {filteredComponents.length > 0 ? (
          <div className="space-y-8">
            {filteredComponents.map((comp) => {
              const Component = comp.component;
              const isExpanded = expandedComponent === comp.id || expandedComponent === null;
              
              return (
                <section key={comp.id} className="scroll-mt-20" id={comp.id}>
                  <button
                    onClick={() => setExpandedComponent(expandedComponent === comp.id ? null : comp.id)}
                    className="flex items-center gap-2 mb-4 group cursor-pointer"
                  >
                    <h2 className="text-2xl font-semibold text-secondary">{comp.name}</h2>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${!isExpanded ? '-rotate-90' : ''}`} />
                  </button>
                  {isExpanded && <Component />}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-medium text-muted-foreground">Nenhum componente encontrado</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Tente buscar por outro termo ou selecione outra categoria.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            <strong>NORTE – Sistema de Padrões Estrela</strong><br />
            Versão 1.0 | Gerência de Desenvolvimento
          </p>
        </div>
      </footer>
    </div>
  );
}