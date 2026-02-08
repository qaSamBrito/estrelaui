import { describe, it, expect } from "vitest";
import { buildSpecFromPrompt, detectEntity } from "./generatorSpec";

describe("gerador de telas - buildSpecFromPrompt e detectEntity", () => {
  describe("detectEntity", () => {
    it("extrai entidade de prompt CRUD de X", () => {
      const r = detectEntity("CRUD de Produtos");
      expect(r.entity).toBe("Produtos");
      expect(r.lower).toBe("crud de produtos");
    });

    it("extrai entidade de prompt com história de usuário", () => {
      const r = detectEntity("Como usuário quero cadastrar clientes");
      expect(r.entity).toBe("Clientes");
    });

    it("extrai entidade de tarefas em história com 'minhas tarefas'", () => {
      const r = detectEntity("como admin quero gerenciar minhas tarefas diarias para que eu não perca os prazos de entrega");
      expect(r.entity).toBe("Tarefas Diarias");
    });

    it("retorna Itens quando não reconhece", () => {
      const r = detectEntity("Qualquer texto genérico");
      expect(r.entity).toBe("Itens");
    });
  });

  describe("buildSpecFromPrompt - tipo login", () => {
    it("gera spec de login para prompt com 'login'", () => {
      const spec = buildSpecFromPrompt("Tela de login para acesso ao sistema", "react");
      expect(spec.type).toBe("login");
      expect(spec.title).toBe("Acesso ao Sistema");
      expect(spec.entity).toBe("Acesso");
      expect(spec.fields).toHaveLength(2);
      expect(spec.fields.map((f) => f.id)).toEqual(["email", "password"]);
      expect(spec.listColumns).toEqual([]);
      expect(spec.stack).toBe("react");
      expect(spec.prompt).toBe("Tela de login para acesso ao sistema");
    });

    it("gera spec de login para prompt com 'entrar'", () => {
      const spec = buildSpecFromPrompt("Página para entrar com usuário e senha", "vue");
      expect(spec.type).toBe("login");
      expect(spec.stack).toBe("vue");
    });
  });

  describe("buildSpecFromPrompt - tipo CRUD", () => {
    it("gera spec CRUD para CRUD de Produtos com campos de produto", () => {
      const spec = buildSpecFromPrompt("CRUD de produtos", "react");
      expect(spec.type).toBe("crud");
      expect(spec.entity).toBe("Produtos");
      expect(spec.title).toBe("CRUD de Produtos");
      expect(spec.fields.length).toBeGreaterThan(0);
      expect(spec.fields.some((f) => f.id === "sku")).toBe(true);
      expect(spec.listColumns).toEqual(spec.fields.map((f) => f.label));
      expect(spec.stack).toBe("react");
    });

    it("gera spec CRUD para CRUD de usuários com campos de usuario", () => {
      const spec = buildSpecFromPrompt("CRUD de usuario", "bootstrap");
      expect(spec.type).toBe("crud");
      expect(spec.entity).toBe("Usuario");
      expect(spec.fields.some((f) => f.id === "email")).toBe(true);
      expect(spec.stack).toBe("bootstrap");
    });

    it("usa defaultFields quando entidade não está no entityFieldMap", () => {
      const spec = buildSpecFromPrompt("CRUD de coisa inexistente", "react");
      expect(spec.type).toBe("crud");
      expect(spec.entity).toBe("Coisa Inexistente");
      expect(spec.fields).toHaveLength(3);
      expect(spec.fields.map((f) => f.id)).toEqual(["name", "description", "status"]);
      expect(spec.fields.find((f) => f.id === "status")?.type).toBe("select");
      expect(spec.fields.find((f) => f.id === "status")?.options).toEqual(["Ativo", "Inativo"]);
    });

    it("gera spec de tarefas com titulo, prazo, status e prioridade para história de gerenciar tarefas", () => {
      const spec = buildSpecFromPrompt(
        "como admin quero gerenciar minhas tarefas diarias para que eu não perca os prazos de entrega",
        "react"
      );
      expect(spec.type).toBe("crud");
      expect(spec.entity).toBe("Tarefas Diarias");
      expect(spec.fields.some((f) => f.id === "titulo")).toBe(true);
      expect(spec.fields.some((f) => f.id === "prazo" && f.type === "date")).toBe(true);
      expect(spec.fields.some((f) => f.id === "status")).toBe(true);
      expect(spec.fields.some((f) => f.id === "prioridade")).toBe(true);
      expect(spec.listColumns).toContain("Prazo");
      expect(spec.listColumns).toContain("Status");
      expect(spec.listColumns).toContain("Prioridade");
      expect(spec.fields.find((f) => f.id === "status")?.type).toBe("select");
      expect(spec.fields.find((f) => f.id === "prioridade")?.options).toContain("Média");
    });
  });

  describe("buildSpecFromPrompt - tipo generic", () => {
    it("gera spec genérica para prompt sem CRUD nem login", () => {
      const spec = buildSpecFromPrompt("Uma tela qualquer de relatório", "react");
      expect(spec.type).toBe("generic");
      expect(spec.title).toBe("Tela Gerada");
      expect(spec.entity).toBe("Itens");
      expect(spec.fields).toHaveLength(3);
      expect(spec.listColumns).toEqual(["Nome", "Descrição", "Status"]);
    });
  });

  describe("buildSpecFromPrompt - stack e prompt preservados", () => {
    it("preserva stack e prompt em todos os tipos", () => {
      const prompt = "CRUD de categorias";
      const spec = buildSpecFromPrompt(prompt, "vue");
      expect(spec.stack).toBe("vue");
      expect(spec.prompt).toBe(prompt);
    });
  });
});
