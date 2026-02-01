import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ComponentCard } from "./ComponentCard";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlertShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Alerta de Sucesso"
        description="Feedback positivo para ações concluídas"
        category="Feedback"
        code={`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

<Alert className="border-success bg-success/10">
  <CheckCircle className="h-4 w-4 text-success" />
  <AlertTitle className="text-success">Sucesso!</AlertTitle>
  <AlertDescription>
    Operação realizada com sucesso.
  </AlertDescription>
</Alert>`}
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
        code={`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erro</AlertTitle>
  <AlertDescription>
    Não foi possível completar a operação. Tente novamente.
  </AlertDescription>
</Alert>`}
      >
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível completar a operação. Tente novamente.
          </AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard
        title="Alerta de Aviso"
        description="Alertas para situações que requerem atenção"
        category="Feedback"
        code={`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

<Alert className="border-warning bg-warning/10">
  <AlertTriangle className="h-4 w-4 text-warning" />
  <AlertTitle className="text-warning-foreground">Atenção</AlertTitle>
  <AlertDescription>
    Esta ação não pode ser desfeita.
  </AlertDescription>
</Alert>`}
      >
        <Alert className="border-warning bg-warning/10 w-full max-w-md">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Esta ação não pode ser desfeita.
          </AlertDescription>
        </Alert>
      </ComponentCard>

      <ComponentCard
        title="Alerta Informativo"
        description="Informações gerais e dicas"
        category="Feedback"
        code={`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

<Alert className="border-info bg-info/10">
  <Info className="h-4 w-4 text-info" />
  <AlertTitle className="text-info">Informação</AlertTitle>
  <AlertDescription>
    Você pode personalizar estas configurações a qualquer momento.
  </AlertDescription>
</Alert>`}
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
        code={`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

<Alert className="relative">
  <Info className="h-4 w-4" />
  <AlertTitle>Nova atualização disponível</AlertTitle>
  <AlertDescription className="flex items-center justify-between">
    <span>Versão 2.0 está disponível para instalação.</span>
    <Button size="sm" className="ml-4">Atualizar</Button>
  </AlertDescription>
  <Button 
    variant="ghost" 
    size="icon" 
    className="absolute right-2 top-2 h-6 w-6"
  >
    <X className="h-4 w-4" />
  </Button>
</Alert>`}
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