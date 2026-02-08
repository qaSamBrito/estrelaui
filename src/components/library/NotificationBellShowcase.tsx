import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Trash2, Settings, X, MessageSquare, Calendar, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["notification"];

export function NotificationBellShowcase() {
  const [unreadCount, setUnreadCount] = useState(5);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "message", title: "Nova mensagem", description: "João enviou uma mensagem", time: "há 5 min", read: false },
    { id: 2, type: "calendar", title: "Reunião em 30 min", description: "Reunião de Sprint", time: "há 10 min", read: false },
    { id: 3, type: "alert", title: "Alerta de sistema", description: "Atualização disponível", time: "há 1 hora", read: false },
    { id: 4, type: "user", title: "Novo usuário", description: "Maria se cadastrou", time: "há 2 horas", read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message": return MessageSquare;
      case "calendar": return Calendar;
      case "alert": return AlertCircle;
      case "user": return User;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Sino de Notificações"
        description="Ícone de notificação com contador e dropdown"
        category="Notificações"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="font-semibold">Notificações</span>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Marcar como lidas
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </DropdownMenuItem>
                );
              })}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-sm text-primary">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentCard>

      <ComponentCard
        title="Badge de Notificação - Variantes"
        description="Diferentes estilos de contador de notificações"
        category="Notificações"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-6">
          {/* Contador numérico */}
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs">
                12
              </Badge>
            </Button>
            <span className="text-xs text-muted-foreground">Numérico</span>
          </div>

          {/* 99+ */}
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs" variant="destructive">
                99+
              </Badge>
            </Button>
            <span className="text-xs text-muted-foreground">Overflow</span>
          </div>

          {/* Ponto indicador */}
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive" />
            </Button>
            <span className="text-xs text-muted-foreground">Ponto</span>
          </div>

          {/* Com animação */}
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive animate-ping" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive" />
            </Button>
            <span className="text-xs text-muted-foreground">Animado</span>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Notificação Toast Inline"
        description="Notificação inline que pode ser dispensada"
        category="Notificações"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm">Nova atualização disponível</p>
              <p className="text-sm text-muted-foreground">
                Uma nova versão do sistema está disponível.
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
            <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm">Dados salvos com sucesso</p>
              <p className="text-sm text-muted-foreground">
                Suas alterações foram salvas.
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
