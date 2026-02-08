import React from "react";
import { ComponentCard } from "./ComponentCard";
import { 
  Circle, 
  Check, 
  AlertCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  User,
  FileText,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["timeline"];

export function TimelineShowcase() {
  const orderEvents = [
    { id: 1, title: "Pedido Confirmado", description: "Seu pedido foi recebido com sucesso", time: "10:30", date: "Hoje", icon: Check, status: "complete" },
    { id: 2, title: "Pagamento Aprovado", description: "O pagamento foi processado", time: "10:35", date: "Hoje", icon: Check, status: "complete" },
    { id: 3, title: "Em Preparação", description: "Seu pedido está sendo preparado", time: "14:00", date: "Hoje", icon: Package, status: "current" },
    { id: 4, title: "Enviado", description: "Aguardando envio", time: "", date: "", icon: Truck, status: "pending" },
    { id: 5, title: "Entregue", description: "Aguardando entrega", time: "", date: "", icon: MapPin, status: "pending" },
  ];

  const activityLog = [
    { id: 1, user: "João Silva", action: "criou o documento", target: "Relatório Q4", time: "há 2 horas", avatar: "JS" },
    { id: 2, user: "Maria Santos", action: "comentou em", target: "Proposta Comercial", time: "há 3 horas", avatar: "MS" },
    { id: 3, user: "Pedro Costa", action: "aprovou", target: "Orçamento 2024", time: "há 5 horas", avatar: "PC" },
    { id: 4, user: "Ana Lima", action: "enviou para revisão", target: "Contrato de Serviço", time: "ontem", avatar: "AL" },
  ];

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Timeline de Pedido"
        description="Acompanhamento visual do status de um pedido"
        category="Timeline"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-0 w-full max-w-md">
          {orderEvents.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    event.status === "complete" ? "bg-success text-success-foreground" :
                    event.status === "current" ? "bg-primary text-primary-foreground animate-pulse" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < orderEvents.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-16 mt-2",
                      event.status === "complete" ? "bg-success" : "bg-muted"
                    )} />
                  )}
                </div>
                <div className="pt-1 pb-6">
                  <h4 className={cn(
                    "font-medium",
                    event.status === "pending" && "text-muted-foreground"
                  )}>{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.time && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.date} às {event.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Log de Atividades"
        description="Histórico de ações dos usuários no sistema"
        category="Timeline"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full max-w-md">
          {activityLog.map((activity, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-medium shrink-0">
                {activity.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {" "}{activity.action}{" "}
                  <span className="font-medium text-primary">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Timeline Horizontal"
        description="Linha do tempo em formato horizontal"
        category="Timeline"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center justify-between w-full max-w-lg">
          {[
            { id: 1, title: "Jan", subtitle: "Início", active: true },
            { id: 2, title: "Mar", subtitle: "Fase 1", active: true },
            { id: 3, title: "Jun", subtitle: "Fase 2", active: true },
            { id: 4, title: "Set", subtitle: "Fase 3", active: false },
            { id: 5, title: "Dez", subtitle: "Conclusão", active: false },
          ].map((event, index, arr) => (
            <div key={event.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-4 w-4 rounded-full",
                  event.active ? "bg-primary" : "bg-muted"
                )} />
                <span className="mt-2 text-sm font-medium">{event.title}</span>
                <span className="text-xs text-muted-foreground">{event.subtitle}</span>
              </div>
              {index < arr.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-2 -mt-8",
                  arr[index + 1].active ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Timeline com Cards"
        description="Eventos detalhados em formato de cards"
        category="Timeline"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-0 w-full max-w-lg">
          {[
            { title: "Documento Criado", description: "Relatório financeiro Q4 2024 foi criado", time: "Hoje às 10:30", icon: FileText, tag: "Documento" },
            { title: "Novo Comentário", description: "Maria Santos adicionou um comentário", time: "Hoje às 11:45", icon: MessageSquare, tag: "Discussão" },
            { title: "Atenção Necessária", description: "Prazo de revisão expira em 2 dias", time: "Ontem às 15:00", icon: AlertCircle, tag: "Urgente" },
          ].map((event, index, arr) => {
            const Icon = event.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {index < arr.length - 1 && <div className="w-0.5 flex-1 mt-2 bg-border" />}
                </div>
                <div className="flex-1 bg-card border rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">{event.tag}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{event.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ComponentCard>
    </div>
  );
}
