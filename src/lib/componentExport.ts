import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface ComponentExportData {
  id: string;
  name: string;
  category: string;
  code: string;
  description: string;
}

export const componentsData: ComponentExportData[] = [
  {
    id: "button",
    name: "Button",
    category: "Botões",
    description: "Componente de botão com múltiplas variantes: default, destructive, outline, secondary, ghost e link.",
    code: `import { Button } from "@/components/ui/button";

// Variantes de botão
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>
<Button size="icon"><Icon /></Button>

// Com ícone
<Button><Mail className="mr-2 h-4 w-4" /> Enviar Email</Button>

// Desabilitado
<Button disabled>Desabilitado</Button>

// Loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Carregando...
</Button>`
  },
  {
    id: "input",
    name: "Input",
    category: "Formulários",
    description: "Campo de entrada de texto com suporte a ícones, estados de erro e diferentes tipos.",
    code: `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Input básico
<Input placeholder="Digite aqui..." />

// Com label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="email@exemplo.com" />
</div>

// Com ícone
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" placeholder="Buscar..." />
</div>

// Desabilitado
<Input disabled placeholder="Campo desabilitado" />

// Com erro (via FormField)
<Input className="border-destructive" />`
  },
  {
    id: "select",
    name: "Select",
    category: "Formulários",
    description: "Componente de seleção dropdown com suporte a grupos e busca.",
    code: `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Frutas</SelectLabel>
      <SelectItem value="apple">Maçã</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Laranja</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Vegetais</SelectLabel>
      <SelectItem value="carrot">Cenoura</SelectItem>
      <SelectItem value="potato">Batata</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`
  },
  {
    id: "checkbox",
    name: "Checkbox",
    category: "Formulários",
    description: "Caixa de seleção para múltiplas opções ou confirmações.",
    code: `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Aceito os termos de uso</Label>
</div>

// Controlado
const [checked, setChecked] = useState(false);
<Checkbox 
  checked={checked} 
  onCheckedChange={setChecked} 
/>

// Desabilitado
<Checkbox disabled />

// Indeterminado
<Checkbox checked="indeterminate" />`
  },
  {
    id: "switch",
    name: "Switch",
    category: "Formulários",
    description: "Toggle switch para alternar entre estados ligado/desligado.",
    code: `import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Modo Avião</Label>
</div>

// Controlado
const [enabled, setEnabled] = useState(false);
<Switch 
  checked={enabled} 
  onCheckedChange={setEnabled} 
/>

// Desabilitado
<Switch disabled />`
  },
  {
    id: "slider",
    name: "Slider",
    category: "Formulários",
    description: "Controle deslizante para seleção de valores numéricos.",
    code: `import { Slider } from "@/components/ui/slider";

// Slider básico
<Slider defaultValue={[50]} max={100} step={1} />

// Com valor controlado
const [value, setValue] = useState([33]);
<Slider 
  value={value} 
  onValueChange={setValue}
  max={100}
  step={1}
/>

// Range (dois handles)
<Slider defaultValue={[25, 75]} max={100} step={1} />

// Com min/max customizado
<Slider 
  defaultValue={[5000]} 
  min={1000} 
  max={10000} 
  step={500}
/>`
  },
  {
    id: "textarea",
    name: "Textarea",
    category: "Formulários",
    description: "Campo de texto multilinha para entradas longas.",
    code: `import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="message">Mensagem</Label>
  <Textarea 
    id="message"
    placeholder="Digite sua mensagem aqui..."
    className="min-h-[120px]"
  />
</div>

// Desabilitado
<Textarea disabled placeholder="Campo desabilitado" />`
  },
  {
    id: "card",
    name: "Card",
    category: "Layout",
    description: "Container para agrupar conteúdo relacionado com cabeçalho, corpo e rodapé.",
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição breve do conteúdo.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card vai aqui.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancelar</Button>
    <Button>Confirmar</Button>
  </CardFooter>
</Card>`
  },
  {
    id: "alert",
    name: "Alert",
    category: "Feedback",
    description: "Componente de alerta para exibir mensagens importantes ao usuário.",
    code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

// Info
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Informação</AlertTitle>
  <AlertDescription>
    Esta é uma mensagem informativa.
  </AlertDescription>
</Alert>

// Sucesso
<Alert className="border-success bg-success/10">
  <CheckCircle className="h-4 w-4 text-success" />
  <AlertTitle className="text-success">Sucesso!</AlertTitle>
  <AlertDescription>Operação realizada com sucesso.</AlertDescription>
</Alert>

// Aviso
<Alert className="border-warning bg-warning/10">
  <AlertTriangle className="h-4 w-4 text-warning" />
  <AlertTitle className="text-warning">Atenção</AlertTitle>
  <AlertDescription>Verifique os dados antes de continuar.</AlertDescription>
</Alert>

// Erro
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erro</AlertTitle>
  <AlertDescription>Ocorreu um erro ao processar.</AlertDescription>
</Alert>`
  },
  {
    id: "badge",
    name: "Badge",
    category: "Tags & Categorias",
    description: "Etiquetas para categorização e status.",
    code: `import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Com ícone
<Badge>
  <Check className="mr-1 h-3 w-3" />
  Ativo
</Badge>

// Status customizado
<Badge className="bg-success text-success-foreground">Aprovado</Badge>
<Badge className="bg-warning text-warning-foreground">Pendente</Badge>`
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Layout",
    description: "Exibição de imagem de perfil com fallback para iniciais.",
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// Tamanhos
<Avatar className="h-8 w-8" />
<Avatar className="h-12 w-12" />
<Avatar className="h-16 w-16" />

// Grupo de avatares
<div className="flex -space-x-4">
  <Avatar className="border-2 border-background">...</Avatar>
  <Avatar className="border-2 border-background">...</Avatar>
  <Avatar className="border-2 border-background">...</Avatar>
</div>`
  },
  {
    id: "dialog",
    name: "Dialog",
    category: "Overlay",
    description: "Modal para confirmações, formulários e conteúdo em destaque.",
    code: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>
        Descrição ou instruções para o usuário.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Conteúdo do modal */}
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancelar</Button>
      </DialogClose>
      <Button type="submit">Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navegação",
    description: "Navegação por abas para organizar conteúdo em seções.",
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="account" className="w-[400px]">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="account">Conta</TabsTrigger>
    <TabsTrigger value="password">Senha</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle>Conta</CardTitle>
        <CardDescription>Gerencie suas informações.</CardDescription>
      </CardHeader>
      <CardContent>...</CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="password">
    <Card>
      <CardHeader>
        <CardTitle>Senha</CardTitle>
        <CardDescription>Altere sua senha.</CardDescription>
      </CardHeader>
      <CardContent>...</CardContent>
    </Card>
  </TabsContent>
</Tabs>`
  },
  {
    id: "progress",
    name: "Progress",
    category: "Fluxo & Progresso",
    description: "Barra de progresso para indicar conclusão de tarefas.",
    code: `import { Progress } from "@/components/ui/progress";

// Progresso simples
<Progress value={33} />

// Com animação
const [progress, setProgress] = useState(0);
useEffect(() => {
  const timer = setInterval(() => {
    setProgress(prev => prev < 100 ? prev + 10 : 100);
  }, 500);
  return () => clearInterval(timer);
}, []);
<Progress value={progress} />

// Estilizado
<Progress value={75} className="h-3" />`
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "Overlay",
    description: "Dicas contextuais ao passar o mouse sobre elementos.",
    code: `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Dica de ajuda aqui</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// Posições
<TooltipContent side="top">...</TooltipContent>
<TooltipContent side="bottom">...</TooltipContent>
<TooltipContent side="left">...</TooltipContent>
<TooltipContent side="right">...</TooltipContent>`
  },
  {
    id: "dropdown",
    name: "Dropdown Menu",
    category: "Overlay",
    description: "Menu dropdown para ações e navegação.",
    code: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Perfil
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Configurações
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
  },
  {
    id: "table",
    name: "Table",
    category: "Dados",
    description: "Tabela para exibição de dados estruturados.",
    code: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableCaption>Lista de usuários cadastrados</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">João Silva</TableCell>
      <TableCell>joao@email.com</TableCell>
      <TableCell>
        <Badge className="bg-success">Ativo</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">Editar</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>`
  },
  {
    id: "calendar",
    name: "Calendar / Date Picker",
    category: "Data & Hora",
    description: "Seletor de data com calendário interativo.",
    code: `import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Calendário básico
const [date, setDate] = useState<Date>();
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>

// Date Picker com Popover
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className={cn(!date && "text-muted-foreground")}>
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
      className="pointer-events-auto"
    />
  </PopoverContent>
</Popover>

// Range de datas
<Calendar
  mode="range"
  selected={{ from: startDate, to: endDate }}
  onSelect={setDateRange}
/>`
  },
  {
    id: "toast",
    name: "Toast / Notificação",
    category: "Feedback",
    description: "Notificações temporárias para feedback de ações.",
    code: `import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button onClick={() => {
      toast({
        title: "Sucesso!",
        description: "Ação realizada com sucesso.",
      });
    }}>
      Mostrar Toast
    </Button>
  );
}

// Com variantes
toast({
  title: "Atenção",
  description: "Verifique os dados informados.",
  variant: "destructive",
});

// Com ação
toast({
  title: "Item removido",
  description: "O item foi movido para a lixeira.",
  action: <Button variant="outline" size="sm">Desfazer</Button>,
});`
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "Navegação",
    description: "Trilha de navegação para indicar localização na hierarquia.",
    code: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Início</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/produtos">Produtos</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Detalhes</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Navegação",
    description: "Controles de paginação para navegação em listas.",
    code: `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`
  },
];

