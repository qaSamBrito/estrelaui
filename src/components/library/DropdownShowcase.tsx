import React from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, User, Settings, LogOut, 
  Eye, Edit, Trash2, Copy, Share2, Download,
  ChevronDown
} from "lucide-react";

export function DropdownShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Dropdown de Ações"
        description="Menu suspenso para ações em itens"
        category="Overlay"
        code={`import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>
      <Eye className="mr-2 h-4 w-4" />
      Visualizar
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Edit className="mr-2 h-4 w-4" />
      Editar
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Excluir
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Ações <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Ações disponíveis</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar para
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Pasta 1</DropdownMenuItem>
                  <DropdownMenuItem>Pasta 2</DropdownMenuItem>
                  <DropdownMenuItem>Pasta 3</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Dropdown com Checkboxes"
        description="Menu com opções de seleção múltipla"
        category="Overlay"
        code={`import {
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Colunas</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuCheckboxItem checked>
      Nome
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked>
      Email
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem>
      Telefone
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Nome
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Email
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Telefone
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Status
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentCard>
    </div>
  );
}