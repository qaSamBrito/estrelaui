import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FolderOpen, Lightbulb, FileCode } from "lucide-react";

export default function GeradorInicial() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary" data-testid="gerador-inicial-title">
          Sistema IA de Geração de Telas Front-End Inteligentes
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Para Product Owners, Desenvolvedores, Arquitetos, QA e Stakeholders. Receba descrições em linguagem natural,
          histórias de usuário e critérios de aceitação; gere telas completas, editáveis e código pronto para localhost.
          UID00001-2026 – Usabilidade e Design de Interfaces.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/gerador/nova">
          <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary" />
              <CardTitle>Nova geração</CardTitle>
              <CardDescription>
                Linguagem natural, história de usuário ou critérios de aceitação → telas completas. Stacks: Bootstrap (principal), React, Vue, Angular.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Começar</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/meus-prototipos">
          <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardHeader>
              <FolderOpen className="h-10 w-10 text-primary" />
              <CardTitle>Meus protótipos</CardTitle>
              <CardDescription>
                Protótipos salvos para reaproveitar ou completar para backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Ver protótipos</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/componentes">
          <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardHeader>
              <Lightbulb className="h-10 w-10 text-primary" />
              <CardTitle>Componentes</CardTitle>
              <CardDescription>
                Sugira novos componentes ou edite existentes. QA/PO podem aprovar ou recusar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Abrir</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/">
          <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardHeader>
              <FileCode className="h-10 w-10 text-primary" />
              <CardTitle>Biblioteca de componentes</CardTitle>
              <CardDescription>
                Explore os componentes disponíveis: visual, código e como usar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Abrir biblioteca</Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Padrão NORTE · EstrelaUI · UID00001-2026
      </p>
    </div>
  );
}
