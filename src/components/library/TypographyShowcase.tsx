import React from "react";
import { ComponentCard } from "./ComponentCard";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["typography"];

export function TypographyShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Títulos"
        description="Hierarquia visual de headings"
        category="Tipografia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 text-left w-full">
          <h1 className="text-3xl font-bold text-primary tracking-tight">Título Principal (H1)</h1>
          <h2 className="text-2xl font-semibold text-secondary tracking-tight">Título de Seção (H2)</h2>
          <h3 className="text-xl font-semibold text-accent tracking-tight">Subtítulo (H3)</h3>
          <h4 className="text-lg font-medium text-primary">Título de Item (H4)</h4>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Texto Base"
        description="Estilos de texto para conteúdo"
        category="Tipografia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-3 text-left w-full">
          <p className="text-foreground">Texto padrão do sistema.</p>
          <p className="text-muted-foreground">Texto secundário ou de suporte.</p>
          <p className="text-sm text-muted-foreground">Texto pequeno para legendas e informações adicionais.</p>
          <p className="font-medium text-foreground">Texto em destaque com maior peso.</p>
          <p>
            <a href="#" className="text-primary hover:underline">Link de navegação</a>
          </p>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Cores de Texto"
        description="Cores semânticas para diferentes contextos"
        category="Tipografia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="grid grid-cols-2 gap-3 w-full">
          <p className="text-foreground">Texto padrão (foreground)</p>
          <p className="text-primary font-medium">Texto primário (primary)</p>
          <p className="text-accent">Texto accent</p>
          <p className="text-muted-foreground">Texto muted</p>
          <p className="text-success">Texto de sucesso</p>
          <p className="text-warning">Texto de aviso</p>
          <p className="text-destructive">Texto de erro</p>
          <p className="text-info">Texto informativo</p>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Listas"
        description="Formatação de listas"
        category="Tipografia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <div>
            <p className="font-medium mb-2">Lista não ordenada</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Clareza acima de estética</li>
              <li>Consistência entre telas</li>
              <li>Feedback imediato</li>
              <li>Prevenção de erros</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Lista ordenada</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Primeiro passo</li>
              <li>Segundo passo</li>
              <li>Terceiro passo</li>
              <li>Quarto passo</li>
            </ol>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Blocos de Texto"
        description="Estilos especiais para destaque"
        category="Tipografia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full">
          <div className="example-block">
            <strong>Exemplo:</strong><br />
            Botões com a mesma função devem manter mesma cor, texto e posição em todo o sistema.
          </div>
          <div className="meta-block">
            <strong>CÓDIGO:</strong> UID00001-2026<br />
            <strong>VERSÃO:</strong> 1.0<br />
            <strong>RESPONSÁVEL:</strong> Gerência de Desenvolvimento
          </div>
          <p>
            Use <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">className</code> para aplicar estilos.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}