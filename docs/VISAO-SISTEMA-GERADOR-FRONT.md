# Visão do Sistema: Gerador de Front-End Padronizado

**Autor:** Sâmi (QA)  
**Objetivo principal:** Forçar os desenvolvedores a usarem o padrão de interface EstrelaUI/NORTE em todo código gerado. O sistema automatiza a criação de front-end a partir de descrições (CRUD, histórias de usuário, etc.) — e o faz sempre dentro do padrão oficial, eliminando variações e desvios.  
**Repositório de referência:** [estrelaui](https://github.com/qaSamBrito/estrelaui)

---

## 1. Problema

- Sistemas WEB com variações de layout entre projetos.
- Aspecto não profissional e falta de padronização.
- Retrabalho e inconsistência quando cada time faz o front à sua maneira.

## 2. Solução: Conceito do Sistema

**Uma única premissa inegociável:** todo front gerado usa **componentes e padrão oficial da empresa** (EstrelaUI/NORTE).  
O sistema recebe **input em texto livre** (do “CRUD de Produtos” até uma História de Usuário completa) e entrega **front-end pronto para integração** (ou protótipo funcional para apresentação), na **stack escolhida** (React, Vue, Bootstrap, etc.).

### 2.1 O que o sistema faz

| Funcionalidade | Descrição |
|----------------|-----------|
| **Geração a partir de input** | Usuário descreve a funcionalidade em texto; o sistema gera telas, formulários, validações e fluxos de front. |
| **Stack configurável** | Geração em React, Vue, Bootstrap ou outras stacks principais, sempre respeitando o design system. |
| **Biblioteca de componentes** | Busca, visualização, código e “como usar” de cada componente do repositório oficial. |
| **Preview interativo** | Preview do front gerado; usuário clica na área que quer alterar e o sistema permite ajustar o prompt e regerar. |
| **Entrega em ZIP** | Ao concluir, download de um ZIP com o front completo + README de como usar no projeto. |
| **Modo protótipo (PO)** | Protótipo funcional com mocks para apresentação a stakeholders; pode ser salvo para o DEV “completar” com arquivos de integração com backend. |
| **Export de protótipos** | Download do protótipo em **PDF** e em **HTML funcional** (zipado). |
| **Componentes novos** | Se o usuário precisar de componente que não existe no repositório, o sistema pode ajudar a criar, salvar e atualizar o repositório. |

### 2.2 Perfis de usuário

| Perfil | Uso principal |
|--------|----------------|
| **Dev** | Gerar front pronto para integrar com backend (telas, serviços, tipos). |
| **QA** | Gerar telas padronizadas para testes e cenários. |
| **PO** | Gerar protótipos funcionais (com mocks) para apresentação; salvar como base para o time de dev. |

---

## 3. O que já existe no estrelaui (base para o sistema)

O repositório atual já entrega boa parte da **biblioteca de componentes** e do **padrão visual**:

- **Design System NORTE (UID00001-2026)**  
  - Cores (primary, secondary, accent, success, warning, destructive), tipografia, grids, sombras, radius.  
  - Tudo em `src/index.css` e componentes em `src/components/ui/` e `src/components/library/`.

- **Página de Biblioteca de Componentes** (`ComponentLibrary.tsx`)  
  - Busca por nome.  
  - Filtro por categoria (Design, Botões, Formulários, Navegação, etc.).  
  - Showcases visuais + expansão para ver cada componente.  
  - Ainda **não** mostra “código” e “como usar” por componente na mesma tela (isso existe em `componentExport.ts` mas não está totalmente integrado à UI de busca).

- **Exportação**  
  - ZIP de componentes (`generateComponentsZip`) e documentação em Markdown (`generateMarkdownDoc`).  
  - Dados de componentes em `src/lib/componentExport.ts` (nome, categoria, descrição, código de exemplo).

- **Stack atual**  
  - Vite, React, TypeScript, shadcn/ui, Tailwind.

Ou seja: **padrão de interface + catálogo de componentes + export** já estão parcialmente prontos. O que falta é: **geração por prompt**, **preview editável**, **modo protótipo com mocks**, **export PDF/HTML** e **fluxo PO → DEV**.

---

## 4. Roadmap sugerido (fases)

### Fase 1 – Biblioteca de componentes “completa” (curto prazo)

- **Objetivo:** Uma tela única onde o usuário busca componentes e vê: **preview visual**, **código** e **como usar**.
- **Ações:**  
  - Integrar os dados de `componentExport.ts` (e/ou metadados dos showcases) na tela de biblioteca.  
  - Para cada componente: abas ou seções “Visual”, “Código”, “Como usar” (texto + exemplo).  
  - Manter export ZIP e .MD já existentes.

**Entregável:** Busca + preview + código + uso por componente, alinhado ao padrão NORTE.

---

### Fase 2 – Geração de front a partir de input (core)

- **Objetivo:** Usuário digita uma descrição (ex.: “CRUD de Produtos” ou uma user story); o sistema gera o front (telas, formulários, validações) usando **apenas** componentes e padrões do EstrelaUI.
- **Premissa:** O “motor” de geração (ex.: IA/LLM) deve receber:  
  - Catálogo de componentes (nomes, props, exemplos de código).  
  - Regras de layout e tokens do NORTE (cores, espaçamento, tipografia).  
  - Instrução fixa: “usar somente estes componentes e este padrão”.
- **Ações:**  
  - Definir formato de “especificação” (ex.: JSON ou markdown) que descreve telas/forms.  
  - Implementar pipeline: texto do usuário → (opcional: IA) → especificação → gerador de código.  
  - Gerador produz React (prioridade) usando componentes de `@/components/ui` e do design system.  
  - Tela de “nova geração”: input de texto + escolha de stack (inicialmente React).

**Entregável:** Input de descrição → front-end em React seguindo EstrelaUI, com possibilidade de download em ZIP.

---

### Fase 3 – Preview interativo e ajuste por clique

- **Objetivo:** Após a geração, o usuário vê um **preview** do front e pode **clicar em uma área** para indicar “quero alterar isto”; o sistema permite refinar o prompt e regerar.
- **Ações:**  
  - Preview em iframe ou sandbox (ex.: preview da app gerada).  
  - Mapeamento “área clicada” → bloco/componente (ex.: card, formulário, tabela).  
  - Painel lateral ou modal: “O que você quer alterar aqui?” → novo texto → regeração apenas daquela parte ou da tela inteira (conforme desenho).

**Entregável:** Preview + clique na área + ajuste de prompt + regeração.

#### Alternativa ao preview por clique: painel de ajustes estruturado

- **Problema:** O preview “clique na área para editar” pode ser pouco óbvio (usuário não descobre onde clicar) e em tela cheia os elementos ficam apertados.
- **Alternativa sugerida (mesmo conceito – ajustar a tela antes de concluir):**
  - **Preview somente leitura:** O bloco “Preview interativo” mostra apenas o resultado visual da spec (sem cliques que alteram título/campos). Fica mais limpo e com mais espaço.
  - **Painel “Ajustar especificação”:** Um único painel (aba ou seção fixa) com formulário estruturado:
    - Título e subtítulo da tela
    - Nome da entidade
    - Lista de campos (label, placeholder, tipo) com botões para reordenar (▲▼), editar e remover
    - Colunas da lista (nome de cada coluna) com reordenar e editar
  - Qualquer alteração nesse formulário reflete em tempo real no preview (preview só leitura, mas atualizado). O usuário não precisa “adivinhar” onde clicar; todos os ajustes ficam em um lugar só.
- **Vantagens:** Mais previsível, acessível e fácil de usar em telas grandes; o mesmo conceito (ajustar antes de salvar/concluir) é atendido com UX mais clara.

---

### Fase 4 – Entrega em ZIP e README

- **Objetivo:** Ao finalizar a geração, o usuário baixa um **ZIP** com o front completo e um **README** explicando como usar no projeto (instalação, estrutura de pastas, como integrar com o backend).
- **Ações:**  
  - Estrutura padrão do ZIP (ex.: pasta do app React, componentes, estilos, assets).  
  - README gerado automaticamente: dependências, scripts, onde conectar API, variáveis de ambiente sugeridas.  
  - Botão “Download ZIP” na tela de resultado da geração.

**Entregável:** ZIP + README consistentes para qualquer front gerado.

---

### Fase 5 – Modo protótipo (PO) e mocks

- **Objetivo:** Perfil PO gera um **protótipo funcional** (pode ser com dados mockados) para apresentar a stakeholders; depois o DEV usa esse protótipo como base.
- **Ações:**  
  - Modo “Protótipo” na geração: mesmo fluxo de input, mas saída com mocks (ex.: dados em JSON ou serviços mock).  
  - Salvar “projeto/protótipo” no sistema (nome, descrição, telas, data).  
  - Tela “Meus protótipos” para PO e, para DEV, “Completar para backend” a partir de um protótipo salvo (adiciona serviços, tipos, integração API real).

**Entregável:** Geração em modo protótipo, salvamento de protótipos e fluxo PO → DEV.

---

### Fase 6 – Export de protótipos (PDF e HTML)

- **Objetivo:** PO pode baixar o protótipo em **PDF** (para documento/apresentação) e em **HTML funcional** (zipado) para demonstração offline.
- **Ações:**  
  - Geração de PDF a partir das telas do protótipo (ex.: uma página por tela ou fluxo).  
  - Export “HTML estático” do protótipo (JS/CSS inline ou em arquivos) em ZIP.  
  - Botões “Download PDF” e “Download HTML (ZIP)” na tela do protótipo.

**Entregável:** Download em PDF e em HTML zipado para cada protótipo.

---

### Fase 7 – Múltiplas stacks e componentes sob demanda

- **Objetivo:** Escolha de stack (Vue, Bootstrap, etc.) na geração; e criação de componentes novos quando o catálogo não tiver o que o usuário precisa.
- **Ações:**  
  - Adaptar o gerador para Vue/Bootstrap (templates e regras de uso do design system em cada stack).  
  - Fluxo “componente não existe”: usuário descreve → sistema propõe implementação no padrão NORTE → revisão → salvar no repositório (estrelaui) e atualizar catálogo.  
  - Versionamento e documentação do novo componente (código + como usar).

**Entregável:** Geração em mais de uma stack + criação e persistência de novos componentes no padrão.

---

## 5. Premissas técnicas (resumo)

- **Padrão inegociável:** Cores, tipografia, grids, navegação e componentes vêm do EstrelaUI/NORTE; nenhuma tela gerada pode fugir disso.  
- **Componentes novos:** Podem ser criados em conjunto (usuário + sistema), desde que sigam o padrão e sejam salvos no repositório.  
- **Protótipos:** Devem ser funcionais (incluindo mocks) e exportáveis em PDF e HTML.  
- **Dev:** Pode partir de um protótipo salvo e solicitar “completar com arquivos para integração com backend”.

---

## 6. Próximos passos imediatos

1. **Validar este documento** com time (Dev, PO, QA) e ajustar prioridades.  
2. **Fase 1:** Implementar na própria aplicação estrelaui a tela de busca de componentes com **visual + código + como usar** por componente.  
3. **Fase 2:** Definir stack inicial (React) e desenhar o fluxo “input texto → especificação → gerador → código React EstrelaUI”; decidir se haverá uso de IA e como (prompt + contexto do design system).  
4. **Repositório:** Manter estrelaui como fonte única de verdade para componentes e design system; o “sistema gerador” consome esse repositório (ou uma cópia publicada) para garantir o padrão.

---

## 7. Status das fases (atualizado)

| Fase | Status | Entregável |
|------|--------|------------|
| **Fase 1** | ✅ Concluída | Visual + Código + Como usar por componente |
| **Fase 2** | ✅ Concluída | Input → spec → gerador React/Vue/Bootstrap |
| **Fase 3** | ✅ Concluída | Preview + clique para editar + painel lateral |
| **Fase 4** | ✅ Concluída | ZIP + README para qualquer front gerado |
| **Fase 5** | ✅ Concluída | Modo protótipo, salvar specs, Completar para backend |
| **Fase 6** | ✅ Concluída | Download PDF e HTML (ZIP) |
| **Fase 7** | ✅ Concluída | Vue, Bootstrap, Sugerir componente |
| **Fase 8** | ✅ Concluída | Validação avançada, tema dark/light, export sugestões |
| **Fase 9** | ✅ Concluída | Multi-telas, validação regex, export para API, estrutura IA |
| **Fase 10** | ✅ Concluída | Edição validação na UI, multi-telas Vue |
| **Fase 11** | ✅ Concluída | Fluxo em etapas, tags obrigatórias, busca/agrupamento, auditoria |
| **Fase 12** | ✅ Concluída | Integração IA/LLM, multi-telas Bootstrap |

---

## 8. Fase 8 – Evoluções pós-roadmap (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **Validação avançada** | ✅ Concluída | Regras `required`, `minLength`, `maxLength` nos campos; validação no submit |
| **Tema dark/light** | ✅ Concluída | Toggle no projeto React gerado; CSS variables light/dark |
| **Export de sugestões** | ✅ Concluída | Botões "Exportar JSON" e "Exportar .MD" em Sugerir componente |

---

## 9. Fase 9 – Evoluções avançadas (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **Multi-telas** | ✅ Concluída | Fluxo lista → detalhe → edição no CRUD React gerado |
| **Validação regex** | ✅ Concluída | Campos com `pattern` e `patternMessage` (ex.: email) |
| **Export para API** | ✅ Concluída | Campo URL + botão "Enviar para API" em Sugerir componente |
| **Estrutura para IA** | ✅ Concluída | Toggle "Usar IA (em breve)" desabilitado, preparado para futura integração |

---

## 10. Fase 10 (concluída)

- **Edição de validação na UI** – Painel "Editar área" com campos: obrigatório, regex, mensagem de erro.
- **Multi-telas Vue** – Fluxo Ver/Editar no CRUD Vue gerado.

## 11. Fase 11 – Usabilidade reforçada (concluída)

- **Fluxo guiado em passos** – Gerador com etapas (Descrever → Ajustar preview → Entregáveis), botão de limpar prompt e validações antes da geração.
- **Tags e modo PO** – Campo obrigatório de tags em formato `#tag` com sugestões automáticas, auto-salvamento em rascunho e salvamento instantâneo quando o modo Protótipo está ativo.
- **Salvar rascunho e concluir** – Botões dedicados para rascunho e conclusão, com auditoria e transição automática para a etapa de artefatos (spec + código base).
- **Preview CRUD completo** – Abas para Lista, Grade, Cadastrar e Editar garantindo visualização de listar/editar/excluir/criar conforme padrão UID00001-2026.
- **Gestão de protótipos** – Página `Meus Protótipos` com busca livre, agrupamento por tags (#sistema, #sprint, #versao, etc.) e cartões com status (rascunho/final).
- **Auditoria consultável** – Nova página listando ações de geração, edição, exclusão e conclusão de protótipos e componentes com filtros e limite de registros.
- **Pesquisa unificada de componentes** – Tela de componentes combinando sugestões da interface e catálogo oficial (`componentsData`), com indicação da origem (Repositório/Sugestão).

## 12. Fase 12 – Integração IA e Bootstrap (concluída)

- **Integração IA/LLM** – Toggle "Usar IA" ativo; campo opcional para URL da API (POST). O sistema envia `{ prompt }` e aceita resposta com `interpretedPrompt` ou `prompt` para refinar o texto antes de gerar a spec. Sem URL, o prompt é usado como está.
- **Multi-telas Bootstrap** – Projetos HTML+Bootstrap gerados passam a ter fluxo lista → detalhe → edição: lista com Ver, Editar e Remover; tela de detalhe com Voltar e Editar; formulário de cadastro/edição com Salvar, Atualizar, Limpar e Cancelar; botão Novo na lista.

## 13. Fase 13 – Modelo IA configurável, testabilidade e a11y (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **Modelo OpenAI configurável** | ✅ Concluído | No Gerador, com provedor "OpenAI (GPT)", o usuário escolhe o modelo: gpt-4o-mini (rápido, econômico), gpt-4o, gpt-4-turbo, gpt-4 ou gpt-3.5-turbo. |
| **data-testid e a11y no código gerado** | ✅ Concluído | Todo o código exportado (React, Vue, Bootstrap/HTML e protótipo HTML) inclui `data-testid` em formulários, inputs, botões, tabelas e seções, além de `aria-label`, `role="main"`, `role="grid"` e `role="status"` onde aplicável. Telas geradas ficam prontas para testes manuais e automatizados (QA) e mais acessíveis. |

---

## 14. Fase 14 – Testes E2E e preparação para outras stacks (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **Testes E2E do fluxo do Gerador** | ✅ Concluído | Playwright em `e2e/gerador.spec.ts`: página inicial, Nova geração, validação, fluxo feliz, passo 2, navegação. Comando: `npm run test:e2e`. Data-testids em GeradorInicial e Generator. |
| **Outras stacks ou temas – documentação** | ✅ Concluído | `docs/COMO-ADICIONAR-NOVA-STACK.md` com passos para nova stack (ex.: Angular) e novo tema. |

---

## 15. Fase 15 – Tema visual opcional (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **Tema na spec e na UI** | ✅ Concluído | No passo 1 do Gerador, select "Tema visual" com opções **NORTE (padrão)** e **Minimal**. O valor é armazenado em `spec.theme` e preservado ao gerar a partir do prompt ou ao carregar spec salva. |
| **Tema Minimal (CSS)** | ✅ Concluído | CSS minimalista (fonte system-ui, cores neutras #1a1a1a / #fafafa, bordas simples) em `PROTOTYPE_CSS_MINIMAL`; `getThemeCss(theme)` retorna o bloco conforme o tema. |
| **Uso do tema nos exportadores** | ✅ Concluído | Protótipo HTML (login e CRUD) e ZIP Vue usam `getThemeCss(spec.theme)`. Export Bootstrap continua com Bootstrap CDN. React ZIP usa `getReactAppCss(spec.theme)` (Fase 17). |

---

## 16. Fase 16 – Stack Angular (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **Stack Angular no Gerador** | ✅ Concluído | Select "Stack" no passo 1 inclui opção **Angular**. Geração de projeto Angular 17+ standalone, com `getThemeCss(spec.theme)` para estilos. Padrão EstrelaUI/NORTE (UID00001-2026) em comentários e estrutura. |
| **Build e ZIP Angular** | ✅ Concluído | `buildAngularComponentTs(spec)`, `buildAngularComponentHtml(spec)`; `generateAngularProjectZip(spec)` gera package.json, angular.json, src/main.ts, src/app/app.component.*, src/styles.css. Login e CRUD com data-testid e aria-label. |
| **Documentação e testes** | ✅ Concluído | README no ZIP; textos atualizados para incluir Angular. E2E: teste "Stack Angular disponível no select do passo 1". |

---

## 17. Fase 17 – Tema Minimal no export React (concluída)

| Item | Status | Entregável |
|------|--------|------------|
| **App.css por tema no React** | ✅ Concluído | `getReactAppCss(theme)` retorna CSS completo do App.css: variante **NORTE** ou **Minimal**. |
| **Uso no ZIP React** | ✅ Concluído | `generateReactProjectZip` grava `App.css` com `getReactAppCss(spec.theme ?? "norte")`. |

---

## 18. Próximas evoluções

### Concluído em fases anteriores
- **Biblioteca: barra de código por componente** – Para cada componente, dentro da visualização do código, uma barra única substitui os antigos botões (<> e Copiar). Ordem: **Combo (stack)** em primeiro (com opção “Selecione” como padrão), **?** (Como usar), ícone **<>**, **Copiar**. O combo define o conteúdo exibido no bloco de código e no exemplo do popover “?”. Com “Selecione”, exibe mensagem orientando a escolher uma stack; ao selecionar React, Vue ou Bootstrap, o código e o exemplo atualizam conforme a stack.
- **Código por stack no export** – O `componentExport` expõe código por stack: `codeReact`, `codeVue`, `codeBootstrap` (opcionais), com fallback para `code`. Na biblioteca, o combo define o código e o exemplo exibidos.
- **codeVue e codeBootstrap completos** – Todos os componentes do catálogo passaram a ter exemplos em Vue e Bootstrap (slider, alert, badge, avatar, dialog, tabs, progress, tooltip, dropdown, table, calendar, toast, breadcrumb, pagination, typography, splitbutton, rangeslider, rating, fileupload, chips, header, sidebar, treeview, stepper, timeline, notification, copytoclipboard, loaders, icons), além dos já existentes (button, input, select, checkbox, switch, textarea, card, colors, colorpicker).
- **Integração IA expandida (OpenAI GPT)** – Provedor URL customizada ou OpenAI; chave via `.env` ou campo (não persistida). Validação de chave no painel (botão "Validar chave"; confere conexão e billing). Em produção: `VITE_IA_LOG_URL` opcional para enviar logs de request/response da IA a um serviço de monitoramento.
- **Fase 13** – Modelo OpenAI configurável; data-testid e a11y em todo código gerado.
- **Fase 14** – Testes E2E (Playwright) e documento Como adicionar nova stack/tema.
- **Fase 15** – Tema visual opcional (NORTE e Minimal) no Gerador; select na UI; CSS por tema em HTML e Vue.
- **Fase 16** – Stack Angular (build, ZIP, select, download); padrão EstrelaUI/NORTE.
- **Fase 17** – Tema Minimal no export React (getReactAppCss e uso no ZIP).

### Roadmap

**Objetivo central e inegociável:** forçar os desenvolvedores a usarem o padrão de interface EstrelaUI/NORTE em todo código gerado. Toda evolução do sistema (novas stacks, temas, funcionalidades) deve preservar e reforçar esse princípio.

- **Prioridade máxima:** Manter e reforçar o alinhamento de todo código gerado ao padrão EstrelaUI/NORTE do repositório. Nenhum output do sistema pode fugir desse padrão.
- Implementar novas stacks (ex.: Svelte) seguindo COMO-ADICIONAR-NOVA-STACK.md — sempre com código baseado exclusivamente no padrão EstrelaUI.

### Pontos de melhoria identificados
- **Alinhamento ao padrão (prioridade):** Qualquer desvio do EstrelaUI/NORTE no código gerado deve ser tratado como prioridade. Protótipos usam classes próprias; evoluir para uso dos tokens CSS do `index.css` (--primary, --card, etc.) nos projetos gerados quando aplicável.
- **Biblioteca:** Incluir "Angular" no combo de stacks da biblioteca quando houver exemplos em Angular. ✅ Concluído.
- **E2E:** Opcional: teste que seleciona Angular, gera tela e clica em "Baixar ZIP". ✅ Concluído.
- **A11y da UI do Gerador:** Revisar labels e roles dos controles do passo 1 para leitores de tela e navegação por teclado. ✅ Concluído (labels, aria-label, aria-describedby, role="region"/"alert"/"status", id nos triggers).

**Simplificação da tela de gerar (aplicada):** Passo 1 reorganizado com foco em "O que você quer gerar?" → campo de descrição + botão "Gerar tela". Stack, Tema, Modo protótipo e Usar IA foram movidos para "Opções avançadas" (Collapsible fechado por padrão), reduzindo ruído visual e tornando o fluxo mais intuitivo.

---

## 19. Fluxo IA, validação e entrega (visão detalhada)

O documento **[FLUXO-IA-VALIDACAO-E-ENTREGA.md](./FLUXO-IA-VALIDACAO-E-ENTREGA.md)** descreve em detalhe:

- Processamento inicial (sanitização, ambiguidade, termos sensíveis)
- Interpretação pela IA (intenção, telas, campos, regras, assumptions)
- O que o usuário vê (preview, estrutura, regras inferidas, assumptions)
- Validação pelo usuário (editar, confirmar/rejeitar assumptions – *IA não é soberana*)
- Geração versionada (v1, v2, v3) e opções de saída (ZIP, repo, Jira, template)
- Fluxo de iteração, enterprise, QA/UAT
- Personas (PO, Dev, QA, Gestor) e diferencial do produto

Inclui também um **mapeamento** do que já existe no sistema atual versus essa visão, para guiar a evolução do produto.

---

*Documento criado para alinhar visão e roadmap do sistema de geração de front-end padronizado. Atualizar conforme decisões do time.*
