import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Link, Mail, Code, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyToClipboardShowcase() {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Botão de Copiar"
        description="Botão simples para copiar texto com feedback visual"
        category="Utilitários"
        code={`import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const [copied, setCopied] = useState(false);

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

<Button
  variant="outline"
  size="sm"
  onClick={() => copyToClipboard("Texto para copiar")}
>
  {copied ? (
    <>
      <Check className="h-4 w-4 mr-2" />
      Copiado!
    </>
  ) : (
    <>
      <Copy className="h-4 w-4 mr-2" />
      Copiar
    </>
  )}
</Button>`}
      >
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard("Texto copiado com sucesso!", "btn1")}
          >
            {copiedStates["btn1"] ? (
              <>
                <Check className="h-4 w-4 mr-2 text-success" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => copyToClipboard("Outro texto para copiar", "btn2")}
          >
            {copiedStates["btn2"] ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Código
              </>
            )}
          </Button>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Input com Copiar"
        description="Campo de texto com botão de copiar integrado"
        category="Utilitários"
        code={`import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const [copied, setCopied] = useState(false);
const value = "https://estrelaui.lovable.app";

<div className="flex w-full max-w-md">
  <Input
    value={value}
    readOnly
    className="rounded-r-none"
  />
  <Button
    variant="outline"
    className="rounded-l-none border-l-0"
    onClick={() => copyToClipboard(value)}
  >
    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
  </Button>
</div>`}
      >
        <div className="flex w-full max-w-md">
          <Input
            value="https://estrelaui.lovable.app"
            readOnly
            className="rounded-r-none"
          />
          <Button
            variant="outline"
            className="rounded-l-none border-l-0"
            onClick={() => copyToClipboard("https://estrelaui.lovable.app", "input1")}
          >
            {copiedStates["input1"] ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Código com Copiar"
        description="Bloco de código com botão de copiar no canto"
        category="Utilitários"
        code={`import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const code = \`npm install @radix-ui/react-toast\`;

<div className="relative bg-muted rounded-lg p-4 pr-12">
  <code className="text-sm">{code}</code>
  <Button
    variant="ghost"
    size="icon"
    className="absolute top-2 right-2 h-8 w-8"
    onClick={() => copyToClipboard(code)}
  >
    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
  </Button>
</div>`}
      >
        <div className="w-full max-w-md">
          <div className="relative bg-muted rounded-lg p-4 pr-12">
            <code className="text-sm font-mono">npm install @radix-ui/react-toast</code>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => copyToClipboard("npm install @radix-ui/react-toast", "code1")}
            >
              {copiedStates["code1"] ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Lista de Links Copiáveis"
        description="Lista de itens com ação de copiar individual"
        category="Utilitários"
        code={`const items = [
  { icon: Link, label: "Link do Projeto", value: "https://projeto.com" },
  { icon: Mail, label: "Email de Contato", value: "contato@empresa.com" },
  { icon: Code, label: "Código de Convite", value: "ESTRELA2024" },
];

<div className="space-y-2 w-full max-w-md">
  {items.map((item) => (
    <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <item.icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{item.label}</p>
          <p className="text-xs text-muted-foreground">{item.value}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.value)}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  ))}
</div>`}
      >
        <div className="space-y-2 w-full max-w-md">
          {[
            { icon: Link, label: "Link do Projeto", value: "https://projeto.com", id: "link" },
            { icon: Mail, label: "Email de Contato", value: "contato@empresa.com", id: "email" },
            { icon: Code, label: "Código de Convite", value: "ESTRELA2024", id: "code" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(item.value, item.id)}>
                  {copiedStates[item.id] ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            );
          })}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Ícone Compacto"
        description="Apenas o ícone de copiar com tooltip"
        category="Utilitários"
        code={`import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const [copied, setCopied] = useState(false);

<button
  onClick={() => copyToClipboard("texto")}
  className={cn(
    "p-1 rounded hover:bg-muted transition-colors",
    copied && "text-success"
  )}
  title={copied ? "Copiado!" : "Copiar"}
>
  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
</button>`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">ABC123XYZ</span>
            <button
              onClick={() => copyToClipboard("ABC123XYZ", "compact1")}
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                copiedStates["compact1"] && "text-success"
              )}
              title={copiedStates["compact1"] ? "Copiado!" : "Copiar"}
            >
              {copiedStates["compact1"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">contato@email.com</span>
            <button
              onClick={() => copyToClipboard("contato@email.com", "compact2")}
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                copiedStates["compact2"] && "text-success"
              )}
              title={copiedStates["compact2"] ? "Copiado!" : "Copiar"}
            >
              {copiedStates["compact2"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
