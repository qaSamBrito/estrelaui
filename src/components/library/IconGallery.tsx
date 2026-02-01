import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Search, Copy, Check,
  // Navigation & Actions
  Home, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ExternalLink, Link, MoreHorizontal, MoreVertical,
  // User & Account
  User, Users, UserPlus, UserMinus, UserCheck, LogIn, LogOut, Settings, Lock, Unlock, Key, Shield,
  // Communication
  Mail, MessageSquare, MessageCircle, Phone, Bell, BellOff, Send, Inbox, AtSign,
  // Files & Documents
  File, FileText, Folder, FolderOpen, Download, Upload, Paperclip, Archive, Trash2, Copy as CopyIcon,
  // Media
  Image, Camera, Video, Music, Play, Pause, Square, Volume2, VolumeX, Mic, MicOff,
  // Data & Charts
  BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Activity,
  // Status & Feedback
  Check as CheckIcon, AlertCircle, AlertTriangle, Info, HelpCircle, XCircle, CheckCircle, Clock, Loader2,
  // Layout & UI
  Grid, List, Layout, Columns, Sidebar, Maximize, Minimize, Eye, EyeOff, Filter, SortAsc, SortDesc,
  // Commerce
  ShoppingCart, CreditCard, DollarSign, Package, Tag, Percent,
  // Calendar & Time
  Calendar, CalendarDays, Timer, Hourglass,
  // Tools & Settings
  Wrench, Cog, Sliders, RefreshCw, RotateCcw, ZoomIn, ZoomOut, Search as SearchIcon, Target,
  // Social & Sharing
  Share2, Heart, Star, Bookmark, ThumbsUp, ThumbsDown,
  // Development
  Code, Terminal, Database, Server, Cloud, Wifi, WifiOff, Globe, Smartphone, Monitor, Laptop,
  // Misc
  Sun, Moon, Zap, Flag, Map, MapPin, Navigation, Compass, Award, Gift, Lightbulb, Flame, Sparkles
} from "lucide-react";

