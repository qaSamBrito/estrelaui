import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GeradorInicial from "./GeradorInicial";

describe("GeradorInicial - página inicial do gerador", () => {
  it("renderiza título e link para nova geração", () => {
    render(
      <MemoryRouter>
        <GeradorInicial />
      </MemoryRouter>
    );
    expect(screen.getByTestId("gerador-inicial-title")).toHaveTextContent("Sistema IA de Geração de Telas Front-End Inteligentes");
    const novaLink = screen.getByRole("link", { name: /Começar/i });
    expect(novaLink).toHaveAttribute("href", "/gerador/nova");
  });

  it("exibe link para Meus protótipos", () => {
    render(
      <MemoryRouter>
        <GeradorInicial />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /Ver protótipos/i });
    expect(link).toHaveAttribute("href", "/meus-prototipos");
  });
});
