import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentCard } from "./ComponentCard";
import { MoreHorizontal, FileText, Users, TrendingUp, Calendar } from "lucide-react";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["card"];

export function CardShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Card Básico"
        description="Card simples para exibição de conteúdo"
        category="Layout"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Título do Card</CardTitle>
            <CardDescription>Descrição breve do conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo do card aqui.</p>
          </CardContent>
        </Card>
      </ComponentCard>

      <ComponentCard
        title="Card com Footer"
        description="Card com área de ações no rodapé"
        category="Layout"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Confirmar Ação</CardTitle>
            <CardDescription>Você tem certeza que deseja continuar?</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Esta ação não pode ser desfeita.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button>Confirmar</Button>
          </CardFooter>
        </Card>
      </ComponentCard>

      <ComponentCard
        title="Card de Estatísticas"
        description="Card para exibição de métricas e KPIs"
        category="Layout"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231</div>
              <p className="text-xs text-success">+20.1%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.350</div>
              <p className="text-xs text-muted-foreground">+180 novos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">12 pendentes</p>
            </CardContent>
          </Card>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Card com Badge"
        description="Card com indicadores de status"
        category="Layout"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projeto Alpha</CardTitle>
              <p className="text-sm text-muted-foreground">Última atualização: 2 dias atrás</p>
            </div>
            <Badge variant="default">Ativo</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Desenvolvimento do módulo de relatórios com integração de dados em tempo real.</p>
          </CardContent>
        </Card>
      </ComponentCard>
    </div>
  );
}