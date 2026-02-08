import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface ComponentUsageGuide {
  props: string[];
  variants: string[];
  bestPractices: string[];
}

export type CodeStack = "react" | "vue" | "bootstrap" | "angular";

export interface ComponentExportData {
  id: string;
  name: string;
  category: string;
  /** Código padrão (fallback quando não houver código por stack) */
  code: string;
  /** Código por stack; se omitido, usa `code` */
  codeReact?: string;
  codeVue?: string;
  codeBootstrap?: string;
  codeAngular?: string;
  description: string;
  usage: ComponentUsageGuide;
}

/** Retorna o código do componente para a stack selecionada. */
export function getCodeForStack(data: ComponentExportData, stack: CodeStack): string {
  switch (stack) {
    case "react":
      return data.codeReact ?? data.code;
    case "vue":
      return data.codeVue ?? data.code;
    case "bootstrap":
      return data.codeBootstrap ?? data.code;
    case "angular":
      return data.codeAngular ?? data.code;
    default:
      return data.code;
  }
}

const baseUsage: ComponentUsageGuide = {
  props: ["className", "children"],
  variants: ["default"],
  bestPractices: [
    "Use tokens do design system para manter consistencia visual.",
    "Evite estilos inline, prefira classes e utilitarios.",
    "Mantenha espacos e alinhamentos de acordo com o grid."
  ]
};

const categoryUsage: Record<string, ComponentUsageGuide> = {
  "Botões": {
    props: ["variant", "size", "disabled", "onClick"],
    variants: ["default", "secondary", "outline", "ghost", "link", "destructive"],
    bestPractices: [
      "Use apenas um botao primario por area.",
      "Desabilite o botao durante loading ou submissao.",
      "Prefira labels curtos e objetivos."
    ]
  },
  "Formulários": {
    props: ["value", "onChange", "placeholder", "disabled", "className"],
    variants: ["default", "error", "disabled"],
    bestPractices: [
      "Sempre associe Label ao campo.",
      "Informe erros de forma clara e objetiva.",
      "Agrupe campos relacionados em blocos."
    ]
  },
  "Layout": {
    props: ["className", "children"],
    variants: ["default", "compact", "elevated"],
    bestPractices: [
      "Use espacamento consistente entre blocos.",
      "Aplique sombras apenas para destacar hierarquia.",
      "Prefira bordas e fundos neutros."
    ]
  },
  "Navegação": {
    props: ["items", "active", "onChange"],
    variants: ["default", "compact", "minimal"],
    bestPractices: [
      "Mantenha rotulos claros e curtos.",
      "Destaque o item ativo com cor primaria.",
      "Evite mais de um nivel profundo."
    ]
  },
  "Feedback": {
    props: ["variant", "title", "description"],
    variants: ["info", "success", "warning", "destructive"],
    bestPractices: [
      "Use feedback imediato apos a acao.",
      "Evite mensagens longas; seja direto.",
      "Nao exiba alerts permanentes sem necessidade."
    ]
  },
  "Overlay": {
    props: ["open", "onOpenChange", "trigger"],
    variants: ["default", "compact"],
    bestPractices: [
      "Use overlays apenas para acoes criticas.",
      "Permita fechar com ESC e clique externo.",
      "Evite excesso de modais em sequencia."
    ]
  },
  "Dados": {
    props: ["columns", "data", "actions"],
    variants: ["default", "compact", "striped"],
    bestPractices: [
      "Mantenha colunas essenciais visiveis.",
      "Use badges para status.",
      "Inclua acoes alinhadas a direita."
    ]
  },
  "Tags & Categorias": {
    props: ["variant", "onRemove", "selected"],
    variants: ["default", "secondary", "outline", "status"],
    bestPractices: [
      "Limite a quantidade de tags visiveis.",
      "Use cores semanticas para status.",
      "Evite textos longos nas tags."
    ]
  },
  "Data & Hora": {
    props: ["value", "onChange", "min", "max", "locale"],
    variants: ["single", "range"],
    bestPractices: [
      "Exiba formato local (pt-BR).",
      "Indique intervalos validos.",
      "Evite campos de data sem placeholder."
    ]
  },
  "Design System": {
    props: ["tokens", "palette"],
    variants: ["primary", "secondary", "semantic"],
    bestPractices: [
      "Sempre usar tokens definidos no tema.",
      "Evite cores diretas fora do sistema.",
      "Padronize gradientes e sombras."
    ]
  },
  "Tipografia": {
    props: ["as", "size", "weight", "className"],
    variants: ["headline", "title", "body", "caption"],
    bestPractices: [
      "Respeite hierarquia de titulos.",
      "Nao use mais de 2 tamanhos por bloco.",
      "Use muted para textos auxiliares."
    ]
  },
  "Fluxo & Progresso": {
    props: ["value", "currentStep", "steps"],
    variants: ["default", "compact", "vertical"],
    bestPractices: [
      "Mostre sempre o passo atual.",
      "Evite listas muito longas de etapas.",
      "Use labels curtos e claros."
    ]
  },
  "Arquivos & Mídia": {
    props: ["accept", "multiple", "onUpload"],
    variants: ["default", "compact", "drag-and-drop"],
    bestPractices: [
      "Informe limite de tamanho e formato.",
      "Exiba progresso e status do upload.",
      "Permita remover arquivos enviados."
    ]
  },
  "Utilitários": {
    props: ["value", "onCopy", "disabled"],
    variants: ["icon", "button", "input"],
    bestPractices: [
      "Sempre forneca feedback ao copiar.",
      "Evite acoes silenciosas.",
      "Mantenha acessibilidade via tooltip."
    ]
  },
  "Loading": {
    props: ["size", "variant"],
    variants: ["spinner", "dots", "skeleton"],
    bestPractices: [
      "Use loading apenas quando necessario.",
      "Prefira skeleton para conteudo previsivel.",
      "Evite loading sem texto em telas longas."
    ]
  },
  "Ícones": {
    props: ["size", "className"],
    variants: ["outline"],
    bestPractices: [
      "Use icones apenas para reforcar texto.",
      "Mantenha tamanhos consistentes.",
      "Evite icones sem tooltip em acoes criticas."
    ]
  }
};

