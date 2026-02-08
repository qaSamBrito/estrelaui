import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { Check, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["stepper"];

export function StepperShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verticalStep, setVerticalStep] = useState(2);

  const steps = [
    { id: 1, title: "Dados Pessoais", description: "Nome, email e telefone" },
    { id: 2, title: "Endereço", description: "Endereço de entrega" },
    { id: 3, title: "Pagamento", description: "Forma de pagamento" },
    { id: 4, title: "Confirmação", description: "Revise seu pedido" },
  ];

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Stepper Horizontal"
        description="Indicador de progresso para formulários multi-etapas"
        category="Progresso"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors",
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={cn(
                    "mt-2 text-xs text-center",
                    currentStep >= step.id ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-0.5 flex-1 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-8 justify-center">
            <Button variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
              Anterior
            </Button>
            <Button onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))} disabled={currentStep === steps.length}>
              Próximo
            </Button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Stepper Vertical"
        description="Stepper em layout vertical com descrições"
        category="Progresso"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 shrink-0",
                  verticalStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : verticalStep === step.id
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}>
                  {verticalStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-12 mt-2",
                    verticalStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                  )} />
                )}
              </div>
              <div className="pb-8">
                <h4 className={cn(
                  "font-medium",
                  verticalStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Stepper Compacto"
        description="Versão minimalista do stepper"
        category="Progresso"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  index < 2 ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Etapa 2 de 4
          </p>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Stepper com Ícones"
        description="Stepper usando ícones personalizados para cada etapa"
        category="Progresso"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center justify-between w-full max-w-lg">
          {[
            { id: 1, title: "Perfil" },
            { id: 2, title: "Endereço" },
            { id: 3, title: "Pagamento" },
            { id: 4, title: "Concluído" },
          ].map((step, index, arr) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center border-2",
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <span className="mt-2 text-xs">{step.title}</span>
              </div>
              {index < arr.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-2",
                  currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                )} />
              )}
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}
