import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const colors = [
  { name: "Primary", variable: "--primary", class: "bg-primary", textClass: "text-primary-foreground", description: "Azul institucional #0B3C5D" },
  { name: "Secondary", variable: "--secondary", class: "bg-secondary", textClass: "text-secondary-foreground", description: "Cinza escuro #1D2731" },
  { name: "Accent", variable: "--accent", class: "bg-accent", textClass: "text-accent-foreground", description: "Azul claro #328CC1" },
  { name: "Background", variable: "--background", class: "bg-background", textClass: "text-foreground", description: "Fundo da aplicação", bordered: true },
  { name: "Foreground", variable: "--foreground", class: "bg-foreground", textClass: "text-background", description: "Cor do texto" },
  { name: "Muted", variable: "--muted", class: "bg-muted", textClass: "text-muted-foreground", description: "Elementos secundários" },
  { name: "Card", variable: "--card", class: "bg-card", textClass: "text-card-foreground", description: "Fundo de cards", bordered: true },
];

const semanticColors = [
  { name: "Success", variable: "--success", class: "bg-success", textClass: "text-success-foreground", description: "Ações bem-sucedidas" },
  { name: "Warning", variable: "--warning", class: "bg-warning", textClass: "text-warning-foreground", description: "Alertas e avisos" },
  { name: "Destructive", variable: "--destructive", class: "bg-destructive", textClass: "text-destructive-foreground", description: "Erros e ações destrutivas" },
  { name: "Info", variable: "--info", class: "bg-info", textClass: "text-info-foreground", description: "Informações gerais" },
];

export function ColorsShowcase() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = async (variable: string) => {
    await navigator.clipboard.writeText(`hsl(var(${variable}))`);
    setCopiedColor(variable);
    toast({
      title: "Copiado!",
      description: `Variável ${variable} copiada.`,
    });
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Cores Principais"
        description="Paleta institucional baseada no padrão NORTE"
        category="Design System"
        code={`/* Cores definidas em src/index.css */
:root {
  --primary: 204 80% 21%;      /* Azul institucional */
  --secondary: 210 25% 15%;    /* Cinza escuro */
  --accent: 202 59% 48%;       /* Azul claro */
  --background: 210 20% 98%;   /* Fundo */
  --foreground: 210 29% 13%;   /* Texto */
  --muted: 210 20% 96%;        /* Elementos secundários */
}

/* Uso em componentes */
<div className="bg-primary text-primary-foreground">
  Elemento primário
</div>

/* Uso direto com HSL */
style={{ color: "hsl(var(--primary))" }}`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {colors.map((color) => (
            <button
              key={color.variable}
              onClick={() => handleCopy(color.variable)}
              className={`group relative p-4 rounded-lg ${color.class} ${color.textClass} ${color.bordered ? 'border' : ''} transition-all hover:scale-105 cursor-pointer`}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedColor === color.variable ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </div>
              <span className="font-medium block">{color.name}</span>
              <span className="text-xs opacity-75 block mt-1">{color.variable}</span>
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Cores Semânticas"
        description="Cores com significado contextual para feedback"
        category="Design System"
        code={`/* Cores semânticas */
:root {
  --success: 142 71% 45%;     /* Verde - Sucesso */
  --warning: 45 93% 47%;      /* Amarelo - Aviso */
  --destructive: 0 72% 51%;   /* Vermelho - Erro */
  --info: 202 59% 48%;        /* Azul - Informação */
}

/* Exemplo de uso */
<Alert className="border-success bg-success/10">
  <CheckCircle className="h-4 w-4 text-success" />
  <AlertTitle className="text-success">Sucesso!</AlertTitle>
</Alert>`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {semanticColors.map((color) => (
            <button
              key={color.variable}
              onClick={() => handleCopy(color.variable)}
              className={`group relative p-4 rounded-lg ${color.class} ${color.textClass} transition-all hover:scale-105 cursor-pointer`}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedColor === color.variable ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </div>
              <span className="font-medium block">{color.name}</span>
              <span className="text-xs opacity-75 block">{color.description}</span>
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Gradientes"
        description="Gradientes pré-definidos do sistema"
        category="Design System"
        code={`/* Gradientes definidos em index.css e tailwind.config.ts */
:root {
  --gradient-corporate: linear-gradient(135deg, hsl(204 80% 21%), hsl(202 59% 48%));
  --gradient-section: linear-gradient(to right, hsl(204 80% 21% / 0.1), hsl(202 59% 48% / 0.05));
  --gradient-header: linear-gradient(90deg, hsl(204 80% 21%), hsl(202 59% 48%));
}

/* Uso com Tailwind */
<div className="bg-gradient-corporate">
  Header com gradiente
</div>`}
      >
        <div className="space-y-4 w-full">
          <div className="h-16 rounded-lg bg-gradient-corporate flex items-center justify-center">
            <span className="text-white font-medium">gradient-corporate</span>
          </div>
          <div className="h-16 rounded-lg bg-gradient-header flex items-center justify-center">
            <span className="text-white font-medium">gradient-header</span>
          </div>
          <div className="h-16 rounded-lg bg-gradient-section border flex items-center justify-center">
            <span className="text-foreground font-medium">gradient-section</span>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Sombras"
        description="Sombras padronizadas do sistema"
        category="Design System"
        code={`/* Sombras definidas em index.css e tailwind.config.ts */
:root {
  --shadow-form: 0 4px 6px -1px hsl(204 80% 21% / 0.1);
  --shadow-section: 0 1px 3px 0 hsl(204 80% 21% / 0.1);
  --shadow-card: 0 10px 15px -3px hsl(204 80% 21% / 0.1);
  --shadow-elevated: 0 20px 25px -5px hsl(204 80% 21% / 0.1);
}

/* Uso com Tailwind */
<Card className="shadow-card">...</Card>
<div className="shadow-elevated">...</div>`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="h-20 rounded-lg bg-card shadow-section flex items-center justify-center border">
            <span className="text-sm text-muted-foreground">shadow-section</span>
          </div>
          <div className="h-20 rounded-lg bg-card shadow-form flex items-center justify-center">
            <span className="text-sm text-muted-foreground">shadow-form</span>
          </div>
          <div className="h-20 rounded-lg bg-card shadow-card flex items-center justify-center">
            <span className="text-sm text-muted-foreground">shadow-card</span>
          </div>
          <div className="h-20 rounded-lg bg-card shadow-elevated flex items-center justify-center">
            <span className="text-sm text-muted-foreground">shadow-elevated</span>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}