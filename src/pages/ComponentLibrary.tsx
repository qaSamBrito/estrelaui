import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Square,
  FormInput,
  Bell,
  LayoutGrid,
  Table2,
  MessageSquare,
  Navigation,
  Palette,
  Type,
  Image,
  ChevronDown,
  Calendar,
  Upload,
  Tag,
  GitBranch,
  Wrench,
  Loader2,
  Info,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateComponentsZip, generateMarkdownDoc, componentDataById } from "@/lib/componentExport";
import { saveAs } from "file-saver";
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
// Novos componentes
import { DateTimeShowcase } from "@/components/library/DateTimeShowcase";
import { RangeSliderShowcase } from "@/components/library/RangeSliderShowcase";
import { FileUploadShowcase } from "@/components/library/FileUploadShowcase";
import { RatingShowcase } from "@/components/library/RatingShowcase";
import { ChipShowcase } from "@/components/library/ChipShowcase";
import { StepperShowcase } from "@/components/library/StepperShowcase";
import { TimelineShowcase } from "@/components/library/TimelineShowcase";
import { TreeViewShowcase } from "@/components/library/TreeViewShowcase";
import { ColorPickerShowcase } from "@/components/library/ColorPickerShowcase";
import { CopyToClipboardShowcase } from "@/components/library/CopyToClipboardShowcase";
import { SplitButtonShowcase } from "@/components/library/SplitButtonShowcase";
import { NotificationBellShowcase } from "@/components/library/NotificationBellShowcase";
import { LoaderShowcase } from "@/components/library/LoaderShowcase";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "todos", label: "Todos", icon: LayoutGrid },
  { id: "design", label: "Design System", icon: Palette },
  { id: "tipografia", label: "Tipografia", icon: Type },
  { id: "botoes", label: "Botões", icon: Square },
  { id: "formularios", label: "Formulários", icon: FormInput },
  { id: "datatime", label: "Data & Hora", icon: Calendar },
  { id: "arquivos", label: "Arquivos & Mídia", icon: Upload },
  { id: "tags", label: "Tags & Categorias", icon: Tag },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "navegacao", label: "Navegação", icon: Navigation },
  { id: "fluxo", label: "Fluxo & Progresso", icon: GitBranch },
  { id: "feedback", label: "Feedback", icon: Bell },
  { id: "dados", label: "Dados", icon: Table2 },
  { id: "overlay", label: "Overlay", icon: MessageSquare },
  { id: "utilitarios", label: "Utilitários", icon: Wrench },
  { id: "loading", label: "Loading", icon: Loader2 },
  { id: "icones", label: "Ícones", icon: Image },
];

type ComponentItem = {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType;
  exportId: string | null;
  subtitle?: string;
};
const components: ComponentItem[] = [
  // Design System
  { id: "colors", name: "Cores e Gradientes", category: "design", component: ColorsShowcase, exportId: "colors", subtitle: "Cores Principais" },
  { id: "colorpicker", name: "Color Picker", category: "design", component: ColorPickerShowcase, exportId: "colorpicker", subtitle: "Presets e customização" },
  
  // Tipografia
  { id: "typography", name: "Tipografia", category: "tipografia", component: TypographyShowcase, exportId: "typography" },
  
  // Botões
  { id: "buttons", name: "Botões", category: "botoes", component: ButtonShowcase, exportId: "button" },
  { id: "splitbutton", name: "Split Button", category: "botoes", component: SplitButtonShowcase, exportId: "splitbutton" },
  
  // Formulários
  { id: "inputs", name: "Inputs e Campos", category: "formularios", component: InputShowcase, exportId: "input" },
  { id: "select", name: "Select e Checkboxes", category: "formularios", component: SelectShowcase, exportId: "select" },
  { id: "rangeslider", name: "Range Slider", category: "formularios", component: RangeSliderShowcase, exportId: "rangeslider" },
  { id: "rating", name: "Rating / Avaliação", category: "formularios", component: RatingShowcase, exportId: "rating" },
  
  // Data & Hora
  { id: "datetime", name: "Date & Time Picker", category: "datatime", component: DateTimeShowcase, exportId: "calendar" },
  
  // Arquivos & Mídia
  { id: "fileupload", name: "File Upload", category: "arquivos", component: FileUploadShowcase, exportId: "fileupload" },
  
  // Tags & Categorias
  { id: "badges", name: "Badges", category: "tags", component: BadgeShowcase, exportId: "badge" },
  { id: "chips", name: "Chips / Tags", category: "tags", component: ChipShowcase, exportId: "chips" },
  
  // Layout
  { id: "cards", name: "Cards", category: "layout", component: CardShowcase, exportId: "card" },
  { id: "header", name: "Header", category: "layout", component: HeaderShowcase, exportId: "header" },
  { id: "avatars", name: "Avatares", category: "layout", component: AvatarShowcase, exportId: "avatar" },
  
  // Navegação
  { id: "sidebar", name: "Menu Lateral", category: "navegacao", component: SidebarShowcase, exportId: "sidebar" },
  { id: "breadcrumb", name: "Breadcrumb", category: "navegacao", component: BreadcrumbShowcase, exportId: "breadcrumb" },
  { id: "tabs", name: "Tabs", category: "navegacao", component: TabsShowcase, exportId: "tabs" },
  { id: "pagination", name: "Paginação", category: "navegacao", component: PaginationShowcase, exportId: "pagination" },
  { id: "treeview", name: "Tree View", category: "navegacao", component: TreeViewShowcase, exportId: "treeview" },
  
  // Fluxo & Progresso
  { id: "stepper", name: "Stepper / Steps", category: "fluxo", component: StepperShowcase, exportId: "stepper" },
  { id: "timeline", name: "Timeline", category: "fluxo", component: TimelineShowcase, exportId: "timeline" },
  { id: "progress", name: "Progress Bar", category: "fluxo", component: ProgressShowcase, exportId: "progress" },
  
  // Feedback
  { id: "alerts", name: "Alertas", category: "feedback", component: AlertShowcase, exportId: "alert" },
  { id: "notification", name: "Notificações", category: "feedback", component: NotificationBellShowcase, exportId: "notification" },
  
  // Dados
  { id: "tables", name: "Tabelas", category: "dados", component: TableShowcase, exportId: "table" },
  
  // Overlay
  { id: "dialogs", name: "Dialogs e Modais", category: "overlay", component: DialogShowcase, exportId: "dialog" },
  { id: "dropdowns", name: "Dropdowns", category: "overlay", component: DropdownShowcase, exportId: "dropdown" },
  { id: "tooltips", name: "Tooltips", category: "overlay", component: TooltipShowcase, exportId: "tooltip" },
  
  // Utilitários
  { id: "copytoclipboard", name: "Copy to Clipboard", category: "utilitarios", component: CopyToClipboardShowcase, exportId: "copytoclipboard" },
  
  // Loading
  { id: "loaders", name: "Loaders & Spinners", category: "loading", component: LoaderShowcase, exportId: "loaders" },
  
  // Ícones
  { id: "icons", name: "Galeria de Ícones", category: "icones", component: IconGallery, exportId: "icons" },
];