const usageById: Record<string, ComponentUsageGuide> = {
  button: {
    props: ["variant", "size", "disabled", "onClick"],
    variants: ["default", "secondary", "outline", "ghost", "link", "destructive"],
    bestPractices: [
      "Use o botao primario apenas uma vez por area.",
      "Desabilite durante carregamento.",
      "Evite textos longos; use 1-3 palavras."
    ]
  },
  input: {
    props: ["value", "onChange", "type", "placeholder", "disabled"],
    variants: ["default", "with-icon", "error"],
    bestPractices: [
      "Inclua Label e placeholder descritivo.",
      "Use mascara/validacao conforme o campo.",
      "Evite inputs sem contexto."
    ]
  },
  select: {
    props: ["value", "onValueChange", "placeholder", "disabled"],
    variants: ["default", "with-groups", "searchable"],
    bestPractices: [
      "Use para listas curtas e medias.",
      "Agrupe opcoes relacionadas.",
      "Evite selects com muitas opcoes sem busca."
    ]
  },
  checkbox: {
    props: ["checked", "onCheckedChange", "disabled"],
    variants: ["default", "indeterminate"],
    bestPractices: [
      "Use para selecoes multiples.",
      "Mantenha label claro e proximo do checkbox.",
      "Evite checkbox para escolhas unicas."
    ]
  },
  switch: {
    props: ["checked", "onCheckedChange", "disabled"],
    variants: ["default"],
    bestPractices: [
      "Use para estados liga/desliga.",
      "Evite para acoes irreversiveis.",
      "Mostre o estado com label."
    ]
  },
  slider: {
    props: ["value", "onValueChange", "min", "max", "step"],
    variants: ["single", "range"],
    bestPractices: [
      "Mostre valor selecionado.",
      "Defina limites claros.",
      "Use step adequado ao dominio."
    ]
  },
  textarea: {
    props: ["value", "onChange", "rows", "placeholder", "disabled"],
    variants: ["default", "resizable"],
    bestPractices: [
      "Use para textos longos.",
      "Mostre limite de caracteres se existir.",
      "Evite campos muito altos sem necessidade."
    ]
  },
  card: {
    props: ["className", "children"],
    variants: ["default", "outlined", "elevated"],
    bestPractices: [
      "Use cards para agrupar conteudo relacionado.",
      "Mantenha padding consistente.",
      "Evite excesso de informacao por card."
    ]
  },
  alert: {
    props: ["variant", "title", "description"],
    variants: ["info", "success", "warning", "destructive"],
    bestPractices: [
      "Use mensagens curtas e diretas.",
      "Combine icone e texto para leitura rapida.",
      "Nao empilhe muitos alerts."
    ]
  },
  badge: {
    props: ["variant", "className"],
    variants: ["default", "secondary", "outline", "status"],
    bestPractices: [
      "Use para status curtos.",
      "Evite badges com frases longas.",
      "Use cores semanticas."
    ]
  },
  avatar: {
    props: ["src", "alt", "fallback"],
    variants: ["default", "group"],
    bestPractices: [
      "Sempre defina fallback.",
      "Use tamanhos consistentes.",
      "Evite imagens distorcidas."
    ]
  },
  dialog: {
    props: ["open", "onOpenChange", "title"],
    variants: ["default", "form"],
    bestPractices: [
      "Use para acoes importantes.",
      "Mantenha titulo e descricao claros.",
      "Evite modais muito longos."
    ]
  },
  tabs: {
    props: ["defaultValue", "value", "onValueChange"],
    variants: ["default", "pills"],
    bestPractices: [
      "Use para separar conteudos relacionados.",
      "Evite muitas abas (max 5).",
      "Nomeie de forma objetiva."
    ]
  },
  progress: {
    props: ["value", "max"],
    variants: ["default", "thin"],
    bestPractices: [
      "Mostre percentual quando possivel.",
      "Use animacao suave.",
      "Evite uso sem contexto."
    ]
  },
  tooltip: {
    props: ["content", "side", "delayDuration"],
    variants: ["top", "bottom", "left", "right"],
    bestPractices: [
      "Use para informacoes complementares.",
      "Evite tooltips longos.",
      "Nao substitua texto essencial."
    ]
  },
  dropdown: {
    props: ["items", "onSelect", "disabled"],
    variants: ["default", "grouped"],
    bestPractices: [
      "Agrupe itens por contexto.",
      "Use labels curtos.",
      "Evite menus com muitas opcoes."
    ]
  },
  table: {
    props: ["columns", "data"],
    variants: ["default", "striped"],
    bestPractices: [
      "Alinhe numeros a direita.",
      "Use header fixo em listas longas.",
      "Inclua acoes por linha quando necessario."
    ]
  },
  calendar: {
    props: ["mode", "selected", "onSelect", "locale"],
    variants: ["single", "range"],
    bestPractices: [
      "Use locale pt-BR para datas.",
      "Informe intervalos disponiveis.",
      "Evite datas sem contexto."
    ]
  },
  toast: {
    props: ["title", "description", "variant", "action"],
    variants: ["default", "success", "warning", "info", "destructive"],
    bestPractices: [
      "Use variante success (verde), warning (amarelo), info (azul) ou destructive (vermelho) conforme o tipo.",
      "Toasts exibem icone automaticamente por variante (CheckCircle, AlertTriangle, Info, AlertCircle).",
      "Inclua acao (ex.: Desfazer) somente quando fizer sentido."
    ]
  },
  breadcrumb: {
    props: ["items", "separator"],
    variants: ["default"],
    bestPractices: [
      "Use para hierarquias profundas.",
      "Evite mais de 4 niveis.",
      "Deixe o ultimo item como pagina atual."
    ]
  },
  pagination: {
    props: ["page", "total", "onChange"],
    variants: ["default", "compact"],
    bestPractices: [
      "Mostre pagina atual com destaque.",
      "Inclua botoes de anterior/proximo.",
      "Evite excesso de paginas visiveis."
    ]
  },
  colors: {
    props: ["tokens", "palette"],
    variants: ["primary", "secondary", "semantic"],
    bestPractices: [
      "Use apenas cores do design system.",
      "Mantenha contraste adequado.",
      "Evite inventar novas cores."
    ]
  },
  colorpicker: {
    props: ["value", "onChange", "presets"],
    variants: ["popover", "inline"],
    bestPractices: [
      "Ofereca presets oficiais.",
      "Mostre o valor hexadecimal.",
      "Evite cores fora do branding."
    ]
  },
  typography: {
    props: ["as", "size", "weight"],
    variants: ["headline", "title", "body", "caption"],
    bestPractices: [
      "Respeite hierarquia de titulos.",
      "Evite mais de 2 tamanhos por bloco.",
      "Use muted para textos auxiliares."
    ]
  },
  splitbutton: {
    props: ["onClick", "items", "disabled"],
    variants: ["default", "secondary", "outline"],
    bestPractices: [
      "Mantenha uma acao primaria clara.",
      "Agrupe opcoes relacionadas.",
      "Evite menus com muitas opcoes."
    ]
  },
  rangeslider: {
    props: ["value", "onValueChange", "min", "max", "step"],
    variants: ["range"],
    bestPractices: [
      "Mostre intervalo selecionado.",
      "Defina min e max claros.",
      "Use step coerente com o dominio."
    ]
  },
  rating: {
    props: ["value", "onChange", "max"],
    variants: ["stars", "hearts", "thumbs"],
    bestPractices: [
      "Mostre o valor selecionado.",
      "Evite usar rating sem contexto.",
      "Mantenha icones consistentes."
    ]
  },
  fileupload: {
    props: ["accept", "multiple", "onUpload"],
    variants: ["drag-and-drop", "compact"],
    bestPractices: [
      "Informe tipos e limites de tamanho.",
      "Exiba progresso de upload.",
      "Permita remover arquivos."
    ]
  },
  chips: {
    props: ["selected", "onRemove", "onToggle"],
    variants: ["default", "filter", "status"],
    bestPractices: [
      "Limite o numero de chips por linha.",
      "Use cores semanticas quando houver status.",
      "Evite textos longos."
    ]
  },
  header: {
    props: ["title", "actions", "user"],
    variants: ["default", "compact"],
    bestPractices: [
      "Mantenha o logo e titulo visiveis.",
      "Coloque acoes principais a direita.",
      "Use busca apenas quando necessario."
    ]
  },
  sidebar: {
    props: ["items", "collapsed", "active"],
    variants: ["default", "compact"],
    bestPractices: [
      "Destaque o item ativo.",
      "Evite mais de 6 itens principais.",
      "Use submenu apenas quando necessario."
    ]
  },
  treeview: {
    props: ["nodes", "expanded", "onToggle"],
    variants: ["default"],
    bestPractices: [
      "Mostre estado expandido com icone.",
      "Evite profundidade excessiva.",
      "Use nomes curtos para pastas."
    ]
  },
  stepper: {
    props: ["steps", "currentStep", "onChange"],
    variants: ["horizontal", "vertical", "compact"],
    bestPractices: [
      "Mostre a etapa atual com destaque.",
      "Use labels curtos.",
      "Evite steps longos."
    ]
  },
  timeline: {
    props: ["events", "status"],
    variants: ["vertical", "horizontal"],
    bestPractices: [
      "Ordene eventos por data.",
      "Destaque o evento atual.",
      "Use descricoes curtas."
    ]
  },
  notification: {
    props: ["count", "items", "onRead"],
    variants: ["dropdown", "inline"],
    bestPractices: [
      "Mantenha a lista curta.",
      "Mostre horario e contexto.",
      "Permita marcar como lidas."
    ]
  },
  copytoclipboard: {
    props: ["value", "onCopy", "disabled"],
    variants: ["button", "input", "icon"],
    bestPractices: [
      "Exiba feedback de sucesso.",
      "Evite copiar sem acao do usuario.",
      "Use tooltip para clareza."
    ]
  },
  loaders: {
    props: ["size", "variant"],
    variants: ["spinner", "dots", "skeleton"],
    bestPractices: [
      "Use skeleton para listas e cards.",
      "Evite loading infinito sem mensagem.",
      "Mantenha consistencia de tamanho."
    ]
  },
  icons: {
    props: ["size", "className"],
    variants: ["outline"],
    bestPractices: [
      "Use icones para reforcar texto.",
      "Mantenha tamanhos consistentes.",
      "Evite icones sem contexto."
    ]
  }
};

const getUsage = (id: string, category: string): ComponentUsageGuide =>
  usageById[id] ?? categoryUsage[category] ?? baseUsage;

