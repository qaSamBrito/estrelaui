import React from "react";
import { ComponentCard } from "./ComponentCard";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["loaders"];

export function LoaderShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Spinners"
        description="Indicadores de carregamento giratórios"
        category="Loading"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <span className="text-xs text-muted-foreground">Pequeno</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <span className="text-xs text-muted-foreground">Médio</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <span className="text-xs text-muted-foreground">Grande</span>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Dots Loading"
        description="Animação de pontos pulsantes"
        category="Loading"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            </div>
            <span className="text-xs text-muted-foreground">Pequeno</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="h-3 w-3 rounded-full bg-primary animate-bounce" />
            </div>
            <span className="text-xs text-muted-foreground">Grande</span>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Pulse Loading"
        description="Animação de pulso para placeholders"
        category="Loading"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex gap-8 w-full max-w-lg">
          <div className="flex-1 space-y-4 p-4 border rounded-lg">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Splash Screen"
        description="Tela de carregamento completa"
        category="Loading"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-xs p-8 border rounded-lg bg-background flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-corporate flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-lg font-bold text-primary">NORTE</h1>
            <p className="text-xs text-muted-foreground">Carregando...</p>
          </div>
          <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Skeleton Table"
        description="Placeholder para carregamento de tabela"
        category="Loading"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <div className="bg-muted p-3 flex gap-4">
            <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-20 bg-muted-foreground/20 rounded" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 flex gap-4 border-t">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Overlay Loading"
        description="Loading com overlay sobre o conteúdo"
        category="Loading"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="relative w-full max-w-xs">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold">Conteúdo do Card</h3>
            <p className="text-sm text-muted-foreground">Descrição do conteúdo aqui.</p>
          </div>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
