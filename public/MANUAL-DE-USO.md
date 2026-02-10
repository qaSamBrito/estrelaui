# Manual de Uso – Sistema Gerador EstrelaUI

**Versão:** 2.0  
**Padrão:** NORTE – UID00001-2026 (Usabilidade e Design de Interfaces)  
**Última atualização:** Fevereiro 2026

---

## 1. Introdução

O **Sistema Gerador EstrelaUI** é uma plataforma para gerar telas front-end padronizadas a partir de descrições em linguagem natural, histórias de usuário ou critérios de aceitação. Todo o código gerado segue o padrão EstrelaUI/NORTE, garantindo consistência visual e de usabilidade entre projetos.

### 1.1 Objetivo

- Permitir que **Desenvolvedores**, **Product Owners (PO)**, **QA** e **Stakeholders** criem telas completas sem escrever código manualmente
- Garantir que toda interface gerada use **apenas** componentes e padrões oficiais EstrelaUI/NORTE
- Oferecer protótipos funcionais para apresentação e código pronto para integração com backend

### 1.2 Perfis de usuário

| Perfil | Uso principal |
|--------|----------------|
| **Dev** | Gerar front pronto para integrar com backend (telas, serviços, tipos) |
| **QA** | Gerar telas padronizadas para testes e cenários |
| **PO** | Gerar protótipos funcionais (com mocks) para apresentação; salvar como base para o time de dev |

---

## 2. Acesso e navegação

### 2.1 Como acessar

1. Execute o sistema localmente: `npm run dev`
2. Abra o navegador em `http://localhost:5173` (ou a porta indicada no terminal)
3. A página inicial exibe a **Biblioteca de Componentes**

### 2.2 Navegação principal

O sistema possui dois contextos de navegação:

**Biblioteca (página inicial)**  
- URL: `/`  
- Acesso à Biblioteca de Componentes  
- Link para **Backoffice** no cabeçalho

**Backoffice (Gerador de Telas)**  
- URL base: `/gerador`  
- Menu lateral: Início, Nova geração, Meus protótipos, Componentes, Auditoria

### 2.3 Menu do Backoffice

| Item | Rota | Descrição |
|------|------|-----------|
| **Início** | `/gerador` | Tela inicial com cards de acesso rápido |
| **Nova geração** | `/gerador/nova` | Criar nova tela ou protótipo |
| **Meus protótipos** | `/meus-prototipos` | Listar, buscar e editar protótipos salvos |
| **Componentes** | `/componentes` | Sugerir novos componentes ou consultar catálogo |
| **Auditoria** | `/auditoria` | Histórico de ações do sistema |

### 2.4 Opções de interface

- **Tema (claro/escuro):** Toggle no cabeçalho  
- **Modo daltônico:** Toggle no cabeçalho do Backoffice

---

## 3. Biblioteca de Componentes

A Biblioteca é o catálogo oficial de componentes do EstrelaUI/NORTE.

### 3.1 Funcionalidades

- **Busca:** Digite no campo de pesquisa para filtrar componentes por nome
- **Filtro por categoria:** Botões para Design System, Botões, Formulários, Navegação, etc.
- **Visualização:** Cada componente mostra preview visual e pode ser expandido/recolhido
- **Código por stack:** Selecione React, Vue ou Bootstrap para ver o exemplo de código correspondente
- **Como usar:** Ícone de ajuda (?) abre popover com descrição e orientações

### 3.2 Exportação

- **.MD:** Baixa documentação em Markdown
- **ZIP:** Baixa componentes em arquivo ZIP
- **Ver exemplo:** Link para formulário de exemplo
- **Backoffice:** Acesso ao Gerador de Telas

### 3.3 Link direto para componente

A partir da tela de **Componentes**, o link **Ver na biblioteca** leva diretamente à seção do componente na Biblioteca, com a categoria correta e rolagem até o item.

---

## 4. Gerador de Telas

O Gerador cria telas completas a partir de uma descrição em texto.

### 4.1 Fluxo em etapas

O fluxo possui **3 passos**:

