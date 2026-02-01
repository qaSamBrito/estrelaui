import React from "react";
import { Button } from "@/components/ui/button";
import { ComponentCard } from "./ComponentCard";
import { Save, X, Trash2, Download, Plus, Send, Settings, ChevronRight } from "lucide-react";

export function ButtonShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Botões Primários"
        description="Ação principal destacada - use para ações mais importantes"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

// Botão primário padrão
<Button>Salvar</Button>

// Com ícone
<Button><Save className="mr-2 h-4 w-4" /> Salvar</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>`}
      >
        <Button><Save className="mr-2 h-4 w-4" /> Salvar</Button>
        <Button size="sm">Pequeno</Button>
        <Button size="lg">Grande</Button>
      </ComponentCard>

      <ComponentCard
        title="Botões Secundários"
        description="Para ações secundárias ou menos importantes"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Botão secundário
<Button variant="secondary">Cancelar</Button>

// Com ícone
<Button variant="secondary">
  <X className="mr-2 h-4 w-4" /> Cancelar
</Button>

// Outline
<Button variant="outline">Voltar</Button>`}
      >
        <Button variant="secondary"><X className="mr-2 h-4 w-4" /> Cancelar</Button>
        <Button variant="outline">Voltar</Button>
        <Button variant="ghost">Ghost</Button>
      </ComponentCard>

      <ComponentCard
        title="Botões Destrutivos"
        description="Para ações que requerem confirmação (excluir, remover)"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Botão destrutivo
<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" /> Excluir
</Button>

// IMPORTANTE: Ações destrutivas devem exigir confirmação
// Use com AlertDialog para confirmar a ação`}
      >
        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</Button>
      </ComponentCard>

      <ComponentCard
        title="Botões com Ícone"
        description="Apenas ícone para ações compactas"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { Plus, Settings, Download } from "lucide-react";

// Botão apenas ícone
<Button size="icon"><Plus className="h-4 w-4" /></Button>
<Button size="icon" variant="outline"><Settings className="h-4 w-4" /></Button>
<Button size="icon" variant="secondary"><Download className="h-4 w-4" /></Button>`}
      >
        <Button size="icon"><Plus className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline"><Settings className="h-4 w-4" /></Button>
        <Button size="icon" variant="secondary"><Download className="h-4 w-4" /></Button>
      </ComponentCard>

      <ComponentCard
        title="Estados dos Botões"
        description="Estados de loading e disabled"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Botão desabilitado
<Button disabled>Desabilitado</Button>

// Botão em loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processando...
</Button>`}
      >
        <Button disabled>Desabilitado</Button>
        <Button disabled>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processando...
        </Button>
      </ComponentCard>

      <ComponentCard
        title="Link como Botão"
        description="Estilo de link para navegação"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

<Button variant="link">
  Saiba mais <ChevronRight className="ml-1 h-4 w-4" />
</Button>`}
      >
        <Button variant="link">
          Saiba mais <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </ComponentCard>
    </div>
  );
}