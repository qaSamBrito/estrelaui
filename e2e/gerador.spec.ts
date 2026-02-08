import { test, expect } from "@playwright/test";

test.describe("Gerador de Telas - fluxo completo", () => {
  test("página inicial do gerador exibe título e link Nova geração", async ({ page }) => {
    await page.goto("/gerador", { waitUntil: "load" });
    await expect(page.getByTestId("gerador-inicial-title")).toBeVisible({ timeout: 20000 });
    const linkNova = page.getByRole("link", { name: /Começar/i });
    await expect(linkNova).toBeVisible();
    await expect(linkNova).toHaveAttribute("href", "/gerador/nova");
  });

  test("abre Nova geração e exibe área de entrada e botão Gerar tela", async ({ page }) => {
    await page.goto("/gerador/nova", { waitUntil: "load" });
    await expect(page.getByTestId("gerador-form-heading")).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId("prompt-input")).toBeVisible();
    await expect(page.getByTestId("gerar-tela-btn")).toBeVisible();
  });

  test("validação: Gerar sem prompt não abre modal de sucesso", async ({ page }) => {
    await page.goto("/gerador/nova");
    await expect(page.getByTestId("gerar-tela-btn")).toBeDisabled();
    await expect(page.getByRole("dialog", { name: /Tela gerada com sucesso/i })).not.toBeVisible();
  });

  test("fluxo feliz: preencher prompt, gerar, ver modal de sucesso e passo 2", async ({ page }) => {
    await page.goto("/gerador/nova");
    await page.getByTestId("prompt-input").fill("CRUD de produtos com filtro por status");
    await page.getByTestId("gerar-tela-btn").click();

    const dialog = page.getByRole("dialog", { name: /Tela gerada com sucesso/i });
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByText(/Ajuste título|especificação/i)).toBeVisible();

    await dialog.getByRole("button", { name: /Entendi/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByText(/Preview interativo|Passo 2/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ajustar especificação" })).toBeVisible({ timeout: 5000 });
  });

  test("passo 2 exibe preview e painel Ajustar especificação após gerar", async ({ page }) => {
    await page.goto("/gerador/nova");
    await page.getByTestId("prompt-input").fill("CRUD de clientes");
    await page.getByTestId("gerar-tela-btn").click();
    await expect(page.getByRole("dialog", { name: /Tela gerada com sucesso/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /Entendi/i }).click();

    await expect(page.getByRole("tab", { name: "2. Ajustar preview" })).toBeVisible();
    await expect(page.locator("#prototype-preview")).toBeVisible({ timeout: 5000 });
  });

  test("navegação: Voltar para listagem exibe lista de telas geradas", async ({ page }) => {
    await page.goto("/gerador/nova");
    await page.getByTestId("voltar-listagem-btn").click();
    await expect(page.getByRole("heading", { name: "Telas geradas" })).toBeVisible({ timeout: 5000 });
  });

  test("Stack Angular disponível no select do passo 1", async ({ page }) => {
    await page.goto("/gerador/nova");
    await page.getByRole("button", { name: /Opções avançadas/i }).click();
    await page.getByLabel(/Stack/i).click();
    await expect(page.getByRole("option", { name: "Angular" })).toBeVisible();
  });

  test("Angular: gerar tela e Baixar ZIP aciona download sem erro", async ({ page }) => {
    await page.goto("/gerador/nova");
    await page.getByRole("button", { name: /Opções avançadas/i }).click();
    await page.getByLabel(/Stack/i).click();
    await page.getByRole("option", { name: "Angular" }).click();
    await page.getByTestId("prompt-input").fill("CRUD de produtos");
    await page.getByTestId("gerar-tela-btn").click();
    await expect(page.getByRole("dialog", { name: /Tela gerada com sucesso/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /Entendi/i }).click();
    await expect(page.locator("#prototype-preview")).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Concluir tela" }).click();
    await page.getByRole("button", { name: "Concluir" }).click();
    await page.getByRole("tab", { name: /3\. Entregáveis/i }).click({ timeout: 10000 });
    await page.getByRole("tab", { name: "Código base" }).click();
    const downloadPromise = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
    await page.getByTestId("baixar-zip-btn").click();
    const download = await downloadPromise;
    expect(download).not.toBeNull();
  });
});
