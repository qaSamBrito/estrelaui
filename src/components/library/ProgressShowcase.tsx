import React from "react";
import { Progress } from "@/components/ui/progress";
import { ComponentCard } from "./ComponentCard";
import { Skeleton } from "@/components/ui/skeleton";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["progress"];

export function ProgressShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Barra de Progresso"
        description="Indicador de progresso para operações longas"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Iniciando...</span>
              <span>10%</span>
            </div>
            <Progress value={10} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Em andamento</span>
              <span>45%</span>
            </div>
            <Progress value={45} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quase lá!</span>
              <span>78%</span>
            </div>
            <Progress value={78} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-success">Concluído!</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="[&>div]:bg-success" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Skeleton Loading"
        description="Placeholder para conteúdo em carregamento"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Card skeleton */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          
          {/* Text skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
          
          {/* Table skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Spinner de Loading"
        description="Indicador de carregamento circular"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Pequeno</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Médio</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Grande</span>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}