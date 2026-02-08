# EstrelaUI - Documentação de Componentes

## Sistema de Padrões NORTE (UID00001-2026)

---

## Botões

### Button

Componente de botão com múltiplas variantes: default, destructive, outline, secondary, ghost e link.

```tsx
import { Button } from "@/components/ui/button";

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
</Button>
```

---

## Formulários

### Input

Campo de entrada de texto com suporte a ícones, estados de erro e diferentes tipos.

```tsx
import { Input } from "@/components/ui/input";
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
<Input className="border-destructive" />
```

---

### Select

Componente de seleção dropdown com suporte a grupos e busca.

```tsx
import {
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
</Select>
```

---

### Checkbox

Caixa de seleção para múltiplas opções ou confirmações.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
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
<Checkbox checked="indeterminate" />
```

---

### Switch

Toggle switch para alternar entre estados ligado/desligado.

```tsx
import { Switch } from "@/components/ui/switch";
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
<Switch disabled />
```

---

### Slider

Controle deslizante para seleção de valores numéricos.

```tsx
import { Slider } from "@/components/ui/slider";

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
/>
```

---

### Textarea

Campo de texto multilinha para entradas longas.

```tsx
import { Textarea } from "@/components/ui/textarea";
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
<Textarea disabled placeholder="Campo desabilitado" />
```

---

## Layout

### Card

Container para agrupar conteúdo relacionado com cabeçalho, corpo e rodapé.

```tsx
import {
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
</Card>
```

---

### Avatar

Exibição de imagem de perfil com fallback para iniciais.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
</div>
```

---

## Feedback

### Alert

Componente de alerta para exibir mensagens importantes ao usuário.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
</Alert>
```

#### Vue 3

```vue
<template>
  <div class="alert alert-info"><span class="font-medium">Informação</span><span> Mensagem informativa.</span></div>
  <div class="alert alert-success"><span class="font-medium">Sucesso!</span><span> Operação realizada com sucesso.</span></div>
  <div class="alert alert-warning"><span class="font-medium">Atenção</span><span> Verifique os dados antes de continuar.</span></div>
  <div class="alert alert-error"><span class="font-medium">Erro</span><span> Ocorreu um erro ao processar.</span></div>
</template>
```

#### Bootstrap 5

```html
<div class="alert alert-info" role="alert"><strong>Informação.</strong> Mensagem informativa.</div>
<div class="alert alert-success" role="alert"><strong>Sucesso!</strong> Operação realizada com sucesso.</div>
<div class="alert alert-warning" role="alert"><strong>Atenção.</strong> Verifique os dados antes de continuar.</div>
<div class="alert alert-danger" role="alert"><strong>Erro.</strong> Ocorreu um erro ao processar.</div>
```

---

### Toast / Notificação

Notificações temporárias para feedback de ações. Segue o padrão NORTE: cada variante exibe **ícone à esquerda** (sucesso, aviso, informação, erro) e cores semânticas (verde, amarelo, azul, vermelho).

**Variantes:** `default`, `success`, `warning`, `info`, `destructive`.

```tsx
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button onClick={() => {
      toast({
        title: "Sucesso!",
        description: "Ação realizada com sucesso.",
        variant: "success",
      });
    }}>
      Mostrar Toast
    </Button>
  );
}

// Sucesso (ícone CheckCircle, borda e fundo verde)
toast({
  variant: "success",
  title: "Cadastro realizado",
  description: "O registro foi salvo com sucesso.",
});

// Atualização / Exclusão
toast({
  variant: "success",
  title: "Registro atualizado",
  description: "As alterações foram salvas com sucesso.",
});

// Aviso (ícone AlertTriangle, amarelo)
toast({
  variant: "warning",
  title: "Atenção",
  description: "Verifique os dados informados.",
});

// Informação (ícone Info, azul)
toast({
  variant: "info",
  title: "Nova atualização",
  description: "Uma nova versão está disponível.",
});

// Erro (ícone AlertCircle, vermelho)
toast({
  variant: "destructive",
  title: "Erro",
  description: "Não foi possível completar a operação.",
});