1. **Descrever** – Informe o que deseja gerar
2. **Ajustar preview** – Revise e edite campos, colunas e validações
3. **Entregáveis** – Baixe spec, código e protótipo

### 4.2 Passo 1: Descrever

1. No campo **"O que você quer gerar?"**, digite a descrição em linguagem natural  
   - Ex.: "CRUD de Produtos com nome, preço e categoria"
2. Clique em **Gerar tela**
3. O sistema interpreta o texto e cria a especificação (campos, colunas, etc.)

**Opções avançadas** (Collapsible):

- **Stack:** React, Vue, Bootstrap ou Angular
- **Tema visual:** NORTE (padrão) ou Minimal
- **Modo protótipo:** Ativar para PO (salvamento automático, mocks)
- **Usar IA:** Ativa refinamento do prompt via API (OpenAI ou URL customizada)
- **Tags:** Formato `#tag` para organização (ex.: `#sprint1`, `#crud-produtos`)

### 4.3 Passo 2: Ajustar preview

Após a geração:

- **Preview:** Visualize as abas Lista, Grade, Cadastrar e Editar
- **Editar área:** Clique em título, entidade ou campo para ajustar
- **Validações:** Configure obrigatório, regex e mensagem de erro
- **Campos:** Reordene (▲▼), edite ou remova

**Ações disponíveis:**

- **Salvar rascunho** – Salva sem concluir
- **Salvar protótipo** – Conclui e registra em Meus Protótipos
- **Salvar como cópia** – Cria nova versão com nome no formato `copia - [nome]` (disponível em edição)

### 4.4 Passo 3: Entregáveis

- **Preview:** Visualização em tempo real
- **Código:** Exibido após gerar; abas por stack (React, Vue, Bootstrap, Angular)
- **Baixar ZIP:** Projeto completo (React, Vue, Bootstrap ou Angular)
- **Download PDF:** Exporta o protótipo em PDF
- **Download HTML (ZIP):** Protótipo HTML estático zipado

### 4.5 Carregar e editar protótipo

- Em **Meus Protótipos**, clique em **Carregar e editar**
- O Gerador abre com a spec carregada, **Preview** ativo e rolagem até a área de preview

### 4.6 Modo PO (Protótipo)

- Ative **Modo protótipo** nas opções avançadas
- Salvamento é mais frequente (auto-salvamento em rascunho)
- Telas geradas podem usar dados mock para demonstração

---

## 5. Meus Protótipos

Gerencia protótipos e telas geradas salvas.

### 5.1 Listagem

- **Busca:** Campo de pesquisa livre (nome, entidade, tags, status)
- **Agrupamento:** Opcional por tag (`#sprint1`, `#geral`, etc.)
- **Cards:** Mostram nome, status (rascunho/final), tags e data de atualização

### 5.2 Ações por protótipo

- **Preview** / **Ver no navegador** – Abre o preview em nova aba
- **Carregar e editar** – Abre no Gerador para edição
- **Excluir** – Remove o protótipo (com confirmação)

### 5.3 Tags

- Formato: `#tag` (ex.: `#sistema`, `#versao1`, `#crud`)
- Sugestões automáticas ao digitar
- Tags obrigatórias no modo protótipo

---

## 6. Componentes

Combina catálogo oficial e sugestões de novos componentes.

### 6.1 Visualização

- **Filtro por categoria:** Botões, Navegação, Formulários, etc.
- **Lista paginada:** Componentes do repositório e sugestões
- **Origem:** Badge indica "Repositório" ou "Sugestão"
- **Ver na biblioteca:** Link direto para o componente na Biblioteca (com categoria e seção)

### 6.2 Novo componente

1. Clique em **Novo componente**
2. Preencha: Nome, Categoria, Descrição, Caso de uso
3. Clique em **Salvar** ou **Cancelar**
4. Mensagem de confirmação com data/hora (ex.: "Rascunho salvo, 07/02/2026 às 23:24")

### 6.3 Sugestões (QA/PO)

- **Aprovar** – Muda status para aprovado
- **Recusar** – Solicita motivo; status passa a recusado

