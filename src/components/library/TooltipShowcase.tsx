import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ComponentCard } from "./ComponentCard";
import { HelpCircle, Info, Settings, Copy } from "lucide-react";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["tooltip"];

export function TooltipShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Tooltip Básico"
        description="Dicas de contexto ao passar o mouse"
        category="Overlay"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Passe o mouse</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Texto de ajuda aqui</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clique para obter ajuda</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ComponentCard>

      <ComponentCard
        title="Tooltip com Posições"
        description="Diferentes posições de exibição"
        category="Overlay"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Topo</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Tooltip no topo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Direita</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Tooltip à direita</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Baixo</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Tooltip embaixo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Esquerda</Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Tooltip à esquerda</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ComponentCard>

      <ComponentCard
        title="Tooltip em Ícones"
        description="Ideal para botões de ação com ícone"
        category="Overlay"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copiar</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mais informações</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ComponentCard>
    </div>
  );
}