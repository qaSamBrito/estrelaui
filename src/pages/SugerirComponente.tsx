import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { saveAs } from "file-saver";

const STORAGE_KEY = "estrelaui-component-suggestions";

type ComponentSuggestion = {
  id: string;
  name: string;
  category: string;
  description: string;
  useCase: string;
  createdAt: number;
};

const categories = [
  "Botões",
  "Formulários",
  "Layout",
  "Navegação",
  "Feedback",
  "Dados",
  "Overlay",
  "Design System",
  "Outro"
];

export default function SugerirComponente() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Outro");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [suggestions, setSuggestions] = useState<ComponentSuggestion[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSuggestions(JSON.parse(stored) as ComponentSuggestion[]);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
  }, [suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = window.crypto?.randomUUID?.() ?? String(Date.now());
    setSuggestions((prev) => [
      { id, name: name.trim(), category, description: description.trim(), useCase: useCase.trim(), createdAt: Date.now() },
      ...prev
    ]);
    setName("");
    setDescription("");
    setUseCase("");
    setCategory("Outro");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir esta sugestão?")) {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(suggestions, null, 2)], {
      type: "application/json"
    });
    saveAs(blob, "sugestoes-componentes.json");
  };

  const [apiUrl, setApiUrl] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendToApi = async () => {
    if (!apiUrl.trim() || suggestions.length === 0) return;
    setIsSending(true);
    try {
      const res = await fetch(apiUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestions, exportedAt: new Date().toISOString() })
      });
      if (res.ok) alert("Sugestões enviadas com sucesso!");
      else alert("Erro ao enviar: " + res.status + " " + res.statusText);
    } catch (e) {
      alert("Erro: " + (e instanceof Error ? e.message : "Falha na requisição"));
    } finally {
      setIsSending(false);
    }
  };

  const handleExportMarkdown = () => {
    const md = `# Sugestões de Componentes - EstrelaUI\n\nGerado em ${new Date().toLocaleString("pt-BR")}\n\n${suggestions
      .map(
        (s) => `## ${s.name}\n- **Categoria:** ${s.category}\n- **Descrição:** ${s.description || "-"}\n- **Caso de uso:** ${s.useCase || "-"}\n- **Data:** ${new Date(s.createdAt).toLocaleString("pt-BR")}\n`
      )
      .join("\n")}`;
    const blob = new Blob([md], { type: "text/markdown" });
    saveAs(blob, "sugestoes-componentes.md");
  };

  return (
    <div className="flex flex-col">
      <div className="container py-6 px-4">
        <h1 className="text-2xl font-semibold text-primary">Sugerir novo componente</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Componente que não existe? Descreva e contribua para o EstrelaUI
        </p>
      </div>

      <div className="container py-6 px-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Descreva o componente</CardTitle>
            <CardDescription>
              O time de design e dev usará sua sugestão para avaliar e implementar no padrão NORTE.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do componente *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex.: Data Range Picker, Wizard Steps"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do componente</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que o componente faz? Quais são suas principais características visuais ou funcionais?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="useCase">Caso de uso</Label>
                <Textarea
                  id="useCase"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Em que cenários esse componente seria usado? Ex.: seleção de intervalo de datas em filtros de relatórios"
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={!name.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Enviar sugestão
              </Button>
              {submitted && (
                <p className="text-sm text-green-600 dark:text-green-400">Sugestão registrada! Obrigado pela contribuição.</p>
              )}
            </form>
          </CardContent>
        </Card>

        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Minhas sugestões</CardTitle>
                  <CardDescription>Sugestões salvas localmente (navegador).</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button variant="outline" size="sm" onClick={handleExportJson}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar .MD
                  </Button>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="URL da API (POST)"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="w-48 h-9"
                    />
                    <Button variant="secondary" size="sm" onClick={handleSendToApi} disabled={isSending || !apiUrl.trim()}>
                      {isSending ? "Enviando..." : "Enviar para API"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