---

## 7. Auditoria

Registro de ações do sistema para rastreabilidade.

### 7.1 O que é registrado

- Telas criadas, editadas, excluídas e concluídas
- Sugestões de componentes criadas, editadas, aprovadas e recusadas

### 7.2 Filtros

- **Pesquisar:** Texto livre em ação, contexto ou detalhes
- **Ação:** Tipo de operação (Todas, Tela criada, Tela editada, etc.)
- **ID da entidade:** ID do protótipo ou sugestão afetada

### 7.3 Paginação

- 15 registros por página
- Navegação entre páginas na parte inferior da tabela

### 7.4 Colunas da tabela

| Coluna | Descrição |
|--------|-----------|
| Data/Hora | Momento da ação |
| Ação | Tipo de operação |
| Entidade | Nome do protótipo ou componente |
| ID | Identificador da entidade |
| Detalhes | Informações adicionais (JSON) |

---

## 8. Stacks e temas

### 8.1 Stacks suportadas

| Stack | Descrição |
|-------|-----------|
| **React** | Projeto React com TypeScript, Tailwind e padrão NORTE |
| **Vue** | Projeto Vue 3 com Composition API |
| **Bootstrap** | HTML + Bootstrap CDN |
| **Angular** | Projeto Angular 17+ standalone |

### 8.2 Temas visuais

| Tema | Descrição |
|------|-----------|
| **NORTE** | Padrão EstrelaUI (cores primary, secondary, etc.) |
| **Minimal** | Visual minimalista (fontes system-ui, cores neutras) |

---

## 9. Boas práticas

### 9.1 Descrições para geração

- Seja específico: "CRUD de Produtos com nome, preço, categoria e data de validade"
- Inclua tipos quando importante: "campo email com validação", "select de status"
- Use histórico de usuário quando ajudar: "Como usuário, quero cadastrar clientes com nome, CPF e telefone"

### 9.2 Tags

- Use tags consistentes: `#sprint1`, `#modulo-vendas`, `#versao-piloto`
- Facilita busca e agrupamento em Meus Protótipos

### 9.3 Modo protótipo

- Ideal para PO apresentar fluxos a stakeholders
- Salvar como "final" quando o protótipo estiver aprovado
- Dev pode usar "Carregar e editar" para completar com integração de backend

### 9.4 Sugestões de componentes

- Descreva bem o caso de uso
- Indique categoria correta para facilitar aprovação
- QA/PO devem revisar e aprovar ou recusar com feedback claro

---

## 10. Solução de problemas

### 10.1 A geração não retorna resultado

- Verifique se a descrição está clara
- Tente dividir em partes menores
- Confira se há erros no console do navegador

### 10.2 Preview não carrega

- Atualize a página
- Verifique se a spec foi gerada corretamente (Passo 1)

### 10.3 Dados não persistem

- Protótipos são salvos em `localStorage`
- Limpar dados do navegador apaga os protótipos
- Para backup, use **Baixar ZIP** ou **Download PDF**

### 10.4 Tema ou modo daltônico não aplicam

- Tema é aplicado na interface do sistema, não necessariamente no código gerado
- O código exportado pode incluir suporte a tema conforme a stack escolhida

---

## 11. Atalhos e acessibilidade

- **Skip link:** "Pular para o conteúdo" no início da Biblioteca
- **Navegação por teclado:** Todos os controles são acessíveis
- **ARIA labels:** Uso de `aria-label`, `role` e `aria-describedby` em formulários e botões
- **data-testid:** Elementos com identificadores para testes automatizados

---

## 12. Contato e suporte

Para dúvidas sobre o padrão NORTE ou o Sistema Gerador, consulte:

- Documento de visão: `docs/VISAO-SISTEMA-GERADOR-FRONT.md`
- Repositório: [estrelaui](https://github.com/qaSamBrito/estrelaui)
- Padrão UID00001-2026 – Usabilidade e Design de Interfaces

---

*Manual elaborado para o Sistema Gerador EstrelaUI. Atualize conforme novas funcionalidades forem incorporadas.*
