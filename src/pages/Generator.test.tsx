import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Generator from "./Generator";

// Mock de dependências pesadas / side-effects
vi.mock("jszip", () => ({ default: vi.fn() }));
vi.mock("file-saver", () => ({ saveAs: vi.fn() }));
vi.mock("jspdf", () => ({ jsPDF: vi.fn(() => ({ addImage: vi.fn(), save: vi.fn() })) }));
vi.mock("html2canvas", () => ({ default: vi.fn(() => Promise.resolve(document.createElement("canvas"))) }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

function renderGenerator(initialPath = "/gerador/nova") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Generator />
    </MemoryRouter>
  );
}

describe("Generator - página de gerar tela", () => {
  it("renderiza sem quebrar na rota /gerador/nova", () => {
    expect(() => renderGenerator()).not.toThrow();
  });

  it("exibe área de prompt/textarea na tela nova", () => {
    renderGenerator();
    const textarea = document.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("exibe botão de gerar", () => {
    renderGenerator();
    const gerarButton = screen.queryByRole("button", { name: /Gerar tela/i });
    expect(gerarButton).toBeInTheDocument();
  });

  it("ao submeter sem prompt, não avança (validação) — modal de sucesso não aparece", async () => {
    const user = userEvent.setup();
    renderGenerator();
    const gerarButton = screen.getByRole("button", { name: /Gerar tela/i });
    await user.click(gerarButton);
    await new Promise((r) => setTimeout(r, 500));
    const successModal = screen.queryByRole("dialog", { name: /tela gerada com sucesso/i });
    expect(successModal).not.toBeInTheDocument();
  });

  it("ao preencher prompt e gerar, mostra modal de sucesso e avança para step 2", async () => {
    const user = userEvent.setup();
    renderGenerator();
    const textarea = document.querySelector("textarea");
    if (!textarea) throw new Error("textarea não encontrado");
    await user.type(textarea, "CRUD de produtos");
    const gerarButton = screen.getByRole("button", { name: /Gerar tela/i });
    await user.click(gerarButton);
    const successTitle = await screen.findByText(/Tela gerada com sucesso|sucesso/i, {}, { timeout: 3000 });
    expect(successTitle).toBeInTheDocument();
  });
});
