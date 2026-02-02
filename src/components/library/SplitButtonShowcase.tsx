import React from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Save, SaveAll, FileDown, Printer, Share2, Mail, Download, Plus } from "lucide-react";

export function SplitButtonShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Split Button Básico"
        description="Botão com ação principal e menu de opções"
        category="Botões"
        code={`import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Save, SaveAll, FileDown } from "lucide-react";

<div className="inline-flex rounded-md shadow-sm">
  <Button className="rounded-r-none">
    <Save className="mr-2 h-4 w-4" />
    Salvar
  </Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="rounded-l-none border-l border-primary-foreground/20 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <SaveAll className="mr-2 h-4 w-4" />
        Salvar Tudo
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FileDown className="mr-2 h-4 w-4" />
        Salvar Como...
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`}
      >
        <div className="inline-flex rounded-md shadow-sm">
          <Button className="rounded-r-none">
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-l-none border-l border-primary-foreground/20 px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <SaveAll className="mr-2 h-4 w-4" />
                Salvar Tudo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                Salvar Como...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Split Button - Variantes"
        description="Diferentes estilos de split buttons"
        category="Botões"
        code={`// Primary
<div className="inline-flex rounded-md shadow-sm">
  <Button className="rounded-r-none">Ação Principal</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="rounded-l-none border-l border-primary-foreground/20 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">...</DropdownMenuContent>
  </DropdownMenu>
</div>

// Secondary
<div className="inline-flex rounded-md shadow-sm">
  <Button variant="secondary" className="rounded-r-none">Ação Secundária</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" className="rounded-l-none border-l border-secondary-foreground/20 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">...</DropdownMenuContent>
  </DropdownMenu>
</div>

// Outline
<div className="inline-flex rounded-md shadow-sm">
  <Button variant="outline" className="rounded-r-none">Outline</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="rounded-l-none border-l-0 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">...</DropdownMenuContent>
  </DropdownMenu>
</div>`}
      >
        <div className="flex flex-wrap gap-4">
          {/* Primary */}
          <div className="inline-flex rounded-md shadow-sm">
            <Button className="rounded-r-none">Primário</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-l-none border-l border-primary-foreground/20 px-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Opção 1</DropdownMenuItem>
                <DropdownMenuItem>Opção 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Secondary */}
          <div className="inline-flex rounded-md shadow-sm">
            <Button variant="secondary" className="rounded-r-none">Secundário</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-l-none border-l border-secondary-foreground/20 px-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Opção 1</DropdownMenuItem>
                <DropdownMenuItem>Opção 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Outline */}
          <div className="inline-flex rounded-md shadow-sm">
            <Button variant="outline" className="rounded-r-none">Outline</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-l-none border-l-0 px-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Opção 1</DropdownMenuItem>
                <DropdownMenuItem>Opção 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Split Button - Compartilhar"
        description="Exemplo de uso para compartilhamento"
        category="Botões"
        code={`import { Share2, Mail, Download, Printer } from "lucide-react";

<div className="inline-flex rounded-md shadow-sm">
  <Button variant="outline" className="rounded-r-none">
    <Share2 className="mr-2 h-4 w-4" />
    Compartilhar
  </Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="rounded-l-none border-l-0 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Mail className="mr-2 h-4 w-4" />
        Enviar por Email
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Download className="mr-2 h-4 w-4" />
        Baixar PDF
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`}
      >
        <div className="inline-flex rounded-md shadow-sm">
          <Button variant="outline" className="rounded-r-none">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-l-none border-l-0 px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Enviar por Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Split Button - Criar Novo"
        description="Exemplo para criação de diferentes tipos de itens"
        category="Botões"
        code={`import { Plus, FileText, FolderPlus, UserPlus } from "lucide-react";

<div className="inline-flex rounded-md shadow-sm">
  <Button className="rounded-r-none bg-success hover:bg-success/90">
    <Plus className="mr-2 h-4 w-4" />
    Novo
  </Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="rounded-l-none border-l border-success-foreground/20 px-2 bg-success hover:bg-success/90">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <FileText className="mr-2 h-4 w-4" />
        Novo Documento
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FolderPlus className="mr-2 h-4 w-4" />
        Nova Pasta
      </DropdownMenuItem>
      <DropdownMenuItem>
        <UserPlus className="mr-2 h-4 w-4" />
        Novo Usuário
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`}
      >
        <div className="inline-flex rounded-md shadow-sm">
          <Button className="rounded-r-none bg-success hover:bg-success/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-l-none border-l border-success-foreground/20 px-2 bg-success hover:bg-success/90">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Save className="mr-2 h-4 w-4" />
                Novo Documento
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Nova Pasta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ComponentCard>
    </div>
  );
}