const iconList = [
  // Navigation & Actions
  { name: "Home", component: Home, category: "Navegação" },
  { name: "Menu", component: Menu, category: "Navegação" },
  { name: "X", component: X, category: "Navegação" },
  { name: "Plus", component: Plus, category: "Ações" },
  { name: "Minus", component: Minus, category: "Ações" },
  { name: "ChevronLeft", component: ChevronLeft, category: "Navegação" },
  { name: "ChevronRight", component: ChevronRight, category: "Navegação" },
  { name: "ChevronUp", component: ChevronUp, category: "Navegação" },
  { name: "ChevronDown", component: ChevronDown, category: "Navegação" },
  { name: "ArrowLeft", component: ArrowLeft, category: "Navegação" },
  { name: "ArrowRight", component: ArrowRight, category: "Navegação" },
  { name: "ArrowUp", component: ArrowUp, category: "Navegação" },
  { name: "ArrowDown", component: ArrowDown, category: "Navegação" },
  { name: "ExternalLink", component: ExternalLink, category: "Navegação" },
  { name: "Link", component: Link, category: "Navegação" },
  { name: "MoreHorizontal", component: MoreHorizontal, category: "Ações" },
  { name: "MoreVertical", component: MoreVertical, category: "Ações" },
  
  // User & Account
  { name: "User", component: User, category: "Usuário" },
  { name: "Users", component: Users, category: "Usuário" },
  { name: "UserPlus", component: UserPlus, category: "Usuário" },
  { name: "UserMinus", component: UserMinus, category: "Usuário" },
  { name: "UserCheck", component: UserCheck, category: "Usuário" },
  { name: "LogIn", component: LogIn, category: "Usuário" },
  { name: "LogOut", component: LogOut, category: "Usuário" },
  { name: "Settings", component: Settings, category: "Usuário" },
  { name: "Lock", component: Lock, category: "Segurança" },
  { name: "Unlock", component: Unlock, category: "Segurança" },
  { name: "Key", component: Key, category: "Segurança" },
  { name: "Shield", component: Shield, category: "Segurança" },
  
  // Communication
  { name: "Mail", component: Mail, category: "Comunicação" },
  { name: "MessageSquare", component: MessageSquare, category: "Comunicação" },
  { name: "MessageCircle", component: MessageCircle, category: "Comunicação" },
  { name: "Phone", component: Phone, category: "Comunicação" },
  { name: "Bell", component: Bell, category: "Comunicação" },
  { name: "BellOff", component: BellOff, category: "Comunicação" },
  { name: "Send", component: Send, category: "Comunicação" },
  { name: "Inbox", component: Inbox, category: "Comunicação" },
  { name: "AtSign", component: AtSign, category: "Comunicação" },
  
  // Files & Documents
  { name: "File", component: File, category: "Arquivos" },
  { name: "FileText", component: FileText, category: "Arquivos" },
  { name: "Folder", component: Folder, category: "Arquivos" },
  { name: "FolderOpen", component: FolderOpen, category: "Arquivos" },
  { name: "Download", component: Download, category: "Arquivos" },
  { name: "Upload", component: Upload, category: "Arquivos" },
  { name: "Paperclip", component: Paperclip, category: "Arquivos" },
  { name: "Archive", component: Archive, category: "Arquivos" },
  { name: "Trash2", component: Trash2, category: "Arquivos" },
  { name: "Copy", component: CopyIcon, category: "Arquivos" },
  
  // Media
  { name: "Image", component: Image, category: "Mídia" },
  { name: "Camera", component: Camera, category: "Mídia" },
  { name: "Video", component: Video, category: "Mídia" },
  { name: "Music", component: Music, category: "Mídia" },
  { name: "Play", component: Play, category: "Mídia" },
  { name: "Pause", component: Pause, category: "Mídia" },
  { name: "Square", component: Square, category: "Mídia" },
  { name: "Volume2", component: Volume2, category: "Mídia" },
  { name: "VolumeX", component: VolumeX, category: "Mídia" },
  { name: "Mic", component: Mic, category: "Mídia" },
  { name: "MicOff", component: MicOff, category: "Mídia" },
  
  // Data & Charts
  { name: "BarChart", component: BarChart, category: "Dados" },
  { name: "LineChart", component: LineChart, category: "Dados" },
  { name: "PieChart", component: PieChart, category: "Dados" },
  { name: "TrendingUp", component: TrendingUp, category: "Dados" },
  { name: "TrendingDown", component: TrendingDown, category: "Dados" },
  { name: "Activity", component: Activity, category: "Dados" },
  
  // Status & Feedback
  { name: "Check", component: CheckIcon, category: "Status" },
  { name: "AlertCircle", component: AlertCircle, category: "Status" },
  { name: "AlertTriangle", component: AlertTriangle, category: "Status" },
  { name: "Info", component: Info, category: "Status" },
  { name: "HelpCircle", component: HelpCircle, category: "Status" },
  { name: "XCircle", component: XCircle, category: "Status" },
  { name: "CheckCircle", component: CheckCircle, category: "Status" },
  { name: "Clock", component: Clock, category: "Status" },
  { name: "Loader2", component: Loader2, category: "Status" },
  
  // Layout & UI
  { name: "Grid", component: Grid, category: "Layout" },
  { name: "List", component: List, category: "Layout" },
  { name: "Layout", component: Layout, category: "Layout" },
  { name: "Columns", component: Columns, category: "Layout" },
  { name: "Sidebar", component: Sidebar, category: "Layout" },
  { name: "Maximize", component: Maximize, category: "Layout" },
  { name: "Minimize", component: Minimize, category: "Layout" },
  { name: "Eye", component: Eye, category: "Layout" },
  { name: "EyeOff", component: EyeOff, category: "Layout" },
  { name: "Filter", component: Filter, category: "Layout" },
  { name: "SortAsc", component: SortAsc, category: "Layout" },
  { name: "SortDesc", component: SortDesc, category: "Layout" },
  
  // Commerce
  { name: "ShoppingCart", component: ShoppingCart, category: "Comércio" },
  { name: "CreditCard", component: CreditCard, category: "Comércio" },
  { name: "DollarSign", component: DollarSign, category: "Comércio" },
  { name: "Package", component: Package, category: "Comércio" },
  { name: "Tag", component: Tag, category: "Comércio" },
  { name: "Percent", component: Percent, category: "Comércio" },
  
  // Calendar & Time
  { name: "Calendar", component: Calendar, category: "Tempo" },
  { name: "CalendarDays", component: CalendarDays, category: "Tempo" },
  { name: "Timer", component: Timer, category: "Tempo" },
  { name: "Hourglass", component: Hourglass, category: "Tempo" },
  
  // Tools & Settings
  { name: "Wrench", component: Wrench, category: "Ferramentas" },
  { name: "Cog", component: Cog, category: "Ferramentas" },
  { name: "Sliders", component: Sliders, category: "Ferramentas" },
  { name: "RefreshCw", component: RefreshCw, category: "Ferramentas" },
  { name: "RotateCcw", component: RotateCcw, category: "Ferramentas" },
  { name: "ZoomIn", component: ZoomIn, category: "Ferramentas" },
  { name: "ZoomOut", component: ZoomOut, category: "Ferramentas" },
  { name: "Search", component: SearchIcon, category: "Ferramentas" },
  { name: "Target", component: Target, category: "Ferramentas" },
  
  // Social & Sharing
  { name: "Share2", component: Share2, category: "Social" },
  { name: "Heart", component: Heart, category: "Social" },
  { name: "Star", component: Star, category: "Social" },
  { name: "Bookmark", component: Bookmark, category: "Social" },
  { name: "ThumbsUp", component: ThumbsUp, category: "Social" },
  { name: "ThumbsDown", component: ThumbsDown, category: "Social" },
  
  // Development
  { name: "Code", component: Code, category: "Desenvolvimento" },
  { name: "Terminal", component: Terminal, category: "Desenvolvimento" },
  { name: "Database", component: Database, category: "Desenvolvimento" },
  { name: "Server", component: Server, category: "Desenvolvimento" },
  { name: "Cloud", component: Cloud, category: "Desenvolvimento" },
  { name: "Wifi", component: Wifi, category: "Desenvolvimento" },
  { name: "WifiOff", component: WifiOff, category: "Desenvolvimento" },
  { name: "Globe", component: Globe, category: "Desenvolvimento" },
  { name: "Smartphone", component: Smartphone, category: "Desenvolvimento" },
  { name: "Monitor", component: Monitor, category: "Desenvolvimento" },
  { name: "Laptop", component: Laptop, category: "Desenvolvimento" },
  
  // Misc
  { name: "Sun", component: Sun, category: "Diversos" },
  { name: "Moon", component: Moon, category: "Diversos" },
  { name: "Zap", component: Zap, category: "Diversos" },
  { name: "Flag", component: Flag, category: "Diversos" },
  { name: "Map", component: Map, category: "Diversos" },
  { name: "MapPin", component: MapPin, category: "Diversos" },
  { name: "Navigation", component: Navigation, category: "Diversos" },
  { name: "Compass", component: Compass, category: "Diversos" },
  { name: "Award", component: Award, category: "Diversos" },
  { name: "Gift", component: Gift, category: "Diversos" },
  { name: "Lightbulb", component: Lightbulb, category: "Diversos" },
  { name: "Flame", component: Flame, category: "Diversos" },
  { name: "Sparkles", component: Sparkles, category: "Diversos" },
];