const componentsDataBase: Omit<ComponentExportData, "usage">[] = [
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
</Button>`,
    codeVue: `<script setup lang="ts">
// Variantes: use as classes ou props do seu wrapper
</script>

<template>
  <button class="btn btn-primary">Default</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-outline">Outline</button>
  <button class="btn btn-ghost">Ghost</button>
  <button class="btn btn-link">Link</button>
  <button class="btn btn-sm">Pequeno</button>
  <button class="btn btn-lg">Grande</button>
  <button class="btn" disabled>Desabilitado</button>
</template>`,
    codeBootstrap: `<!-- Botões Bootstrap -->
<button type="button" class="btn btn-primary">Default</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-outline-primary">Outline</button>
<button type="button" class="btn btn-link">Link</button>
<button type="button" class="btn btn-sm btn-primary">Pequeno</button>
<button type="button" class="btn btn-lg btn-primary">Grande</button>
<button type="button" class="btn btn-primary" disabled>Desabilitado</button>`
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
<Input className="border-destructive" />`,
    codeVue: `<script setup lang="ts">
import { ref } from 'vue';
const value = ref('');
</script>

<template>
  <input v-model="value" type="text" class="input input-bordered w-full" placeholder="Digite aqui..." />
  <div class="form-control">
    <label class="label"><span class="label-text">Email</span></label>
    <input type="email" placeholder="email@exemplo.com" class="input input-bordered w-full" />
  </div>
  <input type="text" placeholder="Campo desabilitado" class="input input-bordered w-full input-disabled" disabled />
</template>`,
    codeBootstrap: `<!-- Inputs Bootstrap -->
<input class="form-control" type="text" placeholder="Digite aqui..." />

<div class="mb-3">
  <label for="email" class="form-label">Email</label>
  <input id="email" type="email" class="form-control" placeholder="email@exemplo.com" />
</div>

<div class="input-group">
  <span class="input-group-text"><i class="bi bi-search"></i></span>
  <input type="text" class="form-control" placeholder="Buscar..." />
</div>

<input class="form-control" type="text" placeholder="Desabilitado" disabled />`
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
</Select>`,
    codeVue: `<script setup lang="ts">const selected = ref('');</script>
<template>
  <select v-model="selected" class="select select-bordered w-full max-w-xs">
    <option value="">Selecione uma opção</option>
    <option value="apple">Maçã</option>
    <option value="banana">Banana</option>
    <option value="orange">Laranja</option>
  </select>
</template>`,
    codeBootstrap: `<select class="form-select" aria-label="Selecione">
  <option selected>Selecione uma opção</option>
  <option value="apple">Maçã</option>
  <option value="banana">Banana</option>
  <option value="orange">Laranja</option>
</select>`
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
<Checkbox checked="indeterminate" />`,
    codeVue: `<script setup lang="ts">const checked = ref(false);</script>
<template>
  <div class="form-control">
    <label class="label cursor-pointer gap-2">
      <input v-model="checked" type="checkbox" class="checkbox" />
      <span class="label-text">Aceito os termos de uso</span>
    </label>
  </div>
</template>`,
    codeBootstrap: `<div class="form-check">
  <input class="form-check-input" type="checkbox" id="terms" />
  <label class="form-check-label" for="terms">Aceito os termos de uso</label>
</div>`
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
<Switch disabled />`,
    codeVue: `<script setup lang="ts">const enabled = ref(false);</script>
<template>
  <label class="swap swap-flip">
    <input v-model="enabled" type="checkbox" />
    <div class="swap-on btn">Ligado</div>
    <div class="swap-off btn btn-ghost">Desligado</div>
  </label>
</template>`,
    codeBootstrap: `<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="switch1" />
  <label class="form-check-label" for="switch1">Modo Avião</label>
</div>`
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
/>`,
    codeVue: `<script setup lang="ts">
import { ref } from 'vue';
const value = ref(50);
</script>
<template>
  <input v-model="value" type="range" min="0" max="100" class="range range-primary" />
  <p class="text-sm text-muted-foreground">Valor: {{ value }}</p>
</template>`,
    codeBootstrap: `<input type="range" class="form-range" min="0" max="100" value="50" />
<p class="form-text">Valor: 50</p>`
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
<Textarea disabled placeholder="Campo desabilitado" />`,
    codeVue: `<template>
  <textarea class="textarea textarea-bordered w-full min-h-[120px]" placeholder="Digite sua mensagem..."></textarea>
</template>`,
    codeBootstrap: `<div class="mb-3">
  <label for="msg" class="form-label">Mensagem</label>
  <textarea id="msg" class="form-control" rows="4" placeholder="Digite sua mensagem..."></textarea>
</div>`
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
</Card>`,
    codeVue: `<template>
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Título do Card</h2>
      <p>Descrição breve do conteúdo.</p>
      <p>Conteúdo principal do card.</p>
      <div class="card-actions justify-end">
        <button class="btn btn-ghost">Cancelar</button>
        <button class="btn btn-primary">Confirmar</button>
      </div>
    </div>
  </div>
</template>`,
    codeBootstrap: `<div class="card">
  <div class="card-header">
    <h5 class="card-title">Título do Card</h5>
    <p class="text-muted small">Descrição breve.</p>
  </div>
  <div class="card-body"><p>Conteúdo principal.</p></div>
  <div class="card-footer d-flex justify-content-between">
    <button class="btn btn-outline-secondary">Cancelar</button>
    <button class="btn btn-primary">Confirmar</button>
  </div>
</div>`
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
<Alert className="border-destructive bg-destructive/10">
  <AlertCircle className="h-4 w-4 text-destructive" />
  <AlertTitle className="text-destructive">Erro</AlertTitle>
  <AlertDescription>Ocorreu um erro ao processar.</AlertDescription>
</Alert>`,
    codeVue: `<template>
  <div class="alert alert-info">
    <span class="font-medium">Informação</span>
    <span>Mensagem informativa.</span>
  </div>
  <div class="alert alert-success">
    <span class="font-medium">Sucesso!</span>
    <span>Operação realizada com sucesso.</span>
  </div>
  <div class="alert alert-warning">
    <span class="font-medium">Atenção</span>
    <span>Verifique os dados antes de continuar.</span>
  </div>
  <div class="alert alert-error">
    <span class="font-medium">Erro</span>
    <span>Ocorreu um erro ao processar.</span>
  </div>
</template>`,
    codeBootstrap: `<div class="alert alert-info" role="alert">
  <strong>Informação.</strong> Mensagem informativa.
</div>
<div class="alert alert-success" role="alert">
  <strong>Sucesso!</strong> Operação realizada com sucesso.
</div>
<div class="alert alert-warning" role="alert">
  <strong>Atenção.</strong> Verifique os dados antes de continuar.
</div>
<div class="alert alert-danger" role="alert">
  <strong>Erro.</strong> Ocorreu um erro ao processar.
</div>`
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
<Badge className="bg-warning text-warning-foreground">Pendente</Badge>`,
    codeVue: `<template>
  <span class="badge badge-primary">Default</span>
  <span class="badge badge-secondary">Secondary</span>
  <span class="badge badge-error">Destructive</span>
  <span class="badge badge-outline">Outline</span>
  <span class="badge badge-success">Aprovado</span>
  <span class="badge badge-warning">Pendente</span>
</template>`,
    codeBootstrap: `<span class="badge bg-primary">Default</span>
<span class="badge bg-secondary">Secondary</span>
<span class="badge bg-danger">Destructive</span>
<span class="badge border border-primary text-primary">Outline</span>
<span class="badge bg-success">Aprovado</span>
<span class="badge bg-warning text-dark">Pendente</span>`
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
</div>`,
    codeVue: `<template>
  <div class="avatar">
    <div class="w-12 rounded-full ring ring-primary ring-offset-base-100">
      <img src="https://github.com/shadcn.png" alt="Avatar" />
    </div>
  </div>
  <div class="avatar placeholder">
    <div class="bg-primary text-primary-content w-12 rounded-full">
      <span>CN</span>
    </div>
  </div>
</template>`,
    codeBootstrap: `<img src="https://github.com/shadcn.png" alt="Avatar" class="rounded-circle" width="48" height="48" />
<div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style="width:48px;height:48px">
  <span>CN</span>
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
</Tabs>`,
    codeVue: `<script setup lang="ts">
const tab = ref('account');
</script>
<template>
  <div class="tabs tabs-boxed">
    <a class="tab" :class="{ 'tab-active': tab === 'account' }" @click="tab = 'account'">Conta</a>
    <a class="tab" :class="{ 'tab-active': tab === 'password' }" @click="tab = 'password'">Senha</a>
  </div>
  <div v-show="tab === 'account'" class="p-4">Conteúdo da conta...</div>
  <div v-show="tab === 'password'" class="p-4">Conteúdo da senha...</div>
</template>`,
    codeBootstrap: `<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#conta">Conta</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#senha">Senha</a></li>
</ul>
<div class="tab-content">
  <div id="conta" class="tab-pane fade show active">Conteúdo da conta...</div>
  <div id="senha" class="tab-pane fade">Conteúdo da senha...</div>
</div>`
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
<Progress value={75} className="h-3" />`,
    codeVue: `<script setup lang="ts">
const progress = ref(33);
</script>
<template>
  <progress class="progress progress-primary" :value="progress" max="100"></progress>
  <p class="text-sm text-muted-foreground">{{ progress }}%</p>
</template>`,
    codeBootstrap: `<div class="progress">
  <div class="progress-bar" role="progressbar" style="width: 33%" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">33%</div>
</div>`
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
<TooltipContent side="right">...</TooltipContent>`,
    codeVue: `<template>
  <div class="tooltip tooltip-top" data-tip="Dica de ajuda aqui">
    <button class="btn btn-outline">Hover me</button>
  </div>
</template>`,
    codeBootstrap: `<button type="button" class="btn btn-outline-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Dica de ajuda aqui">Hover me</button>
<script>document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));</script>`
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
</DropdownMenu>`,
    codeVue: `<script setup lang="ts">
const open = ref(false);
</script>
<template>
  <div class="dropdown" :class="{ 'dropdown-open': open }">
    <label tabindex="0" class="btn btn-outline m-1" @click="open = !open">Menu</label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56">
      <li><a>Perfil</a></li>
      <li><a>Configurações</a></li>
      <li><a class="text-error">Sair</a></li>
    </ul>
  </div>
</template>`,
    codeBootstrap: `<div class="dropdown">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Menu</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Perfil</a></li>
    <li><a class="dropdown-item" href="#">Configurações</a></li>
    <li><hr class="dropdown-divider" /></li>
    <li><a class="dropdown-item text-danger" href="#">Sair</a></li>
  </ul>
</div>`
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
</Table>`,
    codeVue: `<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <caption>Lista de usuários cadastrados</caption>
      <thead>
        <tr><th>Nome</th><th>Email</th><th>Status</th><th class="text-right">Ações</th></tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-medium">João Silva</td>
          <td>joao@email.com</td>
          <td><span class="badge bg-success">Ativo</span></td>
          <td class="text-right"><button class="btn btn-ghost btn-sm">Editar</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>`,
    codeBootstrap: `<div class="table-responsive">
  <table class="table table-striped">
    <caption>Lista de usuários cadastrados</caption>
    <thead><tr><th>Nome</th><th>Email</th><th>Status</th><th class="text-end">Ações</th></tr></thead>
    <tbody>
      <tr>
        <td class="fw-medium">João Silva</td>
        <td>joao@email.com</td>
        <td><span class="badge bg-success">Ativo</span></td>
        <td class="text-end"><button class="btn btn-sm btn-outline-secondary">Editar</button></td>
      </tr>
    </tbody>
  </table>
