# Relatório de testes – Funcionalidade “Gerar tela”

**Data:** 03/02/2026  
**Escopo:** Fluxo completo do Gerador de Telas (Nova geração, interpretação de prompt, preview e validações).

---

## Resumo

| Resultado | Quantidade |
|-----------|------------|
| **Testes passando** | 17 |
| **Testes falhando** | 0 |
| **Arquivos de teste** | 3 |

**Comando para rodar:** `npm run test`

---

## O que foi testado

### 1. Lógica de especificação (`src/lib/generatorSpec.test.ts`)

- **detectEntity**
  - Extrai entidade de “CRUD de X” (ex.: “CRUD de Produtos” → “Produtos”).
  - Extrai entidade de história de usuário (ex.: “Como usuário quero cadastrar clientes” → “Clientes”).
  - Retorna “Itens” quando o texto não é reconhecido.

- **buildSpecFromPrompt – tipo login**
  - Prompts com “login” ou “entrar” geram spec `type: "login"`, título “Acesso ao Sistema”, campos email/senha e `listColumns` vazio.

- **buildSpecFromPrompt – tipo CRUD**
  - “CRUD de produtos” gera spec CRUD com entidade “Produtos” e campos de produto (ex.: SKU).
  - “CRUD de usuario” gera spec CRUD com entidade “Usuario” e campos de usuário (ex.: email).
  - Entidades não mapeadas usam `defaultFields` (Nome, Descricao, Status).

- **buildSpecFromPrompt – tipo generic**
  - Texto sem CRUD nem login gera spec genérica (Tela Gerada, Itens, listColumns padrão).

- **Stack e prompt**
  - `stack` e `prompt` são preservados em todos os tipos de spec.

### 2. Página Generator – Nova geração (`src/pages/Generator.test.tsx`)

- A página **renderiza** na rota `/gerador/nova` sem erros.
- **Textarea** de prompt e **botão “Gerar tela”** estão presentes.
- **Validação:** ao clicar em “Gerar tela” sem preencher o prompt, o modal de sucesso **não** aparece (fluxo não avança).
- **Fluxo feliz:** ao preencher o prompt (ex.: “CRUD de produtos”) e clicar em “Gerar tela”, o **modal “Tela gerada com sucesso”** aparece (avanço para o passo 2).

### 3. Página inicial do gerador (`src/pages/GeradorInicial.test.tsx`)

- Exibe o título “Gerador de Telas”.
- Link “Começar” aponta para `/gerador/nova`.
- Link “Ver protótipos” aponta para `/meus-prototipos`.

---

## Alterações feitas no código (para testes)

1. **Módulo `src/lib/generatorSpec.ts`**
   - Lógica de `buildSpecFromPrompt` e `detectEntity` (e tipos/campos relacionados) extraída de `Generator.tsx` para um módulo testável.
   - `Generator.tsx` passou a importar `buildSpecFromPrompt`, `Field` e `ScreenSpec` desse módulo.

2. **Vitest + React Testing Library**
   - Configuração em `vite.config.ts` (ambiente `jsdom`, `setupFiles` em `src/test/setup.ts`).
   - Scripts em `package.json`: `npm run test` (run) e `npm run test:watch` (watch).

3. **Mocks nos testes do Generator**
   - `jszip`, `file-saver`, `jspdf`, `html2canvas` e `@/lib/audit` mockados para evitar side-effects e dependências pesadas nos testes.

---

## Como rodar os testes

```bash
npm run test        # execução única
npm run test:watch  # modo watch (re-executa ao salvar)
```

---

## Conclusão

A funcionalidade de **gerar tela** foi coberta por **17 testes automatizados**, todos passando:

- **Lógica de negócio:** interpretação de prompt (CRUD, login, genérico), detecção de entidade e preservação de stack/prompt.
- **UI do Generator:** renderização em `/gerador/nova`, presença de prompt e botão, validação sem prompt e fluxo de geração com sucesso.
- **Entrada do fluxo:** página inicial do gerador com links para Nova geração e Meus protótipos.

Nenhum teste falhou. O relatório está registrado em `docs/RELATORIO-TESTES-GERADOR.md`.