export function IconGallery() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(iconList.map(icon => icon.category)));
  }, []);

  const filteredIcons = useMemo(() => {
    return iconList.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(search.toLowerCase()) ||
                           icon.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleCopyIcon = async (iconName: string) => {
    const importCode = `import { ${iconName} } from "lucide-react";

<${iconName} className="h-4 w-4" />`;
    await navigator.clipboard.writeText(importCode);
    setCopiedIcon(iconName);
    toast({
      title: "Copiado!",
      description: `Código do ícone ${iconName} copiado para a área de transferência.`,
    });
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="meta-block">
          <h3 className="font-semibold text-foreground mb-2">Biblioteca Lucide React</h3>
          <p className="text-sm text-muted-foreground">
            Ícones consistentes e acessíveis para toda a interface. Clique em qualquer ícone para copiar o código de importação.
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Buscar ícones..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {filteredIcons.map((icon) => {
          const IconComponent = icon.component;
          const isCopied = copiedIcon === icon.name;
          
          return (
            <button
              key={icon.name}
              onClick={() => handleCopyIcon(icon.name)}
              className="group flex flex-col items-center justify-center p-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer"
              title={`${icon.name} - ${icon.category}`}
            >
              <div className="relative">
                {isCopied ? (
                  <Check className="h-5 w-5 text-success" />
                ) : (
                  <IconComponent className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                {icon.name}
              </span>
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Nenhum ícone encontrado para "{search}"</p>
        </div>
      )}

      {/* Usage Example */}
      <div className="example-block">
        <h4 className="font-medium mb-2">Como usar:</h4>
        <pre className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
{`import { User, Settings, Bell } from "lucide-react";

// Uso básico
<User className="h-4 w-4" />

// Com cor personalizada
<Bell className="h-5 w-5 text-primary" />

// Em botões
<Button size="icon">
  <Settings className="h-4 w-4" />
</Button>`}
        </pre>
      </div>
    </div>
  );
}