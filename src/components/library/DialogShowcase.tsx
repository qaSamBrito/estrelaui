import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComponentCard } from "./ComponentCard";
import { Trash2, Plus, AlertTriangle, CheckCircle2, Info, Settings, X } from "lucide-react";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["dialog"];

export function DialogShowcase() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Modal Básico */}
      <ComponentCard
        title="Modal Básico"
        description="Modal para formulários e conteúdo simples"
        category="Overlay"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Registro</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Registro</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar um novo registro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Digite o nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ComponentCard>

      {/* Modal Grande com Scroll */}
      <ComponentCard
        title="Modal Grande (com Scroll)"
        description="Modal para conteúdo extenso com área de scroll interno"
        category="Overlay"
        code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">Modal Grande</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
    <DialogHeader>
      <DialogTitle>Termos de Uso</DialogTitle>
      <DialogDescription>
        Leia os termos antes de continuar.
      </DialogDescription>
    </DialogHeader>
    <div className="max-h-[400px] overflow-y-auto pr-2">
      {/* Conteúdo extenso */}
    </div>
    <DialogFooter>
      <Button>Aceitar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary"><Settings className="mr-2 h-4 w-4" /> Configurações Avançadas</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Configurações Avançadas</DialogTitle>
              <DialogDescription>
                Configure as opções avançadas do sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="config1">Configuração 1</Label>
                <Input id="config1" placeholder="Valor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config2">Configuração 2</Label>
                <Input id="config2" placeholder="Valor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config3">Descrição</Label>
                <Textarea id="config3" placeholder="Digite uma descrição detalhada..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config4">Configuração 4</Label>
                <Input id="config4" placeholder="Valor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config5">Observações</Label>
                <Textarea id="config5" placeholder="Observações adicionais..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button>Salvar Configurações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ComponentCard>

      {/* Confirm Destrutivo */}
      <ComponentCard
        title="Confirm Destrutivo"
        description="Para ações destrutivas que requerem confirmação"
        category="Overlay"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir Registro
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <AlertDialogTitle>Excluir permanentemente?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-2">
                Esta ação não pode ser desfeita. Isso irá excluir permanentemente 
                o registro e todos os dados associados do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sim, excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ComponentCard>

      {/* Confirm de Warning */}
      <ComponentCard
        title="Confirm de Aviso (Warning)"
        description="Para ações que requerem atenção do usuário"
        category="Overlay"
        code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Ação com Aviso</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <AlertDialogTitle>Atenção necessária</AlertDialogTitle>
      </div>
      <AlertDialogDescription>
        Esta ação pode ter consequências.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction className="bg-warning text-warning-foreground">
        Continuar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4 text-warning" /> Arquivar Projeto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <AlertDialogTitle>Arquivar este projeto?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-2">
                O projeto será movido para a pasta de arquivados. Você poderá 
                restaurá-lo a qualquer momento, mas ele não aparecerá mais na lista principal.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-warning text-warning-foreground hover:bg-warning/90">
                Arquivar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ComponentCard>

      {/* Confirm de Sucesso */}
      <ComponentCard
        title="Confirm de Sucesso"
        description="Para confirmação de ações bem-sucedidas"
        category="Overlay"
        code={`<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogTrigger asChild>
    <Button>Processar</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <AlertDialogTitle>Operação concluída!</AlertDialogTitle>
      </div>
      <AlertDialogDescription>
        Sua solicitação foi processada com sucesso.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction className="bg-success text-success-foreground">
        Entendido
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <AlertDialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="default">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmar Envio
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <AlertDialogTitle>Enviado com sucesso!</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-2">
                Seu formulário foi enviado e processado com sucesso. 
                Você receberá uma confirmação por e-mail em breve.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90">
                Entendido
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ComponentCard>

      {/* Confirm Informativo */}
      <ComponentCard
        title="Confirm Informativo"
        description="Para exibir informações importantes ao usuário"
        category="Overlay"
        code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost">Saiba mais</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
          <Info className="h-5 w-5 text-info" />
        </div>
        <AlertDialogTitle>Informação</AlertDialogTitle>
      </div>
      <AlertDialogDescription>
        Detalhes informativos aqui.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>OK</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost">
              <Info className="mr-2 h-4 w-4 text-info" /> Sobre o Sistema
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
                  <Info className="h-5 w-5 text-info" />
                </div>
                <AlertDialogTitle>EstrelaUI Design System</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-2">
                O EstrelaUI é um sistema de design modular baseado na norma NORTE (UID00001-2026), 
                desenvolvido para aplicações corporativas com foco em acessibilidade e usabilidade.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Entendido</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ComponentCard>
    </div>
  );
}