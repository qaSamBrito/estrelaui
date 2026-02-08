import React from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["header"];
import { 
  Menu, Bell, Search, User, LogOut, Settings, ChevronDown,
  HelpCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Header Principal"
        description="Cabeçalho fixo com identificação do sistema"
        category="Layout"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full">
          <header className="w-full border rounded-lg bg-background">
            <div className="flex h-14 items-center px-4">
              {/* Logo */}
              <div className="flex items-center gap-2 mr-4">
                <div className="h-8 w-8 rounded bg-gradient-corporate flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-semibold hidden sm:inline">NORTE</span>
              </div>
              
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10 h-9" placeholder="Pesquisar..." />
                </div>
              </div>
              
              {/* Actions */}
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
                </Button>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm">João Silva</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Perfil</DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Configurações</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Header Simples"
        description="Versão simplificada do cabeçalho"
        category="Layout"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full">
          <header className="border rounded-lg bg-background">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Título da Página</h1>
              </div>
              <Button size="sm">Nova Ação</Button>
            </div>
          </header>
        </div>
      </ComponentCard>
    </div>
  );
}