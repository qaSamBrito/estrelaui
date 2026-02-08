# Revisão das Telas do Sistema - Ajustes EstrelaUI

Com base nos prints dos componentes EstrelaUI fornecidos, segue a análise das telas e pontos que precisam de ajuste.

---

## 1. SIDEBAR / NAVEGAÇÃO LATERAL

**Referência:** Sidebar NORTE com logo, itens de menu, Ajuda (cinza), Sair (vermelho), botão recolher/expandir.

### GeradorLayout (sidebar principal)
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| `GeradorLayout.tsx` | ⚠️ | **Logo NORTE:** Adicionar quadrado azul com "N" no topo da sidebar, como no padrão. Atualmente: apenas texto "EstrelaUI \| NORTE" no header. |
| `GeradorLayout.tsx` | ⚠️ | **Estrutura da sidebar:** A referência mostra sidebar com header (logo N), menu rolável, separador, Ajuda (cinza), Sair (vermelho), chevron para recolher. O GeradorLayout tem layout horizontal com header no topo - considerar adicionar ícone NORTE no aside. |
| `GeradorLayout.tsx` | ⚠️ | **Links de utilidade:** Adicionar "Ajuda" (cinza) e "Sair" (vermelho) no rodapé da sidebar, antes do botão de recolher. |
| `GeradorLayout.tsx` | ⚠️ | **Botão recolher/expandir:** Adicionar chevron (← ou →) no rodapé da sidebar para recolher/expandir. |
| `GeradorLayout.tsx` | ⚠️ | **Seção "Favoritos":** A referência tem grupo "Favoritos" expansível. Avaliar se o "Gerador de Telas" deve ter seção expansível similar. |

---

## 2. BOTÕES

**Referência:** Split buttons (Primário azul, Secundário cinza, Outline borda), Salvar com ícone + chevron, Novo (verde) com Plus + chevron, Cancelar (cinza com X), Voltar (escuro), Ghost (texto apenas).

### Meus Protótipos
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| `MeusPrototipos.tsx` linha 138-144 | ⚠️ | **Novo protótipo:** A referência mostra botão "Novo" verde com Plus e chevron (split button). Atualmente é botão simples. Considerar: Split button verde `bg-success` com dropdown (ex.: "Novo protótipo", "Gerar em lote"). |
| `MeusPrototipos.tsx` linha 312-323 | ✓ | **Carregar e editar / Excluir:** Carregar com outline e Excluir com text-destructive - alinhado ao padrão. |

### Gerador (Generator.tsx)
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| Botão Salvar | ⚠️ | **Salvar:** A referência mostra split button azul com ícone de disquete + chevron. O atual é dropdown separado. Considerar unificar como split button: ação principal "Salvar rascunho" + chevron com menu (Rascunho, Tela, Salvar como cópia). |
| Botão Próximo | ⚠️ | **Próximo:** Deve ser primário (azul) - verificar se está usando variant default. |
| Botão Cancelar | ⚠️ | **Cancelar:** Referência mostra Cancelar com ícone X e fundo cinza-azulado. Considerar adicionar ícone X e variant secondary. |
| Botão Ver preview | ✓ | **Ver preview no navegador:** variant outline - ok. |

### GeradorInicial
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| `GeradorInicial.tsx` linha 30 | ⚠️ | **Começar:** Dentro do Card "Nova geração" - ok como primário. |
| `GeradorInicial.tsx` linha 45, 59, 75 | ✓ | **Ver protótipos, Abrir, Abrir biblioteca:** variant outline - ok. |

### Componentes
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| Botões Cadastrar, Download, etc. | ⚠️ | Revisar uso de variantes (primary, secondary, outline) conforme padrão. |

---

## 3. TABELAS

**Referência:** Tema escuro, colunas ID/Nome/Cargo/Ações, ícones de ação: olho (visualizar) e lápis (editar) brancos, lixeira vermelha.

### TableShowcase (componente de referência)
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| `TableShowcase.tsx` | ✓ | Tabela com Ações já usa Eye, Edit, Trash2 com `text-destructive` para lixeira - correto. |

### Telas que usam tabelas
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| `Generator.tsx` (listagem) | ⚠️ | Verificar se ícones de ação (Preview, Editar, Excluir) seguem: Excluir em vermelho. |
| `Componentes.tsx` | ⚠️ | Verificar tabela de sugestões - ícones de ação. |
| `GeradorPreview.tsx` | ✓ | Table com Pencil e Trash2 - Trash2 com text-destructive. |

---

## 4. TIPOGRAFIA E CORES

**Referência:** foreground (branco em dark), primary (azul), muted (cinza), success (verde), error (vermelho), warning (amarelo/laranja).

### Verificações
| Local | Status | Ajuste necessário |
|-------|--------|-------------------|
| `index.css` | ✓ | Variáveis --primary, --success, --destructive, --muted definidas. |
| `button.tsx` | ⚠️ | **Falta variant success:** A referência tem botão "Novo" verde. O Button atual não tem variant `success`. Adicionar: `success: "bg-success text-success-foreground hover:bg-success/90"`. |

---

## 5. RESUMO POR TELA

### ComponentLibrary (/) 
- Layout próprio, sem GeradorLayout.
- Revisar header e botões de export (ZIP, Markdown).

### GeradorInicial (/gerador)
- Estrutura de Cards ok.
- Botões dentro dos cards: primário para "Começar", outline para secundários - ok.

### Generator (/gerador/nova)
- Título "Nova geração" - ok.
- **Botões de ação:** Ajustar para split button no Salvar; Cancelar com ícone X.
- Código, Preview, dropdown Salvar - estrutura ok, refinamentos visuais.

### MeusPrototipos (/meus-prototipos)
- **Novo protótipo:** Considerar split button verde (padrão "Novo").
- Cards e botões Carregar/Excluir - ok.

### Componentes (/componentes)
- Revisar botões de ação e tabela de listagem.

### Auditoria (/auditoria)
- Estrutura simples com Cards e filtros - revisar botões se houver.

### GeradorPreview (/gerador/preview)
- Layout de produto com header NORTE - ok.
- Table com ícones - Trash em destructive - ok.

### NotFound, ExampleForm, Index
- Revisar se utilizam componentes EstrelaUI corretamente.

---

## 6. PRIORIDADES SUGERIDAS

1. **Alta:** Adicionar variant `success` ao Button para botão "Novo" verde.
2. **Alta:** Botão "Novo protótipo" em MeusPrototipos como split button verde (ou manter simples mas com bg-success).
3. **Média:** GeradorLayout - adicionar logo NORTE (quadrado azul com N) na sidebar.
4. **Média:** GeradorLayout - adicionar Ajuda e Sair no rodapé da sidebar, botão recolher.
5. **Média:** Generator - botão Salvar como split button (ação principal + chevron).
6. **Média:** Generator - Cancelar com ícone X.
7. **Baixa:** Revisão geral de tabelas e ícones de ação em todas as telas.
