import React from "react";
import { ComponentCard } from "./ComponentCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["avatar"];

export function AvatarShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Avatar Básico"
        description="Representação visual de usuários"
        category="Display"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">MR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-accent text-accent-foreground">AB</AvatarFallback>
          </Avatar>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Tamanhos de Avatar"
        description="Diferentes tamanhos para contextos variados"
        category="Display"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-end gap-4">
          <div className="text-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">JS</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground block mt-1">SM</span>
          </div>
          <div className="text-center">
            <Avatar className="h-10 w-10">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground block mt-1">MD</span>
          </div>
          <div className="text-center">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">JS</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground block mt-1">LG</span>
          </div>
          <div className="text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">JS</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground block mt-1">XL</span>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Grupo de Avatares"
        description="Stack de avatares para representar grupos"
        category="Display"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-background">
            <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback className="bg-accent text-accent-foreground">B</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback className="bg-secondary text-secondary-foreground">C</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">+5</AvatarFallback>
          </Avatar>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Avatar com Status"
        description="Indicador de status online/offline"
        category="Display"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar>
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-background" />
          </div>
          <div className="relative">
            <Avatar>
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-warning border-2 border-background" />
          </div>
          <div className="relative">
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-destructive border-2 border-background" />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}