export async function generateComponentsZip(): Promise<void> {
  const zip = new JSZip();
  
  // Create folders
  const componentsFolder = zip.folder("estrelaui-components");
  const tsxFolder = componentsFolder?.folder("tsx");
  const mdFolder = componentsFolder?.folder("markdown");

  // Add README
  const readmeContent = `# EstrelaUI - Biblioteca de Componentes

## Sistema de Padrões NORTE (UID00001-2026)

Esta biblioteca contém ${componentsData.length} componentes prontos para uso em projetos React com TypeScript e Tailwind CSS.

## Estrutura

- \`/tsx\` - Arquivos de código TypeScript/React
- \`/markdown\` - Documentação em formato Markdown

## Instalação

Os componentes dependem das seguintes bibliotecas:
- React 18+
- Tailwind CSS
- Radix UI
- class-variance-authority
- lucide-react

## Uso

1. Copie os componentes desejados para seu projeto
2. Importe e utilize conforme os exemplos na documentação

## Categorias

${[...new Set(componentsData.map(c => c.category))].map(cat => `- ${cat}`).join('\n')}

---

Gerado automaticamente pelo EstrelaUI Design System
Data: ${new Date().toLocaleDateString('pt-BR')}
`;

  componentsFolder?.file("README.md", readmeContent);

  // Generate TSX files
  for (const component of componentsData) {
    const tsxContent = `// ${component.name}
// Categoria: ${component.category}
// ${component.description}

${component.code}
`;
    tsxFolder?.file(`${component.id}.tsx`, tsxContent);
  }

  // Generate Markdown files
  for (const component of componentsData) {
    const mdContent = `# ${component.name}

## Categoria
${component.category}

## Descrição
${component.description}

## Código de Exemplo

\`\`\`tsx
${component.code}
\`\`\`

---

*Componente do EstrelaUI Design System - Padrão NORTE (UID00001-2026)*
`;
    mdFolder?.file(`${component.id}.md`, mdContent);
  }

  // Add index file
  const indexContent = `// EstrelaUI Components Index
// Total: ${componentsData.length} componentes

export const components = ${JSON.stringify(componentsData.map(c => ({
  id: c.id,
  name: c.name,
  category: c.category
})), null, 2)};
`;
  componentsFolder?.file("index.ts", indexContent);

  // Generate and download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "estrelaui-components.zip");
}

export function generateMarkdownDoc(): string {
  let markdown = `# EstrelaUI - Documentação de Componentes

## Sistema de Padrões NORTE (UID00001-2026)

---

`;

  const categories = [...new Set(componentsData.map(c => c.category))];
  
  for (const category of categories) {
    markdown += `## ${category}\n\n`;
    
    const categoryComponents = componentsData.filter(c => c.category === category);
    
    for (const component of categoryComponents) {
      markdown += `### ${component.name}\n\n`;
      markdown += `${component.description}\n\n`;
      markdown += `\`\`\`tsx\n${component.code}\n\`\`\`\n\n`;
      markdown += `---\n\n`;
    }
  }

  markdown += `\n*Gerado em ${new Date().toLocaleDateString('pt-BR')} pelo EstrelaUI Design System*\n`;
  
  return markdown;
}