</div>`
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
/>`,
    codeVue: `<script setup lang="ts">
import { ref } from 'vue';
const date = ref<Date | null>(null);
</script>
<template>
  <input v-model="date" type="date" class="input input-bordered" />
  <p class="text-sm text-muted-foreground" v-if="date">{{ date }}</p>
</template>`,
    codeBootstrap: `<div class="mb-3">
  <label for="date1" class="form-label">Data</label>
  <input type="date" class="form-control" id="date1" />
</div>`
  },
  {
    id: "toast",
    name: "Toast / Notificação",
    category: "Feedback",
    description: "Notificações temporárias para feedback de ações. Padrão NORTE: ícone à esquerda por variante (sucesso, aviso, informação, erro).",
    code: `import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button onClick={() => {
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Ação realizada com sucesso.",
      });
    }}>
      Mostrar Toast
    </Button>
  );
}

// Sucesso (ícone CheckCircle, verde)
toast({ variant: "success", title: "Cadastro realizado", description: "O registro foi salvo com sucesso." });

// Aviso (ícone AlertTriangle, amarelo)
toast({ variant: "warning", title: "Atenção", description: "Verifique os dados informados." });

// Informação (ícone Info, azul)
toast({ variant: "info", title: "Nova atualização", description: "Uma nova versão está disponível." });

// Erro (ícone AlertCircle, vermelho)
toast({ variant: "destructive", title: "Erro", description: "Não foi possível completar a operação." });

// Com ação
toast({
  title: "Item removido",
  description: "O item foi movido para a lixeira.",
  action: <Button variant="outline" size="sm">Desfazer</Button>,
});`,
    codeVue: `<script setup lang="ts">
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
</template>`,
    codeBootstrap: `<!-- Container de toasts (position-fixed) -->
<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
  <!-- Sucesso (verde) -->
  <div class="toast show border-success" style="background-color: rgba(var(--bs-success-rgb), 0.1);" role="alert">
    <div class="toast-header">
      <strong class="me-auto text-success">Sucesso!</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Ação realizada com sucesso.</div>
  </div>

  <!-- Aviso (amarelo) -->
  <div class="toast show border-warning" style="background-color: rgba(var(--bs-warning-rgb), 0.1);" role="alert">
    <div class="toast-header">
      <strong class="me-auto text-warning">Atenção</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Verifique os dados informados.</div>
  </div>

  <!-- Informação (azul) -->
  <div class="toast show border-info" style="background-color: rgba(var(--bs-info-rgb), 0.1);" role="alert">
    <div class="toast-header">
      <strong class="me-auto text-info">Informação</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Uma nova versão está disponível.</div>
  </div>

  <!-- Erro (vermelho) -->
  <div class="toast show border-danger bg-danger text-white" role="alert">
    <div class="toast-header text-white">
      <strong class="me-auto">Erro</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="toast-body">Não foi possível completar a operação.</div>
  </div>
</div>`
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
</Pagination>`,
    codeVue: `<template>
  <div class="join">
    <button class="join-item btn btn-sm">«</button>
    <button class="join-item btn btn-sm">1</button>
    <button class="join-item btn btn-sm btn-active">2</button>
    <button class="join-item btn btn-sm">3</button>
    <button class="join-item btn btn-sm">»</button>
  </div>
</template>`,
    codeBootstrap: `<nav><ul class="pagination">
  <li class="page-item"><a class="page-link" href="#">«</a></li>
  <li class="page-item"><a class="page-link" href="#">1</a></li>
  <li class="page-item active"><span class="page-link">2</span></li>
  <li class="page-item"><a class="page-link" href="#">3</a></li>
  <li class="page-item"><a class="page-link" href="#">»</a></li>
</ul></nav>`
  },
  {
    id: "colors",
    name: "Cores & Tokens",
    category: "Design System",
    description: "Demonstra a paleta institucional e os tokens de cor do EstrelaUI.",
    code: `import { cn } from "@/lib/utils";

const palette = [
  { label: "Primary", token: "--primary", classes: "bg-primary text-primary-foreground" },
  { label: "Secondary", token: "--secondary", classes: "bg-secondary text-secondary-foreground" },
  { label: "Accent", token: "--accent", classes: "bg-accent text-accent-foreground" },
  { label: "Info", token: "--info", classes: "bg-info text-info-foreground" },
  { label: "Success", token: "--success", classes: "bg-success text-success-foreground" },
  { label: "Warning", token: "--warning", classes: "bg-warning text-warning-foreground" },
  { label: "Destructive", token: "--destructive", classes: "bg-destructive text-destructive-foreground" },
];

<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  {palette.map((color) => (
    <div
      key={color.label}
      className={cn("rounded-lg p-3 shadow-sm", color.classes)}
    >
      <p className="text-sm font-medium">{color.label}</p>
      <p className="text-xs opacity-80">{color.token}</p>
    </div>
  ))}
</div>`,
    codeVue: `<script setup lang="ts">
const palette = [
  { label: 'Primary', token: '--primary', classes: 'bg-primary text-primary-foreground' },
  { label: 'Secondary', token: '--secondary', classes: 'bg-secondary text-secondary-foreground' },
  { label: 'Accent', token: '--accent', classes: 'bg-accent text-accent-foreground' },
  { label: 'Info', token: '--info', classes: 'bg-info text-info-foreground' },
  { label: 'Success', token: '--success', classes: 'bg-success text-success-foreground' },
  { label: 'Warning', token: '--warning', classes: 'bg-warning text-warning-foreground' },
  { label: 'Destructive', token: '--destructive', classes: 'bg-destructive text-destructive-foreground' },
];
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
    <div
      v-for="color in palette"
      :key="color.label"
      class="rounded-lg p-3 shadow-sm"
      :class="color.classes"
    >
      <p class="text-sm font-medium">{{ color.label }}</p>
      <p class="text-xs opacity-80">{{ color.token }}</p>
    </div>
  </div>
</template>`,
    codeBootstrap: `<!-- Paleta EstrelaUI com Bootstrap -->
<div class="row g-3">
  <div class="col-6 col-md-4">
    <div class="rounded p-3 shadow-sm bg-primary text-white">
      <p class="small fw-medium mb-0">Primary</p>
      <p class="small opacity-75 mb-0">--primary</p>
    </div>
  </div>
  <div class="col-6 col-md-4">
    <div class="rounded p-3 shadow-sm bg-secondary text-white">
      <p class="small fw-medium mb-0">Secondary</p>
      <p class="small opacity-75 mb-0">--secondary</p>
    </div>
  </div>
  <div class="col-6 col-md-4">
    <div class="rounded p-3 shadow-sm bg-success text-white">
      <p class="small fw-medium mb-0">Success</p>
      <p class="small opacity-75 mb-0">--success</p>
    </div>
  </div>
  <!-- Repita para Info, Warning, Destructive conforme tokens do tema -->
</div>`
  },
  {
    id: "colorpicker",
    name: "Color Picker",
    category: "Design System",
    description: "Seletor de cores com presets institucionais e input hexadecimal.",
    code: `import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const presets = ["#1e3a5f", "#2563eb", "#0891b2", "#059669", "#f97316", "#dc2626"];
const [color, setColor] = useState(presets[0]);
const [customColor, setCustomColor] = useState(presets[0]);

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[220px] justify-start gap-2">
      <div className="h-5 w-5 rounded border" style={{ backgroundColor: color }} />
      {color.toUpperCase()}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[240px] space-y-4">
    <div className="grid grid-cols-6 gap-2">
      {presets.map((preset) => (
        <button
          key={preset}
          onClick={() => setColor(preset)}
          className={cn(
            "h-8 w-8 rounded-md border-2 transition-all",
            color === preset ? "border-foreground scale-110" : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: preset }}
        />
      ))}
    </div>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={customColor}
        onChange={(event) => {
          setCustomColor(event.target.value);
          setColor(event.target.value);
        }}
        className="h-12 w-12 rounded-lg border"
      />
      <Input
        value={customColor.toUpperCase()}
        onChange={(event) => setCustomColor(event.target.value)}
        placeholder="#0B3C5D"
      />
    </div>
  </PopoverContent>
</Popover>`,
    codeVue: `<script setup lang="ts">
import { ref } from 'vue';
const presets = ['#1e3a5f', '#2563eb', '#0891b2', '#059669', '#f97316', '#dc2626'];
const color = ref(presets[0]);
const customColor = ref(presets[0]);
</script>

<template>
  <div class="dropdown">
    <label tabindex="0" class="btn btn-outline gap-2 w-[220px] justify-start">
      <div class="w-5 h-5 rounded border" :style="{ backgroundColor: color }"></div>
      {{ color.toUpperCase() }}
    </label>
    <div tabindex="0" class="dropdown-content z-10 w-[240px] p-4 shadow-lg space-y-4">
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="preset in presets"
          :key="preset"
          type="button"
          class="h-8 w-8 rounded-md border-2 transition-all"
          :class="color === preset ? 'border-foreground scale-110' : 'border-transparent'"
          :style="{ backgroundColor: preset }"
          @click="color = preset"
        />
      </div>
      <div class="flex items-center gap-3">
        <input v-model="customColor" type="color" class="h-12 w-12 rounded-lg border" @input="color = customColor" />
        <input v-model="customColor" type="text" class="input input-bordered flex-1" placeholder="#0B3C5D" />
      </div>
    </div>
  </div>
</template>`,
    codeBootstrap: `<!-- Color Picker com Bootstrap -->
<div class="dropdown">
  <button class="btn btn-outline dropdown-toggle" type="button" data-bs-toggle="dropdown">
    <span class="d-inline-block rounded border me-2" style="width:20px;height:20px;background:#1e3a5f"></span>
    #1E3A5F
  </button>
  <div class="dropdown-menu p-3">
    <div class="d-flex flex-wrap gap-2 mb-3">
      <button type="button" class="rounded border p-2" style="background:#1e3a5f;width:32px;height:32px"></button>
      <button type="button" class="rounded border p-2" style="background:#2563eb;width:32px;height:32px"></button>
      <button type="button" class="rounded border p-2" style="background:#0891b2;width:32px;height:32px"></button>
    </div>
    <div class="d-flex align-items-center gap-2">
      <input type="color" value="#1e3a5f" class="form-control form-control-color w-100" />
      <input type="text" class="form-control" value="#1E3A5F" placeholder="#0B3C5D" />
    </div>
  </div>
</div>`
  },
  {
    id: "typography",
    name: "Tipografia NORTE",
    category: "Tipografia",
    description: "Guia rápido de títulos, parágrafos e meta-informações padronizadas.",
    code: `import { Separator } from "@/components/ui/separator";

<div className="space-y-6">
  <div>
    <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">Headline</p>
    <h1 className="text-4xl font-semibold text-secondary">Título Principal</h1>
    <p className="text-base text-muted-foreground mt-2">
      Use esta estrutura para textos introdutórios e descrições institucionais.
    </p>
  </div>

  <Separator />

  <div className="grid gap-6 md:grid-cols-2">
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold text-foreground">Subtítulo</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Corpo do texto com 16px e altura de linha 1.5 para leitura confortável.
      </p>
      <p className="text-xs uppercase text-muted-foreground tracking-wide">Label</p>
    </div>
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Legenda</p>
      <p className="text-xs text-muted-foreground">
        Use para descrições menores, dados auxiliares e estados.
      </p>
      <span className="text-[11px] font-mono text-muted-foreground"># Meta info / Código</span>
    </div>
  </div>
</div>`,
    codeVue: `<template>
  <div class="space-y-4">
    <p class="text-xs uppercase tracking-widest text-muted-foreground">Headline</p>
    <h1 class="text-4xl font-semibold text-secondary">Título Principal</h1>
    <h2 class="text-2xl font-semibold">Subtítulo</h2>
    <p class="text-sm text-muted-foreground">Corpo do texto.</p>
    <p class="text-xs uppercase text-muted-foreground">Label / Legenda</p>
  </div>
</template>`,
    codeBootstrap: `<p class="small text-uppercase text-muted">Headline</p>
<h1 class="display-6 fw-semibold">Título Principal</h1>
<h2 class="h4 fw-semibold">Subtítulo</h2>
<p class="lead">Corpo do texto.</p>
<p class="small text-muted">Label / Legenda</p>`
  },
  {
    id: "splitbutton",
    name: "Split Button",
    category: "Botões",
    description: "Combina uma ação principal com menu contextual de opções.",
    code: `import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Save, SaveAll, FileDown } from "lucide-react";

