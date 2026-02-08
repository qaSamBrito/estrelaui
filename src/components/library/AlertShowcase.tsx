import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ComponentCard } from "./ComponentCard";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["alert"];

export function AlertShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Alerta de Sucesso"
        description="Feedback positivo para ações concluídas"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Alert className="border-success bg-success/10 w-full max-w-md">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Sucesso!</AlertTitle>
          <AlertDescription>
            Operação realizada com sucesso.
          </AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard
        title="Alerta de Erro"
        description="Feedback para erros e problemas"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Alert className="border-destructive bg-destructive/10 w-full max-w-md">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">Erro</AlertTitle>
          <AlertDescription>
            Não foi possível completar a operação. Tente novamente.
          </AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard
        title="Alerta de Aviso"
        description="Alertas para situações que requerem atenção"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Alert className="border-warning bg-warning/10 w-full max-w-md">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">Atenção</AlertTitle>
          <AlertDescription>
            Esta ação não pode ser desfeita.
          </AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard
        title="Alerta Informativo"
        description="Informações gerais e dicas"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Alert className="border-info bg-info/10 w-full max-w-md">
          <Info className="h-4 w-4 text-info" />
          <AlertTitle className="text-info">Informação</AlertTitle>
          <AlertDescription>
            Você pode personalizar estas configurações a qualquer momento.
          </AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard
        title="Alerta com Ação"
        description="Alertas com botões de ação"
        category="Feedback"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Alert className="relative w-full max-w-md">
          <Info className="h-4 w-4" />
          <AlertTitle>Nova atualização disponível</AlertTitle>
          <AlertDescription className="flex items-center justify-between mt-2">
            <span>Versão 2.0 está disponível.</span>
            <Button size="sm" className="ml-4">Atualizar</Button>
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      </ComponentCard>
    </div>
  );
}