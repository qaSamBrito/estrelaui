import React from "react";
import { Badge } from "@/components/ui/badge";
import { ComponentCard } from "./ComponentCard";
import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["badge"];

export function BadgeShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Badges Padrão"
        description="Indicadores de status e categorias"
        category="Indicadores"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Badge>Padrão</Badge>
        <Badge variant="secondary">Secundário</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destrutivo</Badge>
      </ComponentCard>

      <ComponentCard
        title="Badges de Status"
        description="Indicadores coloridos para diferentes estados"
        category="Indicadores"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Badge className="bg-success hover:bg-success/80">Aprovado</Badge>
        <Badge className="bg-warning hover:bg-warning/80 text-warning-foreground">Pendente</Badge>
        <Badge className="bg-destructive hover:bg-destructive/80">Reprovado</Badge>
        <Badge className="bg-info hover:bg-info/80">Em Análise</Badge>
      </ComponentCard>

      <ComponentCard
        title="Badges com Ponto"
        description="Indicadores com ponto de status"
        category="Indicadores"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Badge variant="outline" className="gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" />
          Online
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          Offline
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" />
          Ausente
        </Badge>
      </ComponentCard>

      <ComponentCard
        title="Badges Numéricos"
        description="Para contadores e notificações"
        category="Indicadores"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Badge className="rounded-full px-2 min-w-[20px] h-5">3</Badge>
        <Badge className="rounded-full px-2 min-w-[20px] h-5" variant="destructive">99+</Badge>
        <Badge className="rounded-full px-2 min-w-[20px] h-5" variant="secondary">12</Badge>
      </ComponentCard>
    </div>
  );
}