<div className="inline-flex rounded-md shadow-sm">
  <Button className="rounded-r-none">
    <Save className="mr-2 h-4 w-4" />
    Salvar
  </Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="rounded-l-none border-l border-primary/30 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <SaveAll className="mr-2 h-4 w-4" />
        Salvar tudo
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FileDown className="mr-2 h-4 w-4" />
        Salvar como...
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`
  },
  {
    id: "rangeslider",
    name: "Range Slider",
    category: "Formulários",
    description: "Controle deslizante com dois handles para seleção de intervalo.",
    code: `import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const [range, setRange] = useState([20, 80]);

<div className="space-y-4">
  <div className="flex justify-between text-sm text-muted-foreground">
    <Label>Intervalo</Label>
    <span>{range[0]} - {range[1]}</span>
  </div>
  <Slider value={range} onValueChange={setRange} min={0} max={100} step={1} />
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>0</span>
    <span>100</span>
  </div>
</div>`,
    codeVue: `<script setup lang="ts">
const range = ref([20, 80]);
</script>
<template>
  <div class="flex justify-between text-sm text-muted-foreground mb-2">
    <span>Intervalo</span>
    <span>{{ range[0] }} - {{ range[1] }}</span>
  </div>
  <input type="range" min="0" max="100" v-model="range[0]" class="range range-primary" />
  <input type="range" min="0" max="100" v-model="range[1]" class="range range-primary" />
</template>`,
    codeBootstrap: `<label class="form-label">Intervalo</label>
<div class="d-flex gap-2 align-items-center">
  <input type="range" class="form-range flex-grow-1" min="0" max="100" value="20" />
  <input type="range" class="form-range flex-grow-1" min="0" max="100" value="80" />
</div>`
  },
  {
    id: "rating",
    name: "Rating",
    category: "Avaliação",
    description: "Avaliação com estrelas interativas e feedback textual.",
    code: `import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);

