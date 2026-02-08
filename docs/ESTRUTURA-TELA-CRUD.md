# Estrutura de tela CRUD (referência)

Referência de **layout** para telas geradas (formulário + listagem). O gerador e o preview devem seguir esta estrutura, independente da entidade (usuários, itens, etc.).

---

## 1. Layout geral

- **Container:** largura máxima centralizada (ex.: `max-w-5xl` / `max-w-3xl`), padding horizontal e vertical.
- **Header:** título principal (ex.: "Gerenciamento de [Entidade]") e, se houver, subtítulo.
- **Conteúdo:** em **grid responsivo**:
  - **Desktop (lg):** 2 blocos — formulário (1 coluna) + listagem (2 colunas), ou listagem em tela cheia quando o formulário está em outra view (novo/editar).
  - **Mobile:** 1 coluna; formulário acima, listagem abaixo (ou navegação por view: listar | novo | editar).

---

## 2. Bloco formulário (Novo / Editar)

- **Card** com título dinâmico: "Novo [Entidade]" ou "Editar [Entidade]" e subtítulo (ex.: "Preencha os campos e salve.").
- **Campos:** em grid 2 colunas no desktop quando fizer sentido; campos que ocupam linha inteira (select, switch, radio, checkbox) podem usar `col-span-2` ou ficar ao lado de outro (ex.: Perfil | Ativo na mesma linha).
- **Botões:** alinhados à **direita** do formulário:
  - Novo: Cancelar, Salvar.
  - Editar: Cancelar, Atualizar, Excluir (Excluir com estilo destrutivo).

---

## 3. Bloco listagem

- **Barra superior:** campo de **busca** (com ícone à esquerda quando no padrão EstrelaUI) + botão **"Novo cadastro"**.
- **Tabela/card:** título da lista (ex.: nome da entidade), subtítulo (ex.: "Lista de registros").
- **Colunas:** definidas pela spec (ex.: Nome, E-mail, Função); última coluna **Ações** (ícones Editar e Excluir, alinhados à direita).
- **Estado vazio:** mensagem centralizada (ex.: "Nenhum registro encontrado.").

---

## 4. Fluxo de views

- **Listar** → botão "Novo cadastro" → **Novo** (formulário); submissão volta para Listar.
- **Listar** → ação Editar → **Editar** (formulário com dados); Atualizar/Cancelar volta para Listar; Excluir (com confirmação) remove e volta para Listar.
- Mensagens de feedback (sucesso/erro) via **toast** no padrão EstrelaUI (variantes success, destructive, etc.).

---

## 5. Resumo visual (esqueleto)

```
┌─────────────────────────────────────────────────────────┐
│  Título principal (e subtítulo)                         │
├─────────────────────────────────────────────────────────┤
│  [Formulário - Card]        │  [Busca...] [Novo cadastro]│
│  Novo X / Editar X         │  ┌───────────────────────┐ │
│  Campo 1    │  Campo 2     │  │ Tabela: colunas +     │ │
│  Campo 3    │  Campo 4     │  │ Ações (ícones)        │ │
│  [Cancelar] [Salvar]       │  └───────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

Em modo **só listagem** (sem formulário lateral), o formulário aparece em view separada (Novo/Editar) no mesmo container, substituindo a listagem temporariamente.

---

*Referência para o gerador de front e preview (EstrelaUI/NORTE).*
