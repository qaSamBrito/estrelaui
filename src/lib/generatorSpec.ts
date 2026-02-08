/**
 * Lógica pura de interpretação de prompt e geração de especificação de tela.
 * Usado pelo Gerador de Telas e por testes.
 */

export type Field = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  /** Opções para tipo select ou radio (combo, lista de opções). */
  options?: string[];
};

export type ThemeId = "norte" | "minimal";

export type ScreenSpec = {
  type: "crud" | "login" | "generic";
  title: string;
  subtitle: string;
  entity: string;
  fields: Field[];
  listColumns: string[];
  features: string[];
  stack: string;
  prompt: string;
  /** Tema visual do código gerado (NORTE padrão ou Minimal). */
  theme?: ThemeId;
};

export const defaultFields: Field[] = [
  { id: "name", label: "Nome", type: "text", placeholder: "Informe o nome", required: true, minLength: 1, maxLength: 200 },
  { id: "description", label: "Descrição", type: "text", placeholder: "Descrição breve", maxLength: 500 },
  { id: "status", label: "Status", type: "select", options: ["Ativo", "Inativo"] }
];

export const entityFieldMap: Record<string, Field[]> = {
  produto: [
    { id: "name", label: "Nome do produto", type: "text", placeholder: "Ex.: Teclado mecânico", required: true, maxLength: 200 },
    { id: "sku", label: "SKU", type: "text", placeholder: "Ex.: PRD-001", required: true },
    { id: "price", label: "Preço", type: "number", placeholder: "Ex.: 199,90" },
    { id: "stock", label: "Estoque", type: "number", placeholder: "Ex.: 120" },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  produtos: [
    { id: "name", label: "Nome do produto", type: "text", placeholder: "Ex.: Teclado mecânico" },
    { id: "sku", label: "SKU", type: "text", placeholder: "Ex.: PRD-001" },
    { id: "price", label: "Preço", type: "number", placeholder: "Ex.: 199,90" },
    { id: "stock", label: "Estoque", type: "number", placeholder: "Ex.: 120" },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  usuario: [
    { id: "name", label: "Nome", type: "text", placeholder: "Ex.: Maria Silva", required: true },
    { id: "email", label: "E-mail", type: "email", placeholder: "Ex.: maria@empresa.com", required: true, pattern: "^[^@]+@[^@]+\\.[^@]+$", patternMessage: "E-mail inválido" },
    { id: "role", label: "Perfil", type: "select", options: ["Administrador", "Usuário", "Visitante"] },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  usuarios: [
    { id: "name", label: "Nome", type: "text", placeholder: "Ex.: Maria Silva" },
    { id: "email", label: "E-mail", type: "email", placeholder: "Ex.: maria@empresa.com" },
    { id: "role", label: "Perfil", type: "select", options: ["Administrador", "Usuário", "Visitante"] },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  cliente: [
    { id: "name", label: "Nome", type: "text", placeholder: "Ex.: Carlos Souza", required: true },
    { id: "email", label: "E-mail", type: "email", placeholder: "Ex.: carlos@empresa.com", required: true, pattern: "^[^@]+@[^@]+\\.[^@]+$", patternMessage: "E-mail inválido" },
    { id: "phone", label: "Telefone", type: "text", placeholder: "Ex.: (11) 99999-0000" },
    { id: "status", label: "Status", type: "select", options: ["Ativo", "Inativo"] }
  ],
  clientes: [
    { id: "name", label: "Nome", type: "text", placeholder: "Ex.: Carlos Souza" },
    { id: "email", label: "E-mail", type: "email", placeholder: "Ex.: carlos@empresa.com" },
    { id: "phone", label: "Telefone", type: "text", placeholder: "Ex.: (11) 99999-0000" },
    { id: "status", label: "Status", type: "select", options: ["Ativo", "Inativo"] }
  ],
  pedido: [
    { id: "orderNumber", label: "Número do pedido", type: "text", placeholder: "Ex.: PED-2026-001" },
    { id: "client", label: "Cliente", type: "text", placeholder: "Nome do cliente" },
    { id: "total", label: "Total", type: "number", placeholder: "Ex.: 1.299,90" },
    { id: "status", label: "Status", type: "select", options: ["Pendente", "Aprovado", "Entregue", "Cancelado"] }
  ],
  pedidos: [
    { id: "orderNumber", label: "Número do pedido", type: "text", placeholder: "Ex.: PED-2026-001" },
    { id: "client", label: "Cliente", type: "text", placeholder: "Nome do cliente" },
    { id: "total", label: "Total", type: "number", placeholder: "Ex.: 1.299,90" },
    { id: "status", label: "Status", type: "select", options: ["Pendente", "Aprovado", "Entregue", "Cancelado"] }
  ],
  categoria: [
    { id: "name", label: "Nome da categoria", type: "text", placeholder: "Ex.: Eletrônicos" },
    { id: "slug", label: "Slug", type: "text", placeholder: "Ex.: eletronicos" },
    { id: "description", label: "Descrição", type: "text", placeholder: "Descrição breve", maxLength: 500 },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  categorias: [
    { id: "name", label: "Nome da categoria", type: "text", placeholder: "Ex.: Eletrônicos" },
    { id: "slug", label: "Slug", type: "text", placeholder: "Ex.: eletronicos" },
    { id: "description", label: "Descrição", type: "text", placeholder: "Descrição breve", maxLength: 500 },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  fornecedor: [
    { id: "name", label: "Razão social", type: "text", placeholder: "Ex.: Empresa XYZ Ltda" },
    { id: "cnpj", label: "CNPJ", type: "text", placeholder: "Ex.: 00.000.000/0001-00" },
    { id: "email", label: "E-mail", type: "email", placeholder: "Ex.: contato@empresa.com" },
    { id: "phone", label: "Telefone", type: "text", placeholder: "Ex.: (11) 3333-4444" },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  fornecedores: [
    { id: "name", label: "Razão social", type: "text", placeholder: "Ex.: Empresa XYZ Ltda" },
    { id: "cnpj", label: "CNPJ", type: "text", placeholder: "Ex.: 00.000.000/0001-00" },
    { id: "email", label: "E-mail", type: "email", placeholder: "Ex.: contato@empresa.com" },
    { id: "phone", label: "Telefone", type: "text", placeholder: "Ex.: (11) 3333-4444" },
    { id: "ativo", label: "Ativo", type: "switch" }
  ],
  projeto: [
    { id: "name", label: "Nome do projeto", type: "text", placeholder: "Ex.: Sistema ERP" },
    { id: "description", label: "Descrição", type: "text", placeholder: "Descrição do projeto", maxLength: 500 },
    { id: "startDate", label: "Data de início", type: "date", required: true },
    { id: "status", label: "Status", type: "select", options: ["Em andamento", "Concluído", "Pausado"] }
  ],
  projetos: [
    { id: "name", label: "Nome do projeto", type: "text", placeholder: "Ex.: Sistema ERP" },
    { id: "description", label: "Descrição", type: "text", placeholder: "Descrição do projeto", maxLength: 500 },
    { id: "startDate", label: "Data de início", type: "date" },
    { id: "status", label: "Status", type: "select", options: ["Em andamento", "Concluído", "Pausado"] }
  ],
  tarefa: [
    { id: "titulo", label: "Título", type: "text", placeholder: "Ex.: Revisar documentação", required: true, maxLength: 200 },
    { id: "descricao", label: "Descrição", type: "text", placeholder: "Detalhes da tarefa", maxLength: 500 },
    { id: "prazo", label: "Prazo", type: "date", placeholder: "Data de entrega", required: true },
    { id: "status", label: "Status", type: "select", options: ["A fazer", "Em andamento", "Concluída", "Atrasada"] },
    { id: "prioridade", label: "Prioridade", type: "select", options: ["Alta", "Média", "Baixa"] }
  ],
  tarefas: [
    { id: "titulo", label: "Título", type: "text", placeholder: "Ex.: Revisar documentação", required: true, maxLength: 200 },
    { id: "descricao", label: "Descrição", type: "text", placeholder: "Detalhes da tarefa", maxLength: 500 },
    { id: "prazo", label: "Prazo", type: "date", placeholder: "Data de entrega", required: true },
    { id: "status", label: "Status", type: "select", options: ["A fazer", "Em andamento", "Concluída", "Atrasada"] },
    { id: "prioridade", label: "Prioridade", type: "select", options: ["Alta", "Média", "Baixa"] }
  ]
};

const titleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const STOP_WORDS = /^(minhas?|meus?|minha|meu|as|os|a|o|um|uma)\s+/i;

function normalizeEntityPhrase(phrase: string): string {
  const trimmed = phrase.trim().replace(/\s+/g, " ");
  return trimmed.replace(STOP_WORDS, "").trim() || trimmed;
}

export function detectEntity(prompt: string): { entity: string; lower: string } {
  const lower = prompt.toLowerCase();
  let raw = "itens";
  const crudMatch = lower.match(/crud\s+(de\s+)?([a-z0-9áàâãéèêíïóôõöúç\s]+)/);
  // Captura frase após verbo (gerenciar/cadastrar etc.), até "para", "de", vírgula ou fim
  const storyMatch = lower.match(
    /(?:quero|desejo)\s+(?:cadastrar|gerenciar|listar|editar|remover|criar)\s+([a-záàâãéèêíïóôõöúç\s]+?)(?=\s+para\s+|\s+de\s+|\s*$|,)/i
  );
  const entityMatch = lower.match(/(?:cadastro|gerenciamento|lista)\s+(?:de\s+)?([a-záàâãéèêíïóôõöúç\s]+?)(?=\s+para\s+|\s*$|,)/i);
  if (crudMatch?.[2]) {
    raw = crudMatch[2].trim().split(/\s+/).slice(0, 3).join(" ");
  } else if (storyMatch?.[1]) {
    raw = normalizeEntityPhrase(storyMatch[1]);
    if (!raw) raw = "itens";
  } else if (entityMatch?.[1]) {
    raw = normalizeEntityPhrase(entityMatch[1]) || entityMatch[1].trim();
  }
  const entity = titleCase(raw || "itens");
  return { entity, lower };
}

export function buildSpecFromPrompt(prompt: string, stack: string): ScreenSpec {
  const { entity, lower } = detectEntity(prompt);
  const isCrud = /crud|listar|cadastrar|editar|remover|gerenciar|criar/.test(lower);
  const isLogin = /login|acesso|entrar/.test(lower);

  if (isLogin) {
    return {
      type: "login",
      title: "Acesso ao Sistema",
      subtitle: "Entre com suas credenciais para continuar",
      entity: "Acesso",
      fields: [
        { id: "email", label: "Email", type: "email", placeholder: "seu@email.com" },
        { id: "password", label: "Senha", type: "password", placeholder: "Digite sua senha" }
      ],
      listColumns: [],
      features: ["Validação de campos", "Esqueci minha senha", "Manter conectado"],
      stack,
      prompt,
      theme: "norte"
    };
  }

  if (isCrud) {
    // Prefer longer key match (e.g. "tarefas" over "tarefa") when prompt contains both
    const key = Object.keys(entityFieldMap)
      .sort((a, b) => b.length - a.length)
      .find((item) => lower.includes(item));
    const fields = key ? entityFieldMap[key] : defaultFields;
    const listColumns = fields.map((field) => field.label);
    return {
      type: "crud",
      title: `CRUD de ${entity}`,
      subtitle: `Gerencie cadastros de ${entity.toLowerCase()} com busca e filtro`,
      entity,
      fields,
      listColumns,
      features: ["Busca rápida", "Filtro por status", "Paginação", "Ações por linha"],
      stack,
      prompt,
      theme: "norte"
    };
  }

  return {
    type: "generic",
    title: "Tela Gerada",
    subtitle: "Estrutura base pronta para ajustes",
    entity: "Itens",
    fields: defaultFields,
    listColumns: ["Nome", "Descrição", "Status"],
    features: ["Layout responsivo", "Formulário com validação básica"],
    stack,
    prompt,
    theme: "norte"
  };
}
