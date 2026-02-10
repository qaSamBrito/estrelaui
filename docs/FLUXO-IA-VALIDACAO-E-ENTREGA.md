# Fluxo IA, Validação e Entrega – Visão do Produto

**Objetivo:** Definir o fluxo completo desde o texto do usuário até a entrega versionada, com IA interpretável e usuário no centro da validação.  
**Princípio:** A IA não é soberana; o usuário valida.

---

## 1. Processamento inicial do pedido

O sistema executa:

- **Sanitização do texto** – normalização e limpeza do input
- **Verificação de ambiguidade** – análise de clareza do pedido
- **Checagem de termos sensíveis** – políticas e restrições (quando aplicável)

### Possíveis resultados

| Resultado | Comportamento |
|-----------|----------------|
| **Pedido claro** | Segue para interpretação e geração |
| **Pedido ambíguo** | IA pede confirmação ao usuário |
| **Pedido inválido** | Feedback claro ao usuário (mensagem, sugestão de ajuste) |

**Exemplo de pergunta da IA (quando ambíguo):**  
*“Essa tela permite edição ou apenas consulta?”*

---

## 2. Interpretação pela IA

A IA:

- **Interpreta intenção** – entende o que o usuário quer (tela, fluxo, entidade)
- **Identifica telas, campos e ações** – extrai estrutura (lista, formulário, botões)
- **Infere regras básicas** – obrigatoriedade, tipos, validações
- **Registra suposições explicitamente** – assumptions documentadas e visíveis

---

## 3. O que o usuário vê (antes de confirmar)

- **Preview da interface** – como a tela ficará
- **Estrutura da tela (componentes)** – blocos, campos, ações
- **Regras inferidas** – ex.: “Campo X obrigatório”, “Lista com colunas A, B, C”
- **Assumptions feitas pela IA** – ex.: “Assumido que a tela permite edição”

Objetivo: o usuário ter o momento *“ah, era isso que eu queria”* (ou não).

---

## 4. Validação pelo usuário

O usuário pode:

- Editar textos (títulos, labels, placeholders)
- Remover ou adicionar campos
- Ajustar obrigatoriedade
- Alterar labels
- **Confirmar ou rejeitar assumptions** da IA

**Importante:** A IA não é soberana; o usuário valida.

---

## 5. Após confirmação – Geração e versionamento

O sistema gera:

- **Protótipo navegável** (link)
- **Código frontend** (stack escolhida)
- **Metadados técnicos** (JSON)
- **Versão da geração** (v1, v2, v3…)

Tudo versionado para comparação e rollback.

---

## 6. Opções de saída

- **Download ZIP** – projeto completo para uso local
- **Exportar para repositório** – push para Git (quando integrado)
- **Criar história no Jira** – ticket com descrição e critérios (quando integrado)
- **Salvar como template reutilizável** – base para novas gerações

Aqui o produto entra no fluxo real do time.

---

## 7. Fluxo de iteração

Se o resultado não atende:

1. Editar prompt (ou ajustar campos/regras na UI)
2. Regerar
3. Comparar versões (v1 vs v2 vs v3)
4. Escolher a melhor

---

## 8. Fluxo enterprise

- **Logs de quem gerou** – rastreabilidade por usuário
- **Auditoria de alterações** – histórico de mudanças
- **Templates corporativos** – bases aprovadas pela empresa
- **Prompt base travado por empresa** – política de prompt único ou restrito

---

## 9. Fluxo para QA / UAT

- **QA revisa regras inferidas** – valida se as assumptions batem com o requisito
- **Exporta critérios de aceitação** – a partir das regras e da estrutura gerada
- **Usa UI gerada como base de teste** – reduz gap entre requisito e teste

---

## 10. Personas e como usam o fluxo

| Persona | Como usa o fluxo |
|---------|-------------------|
| **Product Owner** | Escreve a ideia → Gera UI → Valida antes de ir para dev |
| **Dev** | Recebe código base → Ajusta lógica → Ganha tempo |
| **QA** | Usa UI e regras para testes → Cria cenários mais cedo |
| **Gestor** | Acompanha produtividade → Visualiza evolução da ideia até entrega |

---

## 11. Onde está o diferencial do produto

- **Tradução de linguagem humana → sistema** – do texto ao código e à UI
- **Redução de retrabalho** – validação antes de gerar código final
- **Menos dependência de mockups manuais** – protótipo gerado e editável
- **Integração com ferramentas reais** – ZIP, repositório, Jira (conforme evolução)
- **IA explicável** – assumptions visíveis e editáveis pelo usuário

---

## 12. Mapeamento com o sistema atual (estrelaui)

| Conceito deste documento | Status no sistema atual |
|---------------------------|-------------------------|
| Sanitização / ambiguidade / termos sensíveis | Parcial – validação de prompt vazio; sem checagem de ambiguidade nem termos sensíveis estruturada |
| IA interpreta e refina prompt | Sim – OpenAI ou URL customizada |
| IA pede confirmação quando ambígua | Não – hoje não há pergunta interativa da IA ao usuário |
| Preview da interface | Sim – preview com abas Lista, Grade, Cadastrar, Editar |
| Estrutura da tela (componentes) | Sim – spec com campos, colunas, título, entidade |
| Regras inferidas visíveis | Parcial – validações editáveis; sem bloco “regras inferidas” explícito |
| Assumptions da IA visíveis | Não – não há lista de assumptions exposta |
| Usuário edita textos, campos, obrigatoriedade | Sim – painel de edição por área (título, entidade, campo) |
| Confirmar/rejeitar assumptions | Não – não existe conceito de assumption confirmada/rejeitada |
| Protótipo navegável + código + ZIP | Sim – preview, código, download ZIP |
| Versionamento (v1, v2, v3) | Parcial – salvamento de protótipos; sem versões explícitas por geração |
| Download ZIP / Salvar template | Sim – ZIP; “Salvar como cópia” e protótipos salvos |
| Exportar para repo / Criar Jira | Não – não integrado |
| Comparar versões | Não – não há UI de diff entre versões |
| Logs / Auditoria | Sim – página de Auditoria com ações registradas |
| Templates corporativos / Prompt travado | Não |
| QA exporta critérios de aceitação | Parcial – documentação e spec; sem export dedicado para critérios de aceitação |

---

*Documento alinhado à visão do Gerador EstrelaUI/NORTE (UID00001-2026). Atualizar conforme o produto evoluir.*