<div className="flex flex-col items-center gap-2">
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((value) => (
      <button
        key={value}
        onClick={() => setRating(value)}
        onMouseEnter={() => setHoverRating(value)}
        onMouseLeave={() => setHoverRating(0)}
        className="focus:outline-none transition-transform hover:scale-110"
      >
        <Star
          className={cn(
            "h-7 w-7 transition-colors",
            (hoverRating || rating) >= value ? "fill-warning text-warning" : "text-muted-foreground"
          )}
        />
      </button>
    ))}
  </div>
  <p className="text-sm text-muted-foreground">
    {rating > 0 ? \`Você avaliou: \${rating} estrela\${rating > 1 ? 's' : ''}\` : "Clique para avaliar"}
  </p>
</div>`,
    codeVue: `<script setup lang="ts">
const rating = ref(0);
const hoverRating = ref(0);
</script>
<template>
  <div class="flex flex-col items-center gap-2">
    <div class="rating rating-lg gap-1">
      <input v-for="v in 5" :key="v" type="radio" :name="'rating'" class="mask mask-star-2 bg-warning" :value="v" v-model="rating" />
    </div>
    <p class="text-sm text-muted-foreground">{{ rating > 0 ? \`Você avaliou: \${rating} estrela(s)\` : 'Clique para avaliar' }}</p>
  </div>
</template>`,
    codeBootstrap: `<div class="d-flex align-items-center gap-1">
  <span class="text-warning">★</span><span class="text-warning">★</span><span class="text-warning">★</span><span class="text-muted">☆</span><span class="text-muted">☆</span>
</div>
<p class="small text-muted mb-0">Clique para avaliar (use JS para interatividade)</p>`
  },
  {
    id: "fileupload",
    name: "File Upload",
    category: "Arquivos & Mídia",
    description: "Área de upload com suporte a drag & drop e feedback de progresso.",
    code: `import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const [isDragging, setIsDragging] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  setIsDragging(false);
  const files = Array.from(event.dataTransfer.files);
  // Processar arquivos aqui
};

<div
  onDragOver={(event) => {
    event.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current?.click()}
  className={cn(
    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
  )}
>
  <input ref={fileInputRef} type="file" multiple className="hidden" />
  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
  <p className="mt-4 text-sm">
    <span className="font-semibold text-primary">Clique para enviar</span> ou arraste arquivos
  </p>
  <p className="text-xs text-muted-foreground">PNG, JPG, PDF até 10 MB  </p>
</div>`,
    codeVue: `<script setup lang="ts">
const isDragging = ref(false);
function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  const files = Array.from(e.dataTransfer?.files ?? []);
}
</script>
<template>
  <div
    class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
    :class="isDragging ? 'border-primary bg-primary/5' : 'border-base-300'"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop="onDrop"
  >
    <input type="file" multiple class="hidden" />
    <p class="mt-2 text-sm"><span class="font-semibold text-primary">Clique para enviar</span> ou arraste arquivos</p>
    <p class="text-xs text-muted-foreground">PNG, JPG, PDF até 10 MB</p>
  </div>
</template>`,
    codeBootstrap: `<div class="border border-2 border-dashed rounded p-5 text-center">
  <input type="file" class="form-control" multiple />
  <p class="mt-2 small text-muted">Clique ou arraste arquivos. PNG, JPG, PDF até 10 MB</p>
</div>`
  },
  {
    id: "chips",
    name: "Chips / Tags",
    category: "Tags & Categorias",
    description: "Tags selecionáveis e removíveis para filtros e classificações.",
    code: `import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const allTags = ["React", "TypeScript", "Node.js", "Python"];
const [selected, setSelected] = useState(["React", "TypeScript"]);

const toggleTag = (tag: string) => {
  setSelected((prev) =>
    prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
  );
};

<div className="space-y-3">
  <div className="flex flex-wrap gap-2">
    {selected.map((tag) => (
      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
        {tag}
        <button
          onClick={() => toggleTag(tag)}
          className="rounded-full hover:bg-muted-foreground/20 p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    ))}
  </div>

  <div className="flex flex-wrap gap-2">
    {allTags.map((tag) => (
      <button
        key={tag}
        onClick={() => toggleTag(tag)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border transition-colors",
          selected.includes(tag)
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background border-input hover:bg-accent"
        )}
      >
        {selected.includes(tag) && <Check className="h-3 w-3" />}
        {tag}
      </button>
    ))}
  </div>
</div>`,
    codeVue: `<script setup lang="ts">
const allTags = ['React', 'TypeScript', 'Node.js', 'Python'];
const selected = ref(['React', 'TypeScript']);
function toggle(t: string) {
  if (selected.value.includes(t)) selected.value = selected.value.filter(x => x !== t);
  else selected.value = [...selected.value, t];
}
</script>
<template>
  <div class="flex flex-wrap gap-2">
    <span v-for="tag in selected" :key="tag" class="badge badge-secondary gap-1">
      {{ tag }} <button class="btn btn-ghost btn-xs" @click="toggle(tag)">×</button>
    </span>
  </div>
  <div class="flex flex-wrap gap-2 mt-2">
    <button v-for="tag in allTags" :key="tag" class="btn btn-sm" :class="selected.includes(tag) ? 'btn-primary' : 'btn-outline'" @click="toggle(tag)">{{ tag }}</button>
  </div>
</template>`,
    codeBootstrap: `<div class="d-flex flex-wrap gap-1">
  <span class="badge bg-secondary">React <button type="button" class="btn-close btn-close-white btn-close-sm" aria-label="Remover"></button></span>
  <span class="badge bg-secondary">TypeScript</span>
</div>
<div class="d-flex flex-wrap gap-1 mt-2">
  <button type="button" class="btn btn-sm btn-primary">React</button>
  <button type="button" class="btn btn-sm btn-outline-primary">Node.js</button>
</div>`
  },
  {
    id: "header",
    name: "Header Corporativo",
    category: "Layout",
    description: "Cabeçalho fixo com busca, ações e menu do usuário alinhados ao padrão NORTE.",
    code: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 items-center gap-4">
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-corporate flex items-center justify-center">
        <span className="text-white font-bold text-sm">N</span>
      </div>
      <span className="font-semibold text-secondary hidden sm:inline">NORTE</span>
    </div>

    <div className="flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Pesquisar no sistema..." />
      </div>
    </div>

    <div className="flex items-center gap-2 ml-auto">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px]">3</Badge>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm text-left leading-tight">
              João Silva
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Perfil</DropdownMenuItem>
          <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Configurações</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>`,
    codeVue: `<template>
  <header class="navbar bg-base-100 border-b sticky top-0 z-40">
    <div class="flex-1 gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span class="text-white font-bold text-sm">N</span></div>
      <span class="font-semibold hidden sm:inline">NORTE</span>
    </div>
    <div class="flex-none gap-2">
      <input type="text" placeholder="Pesquisar..." class="input input-bordered input-sm w-48" />
      <button class="btn btn-ghost btn-circle relative"><span class="badge badge-sm absolute -top-1 -right-1">3</span>🔔</button>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost gap-2">
          <div class="avatar placeholder"><div class="bg-neutral text-neutral-content w-8 rounded-full"><span>JS</span></div></div>
          <span class="hidden sm:inline">João Silva</span> ▼
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56">
          <li><a>Perfil</a></li><li><a>Configurações</a></li>
          <li><hr /></li><li><a class="text-error">Sair</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>`,
    codeBootstrap: `<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom sticky-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">NORTE</a>
    <div class="d-flex align-items-center ms-auto gap-2">
      <input class="form-control form-control-sm" type="search" placeholder="Pesquisar..." />
      <button class="btn btn-outline-secondary position-relative"><i class="bi bi-bell"></i><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span></button>
      <div class="dropdown">
        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">João Silva</button>
        <ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="#">Perfil</a></li><li><a class="dropdown-item" href="#">Configurações</a></li><li><hr class="dropdown-divider" /><li><a class="dropdown-item text-danger" href="#">Sair</a></li></ul>
      </div>
    </div>
  </div>
</nav>`
  },
  {
    id: "sidebar",
    name: "Menu Lateral",
    category: "Navegação",
    description: "Menu lateral colapsável com hierarquia visual e submenu.",
    code: `import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, FileText, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "documentos", label: "Documentos", icon: FileText },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const [collapsed, setCollapsed] = useState(false);
const [activeItem, setActiveItem] = useState("dashboard");

<aside className={cn(
  "h-full border rounded-xl bg-sidebar transition-all duration-300",
  collapsed ? "w-16" : "w-64"
)}>
  <div className="flex flex-col h-full">
    <div className="h-14 border-b flex items-center justify-center">
      <span className={cn("font-bold text-lg tracking-wide", collapsed && "hidden")}>
        NORTE
      </span>
    </div>
    <nav className="flex-1 p-2 space-y-1">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveItem(item.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            activeItem === item.id
              ? "bg-sidebar-accent text-primary font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="h-12 border-t flex items-center justify-center hover:bg-sidebar-accent/50"
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </button>
  </div>
</aside>`,
    codeVue: `<script setup lang="ts">
const collapsed = ref(false);
const active = ref('dashboard');
const items = [{ id: 'dashboard', label: 'Dashboard' }, { id: 'documentos', label: 'Documentos' }, { id: 'usuarios', label: 'Usuários' }, { id: 'configuracoes', label: 'Configurações' }];
</script>
<template>
  <aside class="menu border rounded-xl p-2" :class="collapsed ? 'w-16' : 'w-64'">
    <p class="menu-title font-bold" v-if="!collapsed">NORTE</p>
    <ul class="menu bg-base-100 rounded-lg">
      <li v-for="item in items" :key="item.id"><a :class="{ active: active === item.id }" @click="active = item.id">{{ item.label }}</a></li>
    </ul>
    <button class="btn btn-ghost btn-sm w-full mt-2" @click="collapsed = !collapsed">{{ collapsed ? '»' : '«' }}</button>
  </aside>
</template>`,
    codeBootstrap: `<div class="d-flex flex-column flex-shrink-0 border rounded p-2" style="width: 16rem;">
  <span class="fw-bold p-2">NORTE</span>
  <ul class="nav nav-pills flex-column">
    <li class="nav-item"><a class="nav-link active" href="#">Dashboard</a></li>
    <li class="nav-item"><a class="nav-link" href="#">Documentos</a></li>
    <li class="nav-item"><a class="nav-link" href="#">Usuários</a></li>
    <li class="nav-item"><a class="nav-link" href="#">Configurações</a></li>
  </ul>
</div>`
  },
  {
    id: "treeview",
    name: "Tree View",
    category: "Navegação",
    description: "Estrutura hierárquica navegável para pastas e arquivos.",
    code: `import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
}