/** Mapa exportId (componentExport) -> id da seção na biblioteca. Usado para links âncora em /#sectionId */
export const exportIdToSectionId: Record<string, string> = components.reduce(
  (acc, c) => {
    if (c.exportId) acc[c.exportId] = c.id;
    return acc;
  },
  {} as Record<string, string>
);

/** Mapa exportId -> id da categoria (menu da biblioteca). Usado para link ?categoria=... */
export const exportIdToCategoryId: Record<string, string> = components.reduce(
  (acc, c) => {
    if (c.exportId) acc[c.exportId] = c.category;
    return acc;
  },
  {} as Record<string, string>
);

const VALID_CATEGORIES = new Set(categories.map((c) => c.id));

export default function ComponentLibrary() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Ao chegar via link (ex: /?categoria=botoes#buttons), define categoria e rola até a seção
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("categoria");
    if (cat && VALID_CATEGORIES.has(cat)) {
      setActiveCategory(cat);
    }
    const hash = location.hash?.replace("#", "");
    if (hash) {
      const scrollToSection = () => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      requestAnimationFrame(() => setTimeout(scrollToSection, 150));
    }
  }, [location.search, location.hash]);

  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "todos" || comp.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await generateComponentsZip();
      toast({
        title: "Download iniciado!",
        description: "O arquivo ZIP com os componentes está sendo baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar ZIP",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdownDoc();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, "estrelaui-documentation.md");
    toast({
      title: "Download iniciado!",
      description: "A documentação Markdown está sendo baixada.",
    });
  };

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
              <p className="text-xs text-muted-foreground">Design System v2.0</p>
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

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground whitespace-nowrap">{filteredComponents.length} {filteredComponents.length === 1 ? "componente" : "componentes"}</span>

            <Button variant="outline" size="sm" asChild>
              <Link to="/exemplo">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver exemplo
              </Link>
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownloadMarkdown}>
              <FileText className="h-4 w-4 mr-2" />
              .MD
            </Button>

            <Button variant="default" size="sm" onClick={handleDownloadZip} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              ZIP
            </Button>

            <ThemeToggle />

            <Button variant="outline" size="sm" asChild>
              <Link to="/gerador">Backoffice</Link>
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

        {/* Category Tabs - quebra de linha para não ocultar itens */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Components */}
        {filteredComponents.length > 0 ? (
          <div className="space-y-8">
            {filteredComponents.map((comp) => {
              const Component = comp.component;
              const isExpanded = expandedComponent === comp.id || expandedComponent === null;
              const exportData = comp.exportId ? componentDataById[comp.exportId] : null;

              return (
                <section key={comp.id} className="scroll-mt-20" id={comp.id}>
                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedComponent(expandedComponent === comp.id ? null : comp.id)}
                      className="flex items-center gap-2 group cursor-pointer w-full min-w-0 text-left"
                    >
                      <h2 className="text-2xl font-semibold text-secondary truncate">{comp.name}</h2>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${!isExpanded ? "-rotate-90" : ""}`} />
                    </button>
                    {(comp.subtitle || exportData) && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {comp.subtitle ?? exportData?.category ?? ""}
                        </span>
                      </div>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="space-y-4">
                      <Component />
                    </div>
                  )}
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
            Versão 2.0 | {components.length} Componentes | Gerência de Desenvolvimento
          </p>
        </div>
      </footer>
    </div>
  );
}