// Com ação
toast({
  title: "Item removido",
  description: "O item foi movido para a lixeira.",
  action: <Button variant="outline" size="sm">Desfazer</Button>,
});
```

#### Vue 3

Toasts com as mesmas variantes (sucesso, aviso, informação, erro). Use um composable ou store para exibir/ocultar.

```vue
<script setup lang="ts">
// Dispare toasts via composable ou store; variantes: success, warning, info, destructive
</script>
<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
    <div class="toast show border border-success rounded p-3 shadow me-2 mb-2" style="background-color: rgba(25, 135, 84, 0.1);" role="alert">
      <div class="d-flex justify-content-between"><strong class="text-success">Sucesso!</strong><button type="button" class="btn-close" aria-label="Fechar"></button></div>
      <p class="mb-0 mt-1 small">Ação realizada com sucesso.</p>
    </div>
    <div class="toast show border border-warning rounded p-3 shadow me-2 mb-2" style="background-color: rgba(255, 193, 7, 0.1);" role="alert">
      <div class="d-flex justify-content-between"><strong class="text-warning">Atenção</strong><button type="button" class="btn-close" aria-label="Fechar"></button></div>
      <p class="mb-0 mt-1 small">Verifique os dados informados.</p>
    </div>
    <div class="toast show border border-info rounded p-3 shadow me-2 mb-2" style="background-color: rgba(13, 202, 240, 0.1);" role="alert">
      <div class="d-flex justify-content-between"><strong class="text-info">Informação</strong><button type="button" class="btn-close" aria-label="Fechar"></button></div>
      <p class="mb-0 mt-1 small">Uma nova versão está disponível.</p>
    </div>
    <div class="toast show border border-danger rounded p-3 shadow bg-danger text-white" role="alert">
      <div class="d-flex justify-content-between"><strong>Erro</strong><button type="button" class="btn-close btn-close-white" aria-label="Fechar"></button></div>
      <p class="mb-0 mt-1 small">Não foi possível completar a operação.</p>
    </div>
  </div>
</template>
```

#### Bootstrap 5

Toasts com variantes semânticas (success, warning, info, danger). Use `data-bs-dismiss="toast"` ou API JavaScript do Bootstrap.

```html
<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
  <div class="toast show border-success" style="background-color: rgba(var(--bs-success-rgb), 0.1);" role="alert">
    <div class="toast-header">
      <strong class="me-auto text-success">Sucesso!</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Ação realizada com sucesso.</div>
  </div>
  <div class="toast show border-warning" style="background-color: rgba(var(--bs-warning-rgb), 0.1);" role="alert">
    <div class="toast-header">
      <strong class="me-auto text-warning">Atenção</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Verifique os dados informados.</div>
  </div>
  <div class="toast show border-info" style="background-color: rgba(var(--bs-info-rgb), 0.1);" role="alert">
    <div class="toast-header">
      <strong class="me-auto text-info">Informação</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Uma nova versão está disponível.</div>
  </div>
  <div class="toast show border-danger bg-danger text-white" role="alert">
    <div class="toast-header text-white">
      <strong class="me-auto">Erro</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Não foi possível completar a operação.</div>
  </div>
</div>
```

---

## Tags & Categorias

### Badge

Etiquetas para categorização e status.

```tsx
import { Badge } from "@/components/ui/badge";

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
<Badge className="bg-warning text-warning-foreground">Pendente</Badge>
```

---

## Overlay

### Dialog

Modal para confirmações, formulários e conteúdo em destaque.

```tsx
import {
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
</Dialog>
```

---

### Tooltip

Dicas contextuais ao passar o mouse sobre elementos.

```tsx
import {
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
<TooltipContent side="right">...</TooltipContent>
```

---

### Dropdown Menu

Menu dropdown para ações e navegação.

```tsx
import {
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
</DropdownMenu>
```

---

## Navegação

### Tabs

Navegação por abas para organizar conteúdo em seções.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
</Tabs>
```

---

### Breadcrumb

Trilha de navegação para indicar localização na hierarquia.

```tsx
import {
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
</Breadcrumb>
```

---

### Pagination

Controles de paginação para navegação em listas.

```tsx
import {
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
</Pagination>
```

---

## Fluxo & Progresso

### Progress

Barra de progresso para indicar conclusão de tarefas.

```tsx
import { Progress } from "@/components/ui/progress";

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
<Progress value={75} className="h-3" />
```

---

## Dados

### Table

Tabela para exibição de dados estruturados.

```tsx
import {
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
</Table>
```

---

## Data & Hora

### Calendar / Date Picker

Seletor de data com calendário interativo.

```tsx
import { Calendar } from "@/components/ui/calendar";
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
/>
```

---

## Outras stacks (Vue e Bootstrap)

Os exemplos desta documentação focam em **React** (EstrelaUI). Para cada componente, o **catálogo da biblioteca** (tela de componentes do projeto) oferece código equivalente em **Vue 3** e **Bootstrap 5**, com as mesmas variantes e padrão NORTE. Acesse a biblioteca de componentes na aplicação para copiar exemplos por stack.

---

*Gerado em 06/02/2026 pelo EstrelaUI Design System*
