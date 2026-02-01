import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentCard } from "./ComponentCard";
import { User, Settings, Bell, Lock } from "lucide-react";

export function TabsShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Tabs Básicas"
        description="Navegação por abas para organizar conteúdo"
        category="Navegação"
        code={`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="geral">
  <TabsList>
    <TabsTrigger value="geral">Geral</TabsTrigger>
    <TabsTrigger value="seguranca">Segurança</TabsTrigger>
    <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
  </TabsList>
  <TabsContent value="geral">
    Conteúdo da aba Geral
  </TabsContent>
  <TabsContent value="seguranca">
    Conteúdo da aba Segurança
  </TabsContent>
  <TabsContent value="notificacoes">
    Conteúdo da aba Notificações
  </TabsContent>
</Tabs>`}
      >
        <div className="w-full">
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            </TabsList>
            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Gerencie suas preferências básicas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo das configurações gerais aqui.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="seguranca">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Configure opções de segurança da conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configurações de senha e autenticação.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Gerencie suas preferências de notificação.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configurações de email e push notifications.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Tabs com Ícones"
        description="Abas com ícones para melhor identificação"
        category="Navegação"
        code={`import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Bell, Lock } from "lucide-react";

<Tabs defaultValue="perfil">
  <TabsList>
    <TabsTrigger value="perfil">
      <User className="h-4 w-4 mr-2" />
      Perfil
    </TabsTrigger>
    <TabsTrigger value="config">
      <Settings className="h-4 w-4 mr-2" />
      Configurações
    </TabsTrigger>
    <TabsTrigger value="alertas">
      <Bell className="h-4 w-4 mr-2" />
      Alertas
    </TabsTrigger>
  </TabsList>
</Tabs>`}
      >
        <div className="w-full">
          <Tabs defaultValue="perfil">
            <TabsList>
              <TabsTrigger value="perfil" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="alertas" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alertas
              </TabsTrigger>
              <TabsTrigger value="seguranca" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Segurança
              </TabsTrigger>
            </TabsList>
            <TabsContent value="perfil" className="mt-4">
              <p className="text-sm text-muted-foreground">Conteúdo do Perfil</p>
            </TabsContent>
            <TabsContent value="config" className="mt-4">
              <p className="text-sm text-muted-foreground">Conteúdo das Configurações</p>
            </TabsContent>
            <TabsContent value="alertas" className="mt-4">
              <p className="text-sm text-muted-foreground">Conteúdo de Alertas</p>
            </TabsContent>
            <TabsContent value="seguranca" className="mt-4">
              <p className="text-sm text-muted-foreground">Conteúdo de Segurança</p>
            </TabsContent>
          </Tabs>
        </div>
      </ComponentCard>
    </div>
  );
}