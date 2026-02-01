import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComponentCard } from "./ComponentCard";
import { Search, Mail, Lock, User, Calendar, Phone } from "lucide-react";

export function InputShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Input Básico"
        description="Campos de entrada com rótulos sempre visíveis"
        category="Formulários"
        code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="nome">Nome *</Label>
  <Input id="nome" placeholder="Digite seu nome" />
</div>

// Campo obrigatório com asterisco (*)
// Rótulos sempre visíveis acima do campo`}
      >
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" placeholder="Digite seu nome" />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Input com Ícone"
        description="Campos com ícones para melhor identificação"
        category="Formulários"
        code={`import { Input } from "@/components/ui/input";
import { Search, Mail } from "lucide-react";

// Com ícone à esquerda
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" placeholder="Pesquisar..." />
</div>

// Email com ícone
<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" type="email" placeholder="email@exemplo.com" />
</div>`}
      >
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Pesquisar..." />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" type="email" placeholder="email@exemplo.com" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Tipos de Input"
        description="Diferentes tipos de campos de entrada"
        category="Formulários"
        code={`import { Input } from "@/components/ui/input";

// Senha
<Input type="password" placeholder="Senha" />

// Data
<Input type="date" />

// Telefone
<Input type="tel" placeholder="(00) 00000-0000" />

// Número
<Input type="number" placeholder="0" />`}
      >
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" type="password" placeholder="Senha" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" type="date" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" type="tel" placeholder="(00) 00000-0000" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Estados de Input"
        description="Estados de erro e desabilitado"
        category="Formulários"
        code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Campo com erro
<div className="space-y-2">
  <Label htmlFor="email" className="text-destructive">Email *</Label>
  <Input 
    id="email" 
    className="border-destructive focus-visible:ring-destructive" 
    placeholder="Email inválido"
  />
  <p className="text-sm text-destructive">
    Por favor, insira um email válido
  </p>
</div>

// Campo desabilitado
<Input disabled placeholder="Campo desabilitado" />`}
      >
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-error" className="text-destructive">Email *</Label>
            <Input 
              id="email-error" 
              className="border-destructive focus-visible:ring-destructive" 
              defaultValue="email-invalido"
            />
            <p className="text-sm text-destructive">
              Por favor, insira um email válido
            </p>
          </div>
          <Input disabled placeholder="Campo desabilitado" />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Textarea"
        description="Campo de texto multilinha para descrições"
        category="Formulários"
        code={`import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="descricao">Descrição</Label>
  <Textarea 
    id="descricao" 
    placeholder="Digite a descrição..."
    rows={4}
  />
</div>`}
      >
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea 
            id="descricao" 
            placeholder="Digite a descrição..."
            rows={4}
          />
        </div>
      </ComponentCard>
    </div>
  );
}