const nodes: TreeNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "1.1", name: "components", type: "folder" },
      { id: "1.2", name: "pages", type: "folder" },
      { id: "1.3", name: "App.tsx", type: "file" },
    ],
  },
  { id: "2", name: "package.json", type: "file" },
];

const [expanded, setExpanded] = useState<Set<string>>(new Set(["1"]));
const [selected, setSelected] = useState<string | null>("1.3");

const toggle = (id: string) => {
  setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};

function TreeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;
  const Icon = node.type === "folder" ? (isExpanded ? FolderOpen : Folder) : File;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: \`\${level * 16 + 8}px\` }}
        onClick={() => {
          setSelected(node.id);
          if (node.type === "folder") toggle(node.id);
        }}
      >
        {node.type === "folder" && (
          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
        <Icon className="h-4 w-4" />
        <span className="text-sm">{node.name}</span>
      </div>
      {isExpanded && node.children?.map((child) => (
        <TreeItem key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
}

<div className="w-full max-w-sm border rounded-lg p-2 bg-card">
  {nodes.map((node) => (
    <TreeItem key={node.id} node={node} />
  ))}
</div>`,
    codeVue: `<script setup lang="ts">
const expanded = ref(['1']);
const nodes = [{ id: '1', name: 'src', type: 'folder', children: [{ id: '1.1', name: 'components', type: 'folder' }, { id: '1.2', name: 'pages', type: 'folder' }, { id: '1.3', name: 'App.tsx', type: 'file' }] }, { id: '2', name: 'package.json', type: 'file' }];
function toggle(id: string) {
  if (expanded.value.includes(id)) expanded.value = expanded.value.filter(x => x !== id);
  else expanded.value = [...expanded.value, id];
}
</script>
<template>
  <ul class="menu bg-base-200 rounded-lg w-64 p-2">
    <li v-for="node in nodes" :key="node.id">
      <a @click="node.type === 'folder' && toggle(node.id)">
        {{ node.type === 'folder' ? (expanded.includes(node.id) ? '▼' : '▶') : '📄' }} {{ node.name }}
      </a>
      <ul v-if="node.children && expanded.includes(node.id)" class="menu ml-4">
        <li v-for="child in node.children" :key="child.id"><a>{{ child.type === 'folder' ? '📁' : '📄' }} {{ child.name }}</a></li>
      </ul>
    </li>
  </ul>
</template>`,
    codeBootstrap: `<ul class="list-group list-group-flush">
  <li class="list-group-item d-flex align-items-center"><span class="me-2">▶</span> src</li>
  <li class="list-group-item d-flex align-items-center ps-5"><span class="me-2">📁</span> components</li>
  <li class="list-group-item d-flex align-items-center ps-5"><span class="me-2">📁</span> pages</li>
  <li class="list-group-item d-flex align-items-center ps-5"><span class="me-2">📄</span> App.tsx</li>
  <li class="list-group-item d-flex align-items-center"><span class="me-2">📄</span> package.json</li>
</ul>`
  },
  {
    id: "stepper",
    name: "Stepper",
    category: "Fluxo & Progresso",
    description: "Indicador de etapas para formulários multi-step.",
    code: `import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, title: "Dados Pessoais" },
  { id: 2, title: "Endereço" },
  { id: 3, title: "Pagamento" },
  { id: 4, title: "Confirmação" },
];

const [currentStep, setCurrentStep] = useState(1);

<div className="space-y-6">
  <div className="flex items-center justify-between">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center flex-1">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-semibold border-2",
              currentStep > step.id
                ? "bg-primary border-primary text-primary-foreground"
                : currentStep === step.id
                ? "border-primary text-primary"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
          </div>
          <span className={cn(
            "mt-2 text-xs text-center",
            currentStep >= step.id ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {step.title}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className={cn(
            "h-0.5 flex-1 mx-2",
            currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
          )} />
        )}
      </div>
    ))}
  </div>

  <div className="flex gap-2 justify-center">
    <Button variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
      Anterior
    </Button>
    <Button onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))} disabled={currentStep === steps.length}>
      Próximo
    </Button>
  </div>
</div>`,
    codeVue: `<script setup lang="ts">
const steps = [{ id: 1, title: 'Dados Pessoais' }, { id: 2, title: 'Endereço' }, { id: 3, title: 'Pagamento' }, { id: 4, title: 'Confirmação' }];
const currentStep = ref(1);
</script>
<template>
  <ul class="steps steps-horizontal w-full">
    <li v-for="s in steps" :key="s.id" class="step" :class="{ 'step-primary': currentStep >= s.id }">{{ s.title }}</li>
  </ul>
  <div class="flex justify-center gap-2 mt-4">
    <button class="btn btn-outline" :disabled="currentStep === 1" @click="currentStep--">Anterior</button>
    <button class="btn btn-primary" :disabled="currentStep === steps.length" @click="currentStep++">Próximo</button>
  </div>
</template>`,
    codeBootstrap: `<ul class="stepper d-flex justify-content-between list-unstyled">
  <li class="step active"><span class="step-number">1</span> Dados Pessoais</li>
  <li class="step"><span class="step-number">2</span> Endereço</li>
  <li class="step"><span class="step-number">3</span> Pagamento</li>
  <li class="step"><span class="step-number">4</span> Confirmação</li>
</ul>
<div class="d-flex justify-content-center gap-2 mt-3">
  <button class="btn btn-outline-secondary">Anterior</button>
  <button class="btn btn-primary">Próximo</button>
</div>`
  },
  {
    id: "timeline",
    name: "Timeline",
    category: "Fluxo & Progresso",
    description: "Linha do tempo vertical para acompanhamento de status e eventos.",
    code: `import { Check, Package, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  { id: 1, title: "Pedido Confirmado", description: "Seu pedido foi recebido", status: "complete" },
  { id: 2, title: "Pagamento Aprovado", description: "Pagamento processado", status: "complete" },
  { id: 3, title: "Em Preparação", description: "Pedido em produção", status: "current" },
  { id: 4, title: "Enviado", description: "Aguardando expedição", status: "pending" },
];

const getIcon = (status: string) => {
  switch (status) {
    case "complete":
      return Check;
    case "current":
      return Package;
    case "pending":
      return Truck;
    default:
      return MapPin;
  }
};

<div className="space-y-0">
  {events.map((event, index) => {
    const Icon = getIcon(event.status);
    return (
      <div key={event.id} className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            event.status === "complete"
              ? "bg-success text-success-foreground"
              : event.status === "current"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          {index < events.length - 1 && (
            <div className={cn(
              "w-0.5 h-16 mt-2",
              event.status === "complete" ? "bg-success" : "bg-muted"
            )} />
          )}
        </div>
        <div className="pb-6">
          <h4 className={cn(
            "font-medium",
            event.status === "pending" && "text-muted-foreground"
          )}>{event.title}</h4>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
      </div>
    );
  })}
</div>`,
    codeVue: `<script setup lang="ts">
const events = [
  { id: 1, title: 'Pedido Confirmado', description: 'Seu pedido foi recebido', status: 'complete' },
  { id: 2, title: 'Pagamento Aprovado', description: 'Pagamento processado', status: 'complete' },
  { id: 3, title: 'Em Preparação', description: 'Pedido em produção', status: 'current' },
  { id: 4, title: 'Enviado', description: 'Aguardando expedição', status: 'pending' },
];
</script>
<template>
  <ul class="timeline timeline-vertical">
    <li v-for="(e, i) in events" :key="e.id">
      <div :class="['timeline-box', e.status === 'complete' ? 'bg-success' : e.status === 'current' ? 'bg-primary' : 'bg-base-300']">{{ e.title }}</div>
      <p class="text-sm text-muted-foreground">{{ e.description }}</p>
    </li>
  </ul>
</template>`,
    codeBootstrap: `<div class="position-relative ps-4 border-start">
  <div class="position-absolute top-0 start-0 translate-middle rounded-circle bg-success text-white" style="width:1.5rem;height:1.5rem;margin-left:-0.75rem;">✓</div>
  <h6 class="mb-1">Pedido Confirmado</h6>
  <p class="small text-muted">Seu pedido foi recebido</p>
  <div class="position-absolute top-0 start-0 translate-middle rounded-circle bg-primary text-white mt-4" style="width:1.5rem;height:1.5rem;margin-left:-0.75rem;">2</div>
  <h6 class="mb-1">Pagamento Aprovado</h6>
  <p class="small text-muted">Pagamento processado</p>
</div>`
  },
  {
    id: "notification",
    name: "Notificação / Bell",
    category: "Feedback",
    description: "Menu de notificações com contador e lista de alertas.",
    code: `import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const [unreadCount, setUnreadCount] = useState(5);
const notifications = [
  { id: 1, title: "Nova mensagem", description: "João enviou um recado", time: "há 5 min", read: false },
  { id: 2, title: "Deploy concluído", description: "Release 2.0 publicada", time: "há 30 min", read: true },
];

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[11px]">
          {unreadCount}
        </Badge>
      )}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-80">
    <div className="flex items-center justify-between p-2 border-b">
      <span className="font-semibold text-sm">Notificações</span>
      <Button variant="ghost" size="sm" onClick={() => setUnreadCount(0)}>
        <Check className="h-4 w-4 mr-1" />
        Marcar todas
      </Button>
    </div>
    <div className="max-h-64 overflow-y-auto">
      {notifications.map((notification) => (
        <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-xs text-muted-foreground">{notification.description}</p>
          <span className="text-xs text-muted-foreground">{notification.time}</span>
        </DropdownMenuItem>
      ))}
    </div>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="justify-center text-primary text-sm">
      Ver todas
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
  },
  {
    id: "copytoclipboard",
    name: "Copy to Clipboard",
    category: "Utilitários",
    description: "Botões e inputs com ação de copiar e feedback visual.",
    code: `import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

const [copied, setCopied] = useState(false);
const value = "https://estrelaui.dev";

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(value);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

<div className="flex flex-col gap-4 max-w-md">
  <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-fit">
    {copied ? <Check className="h-4 w-4 mr-2 text-success" /> : <Copy className="h-4 w-4 mr-2" />}
    {copied ? "Copiado!" : "Copiar texto"}
  </Button>

  <div className="flex">
    <Input value={value} readOnly className="rounded-r-none" />
    <Button
      variant="outline"
      className="rounded-l-none border-l-0"
      onClick={copyToClipboard}
    >
      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
    </Button>
  </div>
</div>`,
    codeVue: `<script setup lang="ts">
const copied = ref(false);
const value = 'https://estrelaui.dev';
async function copyToClipboard() {
  await navigator.clipboard.writeText(value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}
</script>
<template>
  <div class="flex flex-col gap-4 max-w-md">
    <button class="btn btn-outline btn-sm" @click="copyToClipboard">
      {{ copied ? '✓ Copiado!' : '📋 Copiar texto' }}
    </button>
    <div class="join w-full">
      <input type="text" :value="value" readonly class="input input-bordered join-item flex-1" />
      <button class="btn btn-outline join-item" @click="copyToClipboard">{{ copied ? '✓' : '📋' }}</button>
    </div>
  </div>
</template>`,
    codeBootstrap: `<div class="input-group">
  <input type="text" class="form-control" value="https://estrelaui.dev" readonly />
  <button class="btn btn-outline-secondary" type="button" onclick="navigator.clipboard.writeText(this.previousElementSibling.value); this.textContent='Copiado!'">Copiar</button>
</div>`
  },
  {
    id: "loaders",
    name: "Loaders & Skeletons",
    category: "Loading",
    description: "Coleção de spinners, skeletons e indicadores de carregamento.",
    code: `// Spinner
<div className="flex items-center gap-4">
  <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
</div>

// Pontos pulando
<div className="flex gap-1 mt-4">
  <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
  <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
</div>

// Skeleton de card
<div className="mt-6 space-y-3 rounded-lg border p-4">
  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
  <div className="h-4 w-full bg-muted animate-pulse rounded" />
  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
</div>`
  },
  {
    id: "icons",
    name: "Galeria de Ícones",
    category: "Ícones",
    description: "Guia de uso dos ícones Lucide dentro do design system.",
    code: `import { Search, Bell, Settings, User } from "lucide-react";

const icons = [
  { label: "Buscar", icon: Search },
  { label: "Notificações", icon: Bell },
  { label: "Configurações", icon: Settings },
  { label: "Usuário", icon: User },
];

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {icons.map(({ label, icon: Icon }) => (
    <div
      key={label}
      className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center"
    >
      <Icon className="h-6 w-6 text-primary" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  ))}
</div>`,
    codeVue: `<script setup lang="ts">
const icons = [{ label: 'Buscar', icon: '🔍' }, { label: 'Notificações', icon: '🔔' }, { label: 'Configurações', icon: '⚙️' }, { label: 'Usuário', icon: '👤' }];
</script>
<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div v-for="item in icons" :key="item.label" class="flex flex-col items-center gap-2 rounded-lg border bg-base-200 p-4 text-center">
      <span class="text-2xl">{{ item.icon }}</span>
      <p class="text-sm font-medium">{{ item.label }}</p>
    </div>
  </div>
</template>`,
    codeBootstrap: `<div class="row g-3">
  <div class="col-6 col-md-3"><div class="card text-center p-3"><i class="bi bi-search fs-4 text-primary"></i><p class="small fw-medium mb-0 mt-2">Buscar</p></div></div>
  <div class="col-6 col-md-3"><div class="card text-center p-3"><i class="bi bi-bell fs-4 text-primary"></i><p class="small fw-medium mb-0 mt-2">Notificações</p></div></div>
  <div class="col-6 col-md-3"><div class="card text-center p-3"><i class="bi bi-gear fs-4 text-primary"></i><p class="small fw-medium mb-0 mt-2">Configurações</p></div></div>
  <div class="col-6 col-md-3"><div class="card text-center p-3"><i class="bi bi-person fs-4 text-primary"></i><p class="small fw-medium mb-0 mt-2">Usuário</p></div></div>
</div>`
  }
];

export const componentsData: ComponentExportData[] = componentsDataBase.map((component) => ({
  ...component,
  usage: getUsage(component.id, component.category)
}));

/** Mapa id -> dados de export para uso nos showcases (codeReact, codeVue, codeBootstrap). */
export const componentDataById: Record<string, ComponentExportData> = componentsData.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, ComponentExportData>
);

const STACKS: CodeStack[] = ["react", "vue", "bootstrap", "angular"];

export async function generateComponentsZip(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder("estrelaui-components");
  const mdFolder = root?.folder("markdown");

  const readmeContent = `# EstrelaUI - Biblioteca de Componentes

## Sistema de Padrões NORTE (UID00001-2026)

Esta biblioteca contém ${componentsData.length} componentes com suporte a múltiplas stacks.

## Estrutura

- \`/react\` - Código TypeScript/React (TSX)
- \`/vue\` - Componentes Vue 3 (SFC)
- \`/bootstrap\` - HTML com Bootstrap
- \`/angular\` - Código Angular (TypeScript)
- \`/markdown\` - Documentação em Markdown

Componentes sem código para uma stack específica usam o código de referência (React) na pasta correspondente.

## Categorias

${[...new Set(componentsData.map(c => c.category))].map(cat => `- ${cat}`).join("\n")}

---

Gerado automaticamente pelo EstrelaUI Design System
Data: ${new Date().toLocaleDateString("pt-BR")}
`;
  root?.file("README.md", readmeContent);

  for (const stack of STACKS) {
    const folder = root?.folder(stack);
    const ext = stack === "react" ? "tsx" : stack === "vue" ? "vue" : stack === "angular" ? "ts" : "html";
    for (const component of componentsData) {
      const code = getCodeForStack(component, stack);
      const header =
        stack === "react"
          ? `// ${component.name}\n// Categoria: ${component.category}\n// ${component.description}\n\n`
          : stack === "bootstrap"
            ? `<!-- ${component.name} - ${component.category} -->\n`
            : stack === "angular"
              ? `/** ${component.name} - ${component.category} - EstrelaUI/NORTE */\n\n`
              : "";
      folder?.file(`${component.id}.${ext}`, header + code);
    }
  }

  for (const component of componentsData) {
    const mdContent = `# ${component.name}

## Categoria
${component.category}

## Descrição
${component.description}

## Código (React)

\`\`\`tsx
${getCodeForStack(component, "react")}
\`\`\`

---

*EstrelaUI Design System - Padrão NORTE (UID00001-2026)*
`;
    mdFolder?.file(`${component.id}.md`, mdContent);
  }

  const indexContent = `// EstrelaUI Components Index
// Total: ${componentsData.length} componentes
// Stacks: react, vue, bootstrap

export const components = ${JSON.stringify(
    componentsData.map((c) => ({ id: c.id, name: c.name, category: c.category })),
    null,
    2
  )};
`;
  root?.file("index.ts", indexContent);

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
