# Como adicionar uma nova stack ao Gerador

Este documento descreve os passos para incluir uma nova stack (ex.: Angular, Svelte) ou um novo tema visual no sistema de geração de telas.

---

## 1. Onde a stack é usada

- **Escolha na UI:** `src/pages/Generator.tsx` – select "Stack" no passo 1 (área de entrada).
- **Geração de spec:** `src/lib/generatorSpec.ts` – `buildSpecFromPrompt(prompt, stack)` já recebe e guarda `stack` na spec; não precisa alterar se a nova stack seguir o mesmo formato de entidade/campos.
- **Código gerado:** `src/pages/Generator.tsx` – funções que montam o código por stack:
  - **React:** `buildAppFile(spec)`, `buildAppFileWithApi(spec)`
  - **Vue:** `buildVueAppFile(spec)`
  - **Bootstrap/HTML:** `buildBootstrapHtmlFile(spec)`, `buildHtmlFile(spec)`
- **Download ZIP:** `generateReactProjectZip`, `generateVueProjectZip`, `generateBootstrapZip`, `generateHtmlZip` – cada uma monta a pasta do projeto e chama o builder correspondente.

---

## 2. Passos para uma nova stack (ex.: Angular)

### 2.1 Incluir a opção no select

Em `Generator.tsx`, no `<Select>` de Stack (por volta da linha 2514):

```tsx
<SelectItem value="angular">Angular</SelectItem>
```

Defina um valor único (`angular`) e o rótulo exibido ("Angular").

### 2.2 Criar a função de build do App

Crie uma função no mesmo arquivo (ou em um módulo separado), no estilo de `buildAppFile` / `buildVueAppFile`:

- Entrada: `spec: ScreenSpec` (já contém `type`, `title`, `subtitle`, `entity`, `fields`, `listColumns`, `stack`, `prompt`).
- Saída: string com o conteúdo do arquivo principal da aplicação (ex.: `app.component.ts` + template ou um único arquivo).

Use `spec.fields`, `spec.entity`, `spec.title` etc. para montar formulários, tabelas e listagens. Inclua **data-testid** e **aria-label** nos elementos interativos para manter testabilidade e a11y.

### 2.3 Criar a função de ZIP do projeto

Crie `generateAngularProjectZip(spec: ScreenSpec)`, no estilo de `generateReactProjectZip`:

- Crie uma pasta no ZIP (ex.: `estrelaui-angular-{slug}`).
- Inclua `package.json`, configuração do bundler (angular.json ou equivalente), e os arquivos gerados (componente, módulo, estilos).
- Chame o builder criado no passo 2.2 para obter o conteúdo do componente principal.
- Gere o ZIP e use `saveAs` (file-saver) para o download.

### 2.4 Encadear no fluxo de download

No bloco que trata o botão "Baixar ZIP" (por volta de 2205), adicione a condição para a nova stack:

```ts
if (stack === "angular") {
  await generateAngularProjectZip(spec);
} else if (stack === "vue") {
  ...
}
```

Assim, ao concluir a tela e baixar o ZIP, a stack "Angular" passará a gerar o projeto Angular.

---

## 3. Passos para um novo tema visual

Se a stack for a mesma (ex.: React), mas você quiser um **tema** diferente (ex.: cores, tipografia):

- **Tokens de estilo:** o código gerado em `buildAppFile` e em `buildAppFileWithApi` usa classes CSS (ex.: `app-shell`, `card`, `primary-btn`). O ZIP já inclui um bloco de CSS (ex.: `PROTOTYPE_CSS` ou arquivo de estilos).
- Crie uma variante de tema: por exemplo, um objeto `THEMES = { norte: PROTOTYPE_CSS, minimal: MINIMAL_CSS }` e escolha com base em `spec.theme` ou em um novo campo (ex.: "Tema" no passo 1).
- Na UI do Gerador, adicione um select "Tema" (opcional) e guarde o valor na spec ou no estado; ao gerar o ZIP, use o CSS do tema escolhido.

Assim você mantém a mesma estrutura de componentes e só altera o tema (cores, espaçamentos, etc.).

---

## 4. Checklist

- [ ] Nova opção no select de Stack (ou de Tema) em `Generator.tsx`
- [ ] Função de build do arquivo principal da aplicação (ex.: `buildAngularAppFile(spec)`)
- [ ] Inclusão de `data-testid` e `aria-label` no código gerado
- [ ] Função `generateXxxProjectZip(spec)` que monta o projeto completo
- [ ] Tratamento no fluxo de download (if stack === "xxx") para chamar o novo gerador
- [ ] Teste manual: gerar uma tela na nova stack, baixar o ZIP e rodar o projeto localmente

---

*Documento alinhado ao EstrelaUI Gerador e ao padrão NORTE (UID00001-2026).*
