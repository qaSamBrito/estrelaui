/**
 * Preview da tela gerada — layout de produto (menu apenas da tela gerada)
 * e fluxo LISTAR > NOVO > EDITAR. Estritamente como no produto final (EstrelaUI/NORTE).
 */

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Search, Pencil, Trash2 } from "lucide-react";
import type { Field, ScreenSpec } from "@/lib/generatorSpec";

const PREVIEW_SPEC_KEY = "estrelaui-gerador-preview-spec";

function getStoredSpec(): ScreenSpec | null {
  try {
    const raw = localStorage.getItem(PREVIEW_SPEC_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScreenSpec;
  } catch {
    return null;
  }
}

/** Campo do formulário (interativo) conforme o tipo. */
function FormField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputType = ["text", "number", "email", "password", "date"].includes(field.type) ? field.type : "text";

  if (field.type === "select" && field.options?.length) {
    const placeholderValue = "__placeholder__";
    return (
      <div className="space-y-2">
        <Label htmlFor={`preview-${field.id}`}>{field.label}</Label>
        <Select
          value={value || placeholderValue}
          onValueChange={(v) => onChange(v === placeholderValue ? "" : v)}
        >
          <SelectTrigger id={`preview-${field.id}`} aria-label={field.label}>
            <SelectValue placeholder={field.placeholder ?? "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={placeholderValue}>{field.placeholder ?? "Selecione"}</SelectItem>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  if (field.type === "radio" && field.options?.length) {
    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-4">
          {field.options.map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <RadioGroupItem value={opt} id={`preview-${field.id}-${opt}`} />
              <Label htmlFor={`preview-${field.id}-${opt}`} className="font-normal cursor-pointer">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
  if (field.type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={`preview-${field.id}`}
          checked={value === "on" || value === "true"}
          onCheckedChange={(checked) => onChange(checked ? "on" : "")}
        />
        <Label htmlFor={`preview-${field.id}`} className="font-normal cursor-pointer">
          {field.label}
        </Label>
      </div>
    );
  }
  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Label htmlFor={`preview-${field.id}`} className="font-medium">{field.label}</Label>
        <Switch
          id={`preview-${field.id}`}
          checked={value === "on" || value === "true"}
          onCheckedChange={(checked) => onChange(checked ? "on" : "")}
        />
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <Label htmlFor={`preview-${field.id}`}>{field.label}</Label>
      <Input
        id={`preview-${field.id}`}
        type={inputType}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={field.label}
      />
    </div>
  );
}

type ViewMode = "list" | "new" | "edit";

export default function GeradorPreview() {
  const { toast } = useToast();
  const [spec, setSpec] = useState<ScreenSpec | null>(() => getStoredSpec());
  const initialForm = useMemo(
    () => Object.fromEntries(spec?.fields.map((f) => [f.id, ""]) ?? []),
    [spec?.fields]
  );
  const [form, setForm] = useState<Record<string, string>>(initialForm);
  const [items, setItems] = useState<({ id: number } & Record<string, string>)[]>(() =>
    [1, 2].map((i) => ({
      id: i,
      ...Object.fromEntries(
        (spec?.fields ?? []).map((f) => [f.id, `${f.label} ${i}`])
      ),
    }))
  );
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingItem, setEditingItem] = useState<({ id: number } & Record<string, string>) | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  if (!spec) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Nenhuma tela carregada para preview.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Gere uma tela no gerador e clique em &quot;Ver preview no navegador&quot; para visualizar aqui.
        </p>
        <Button asChild variant="outline">
          <Link to="/gerador/nova">Ir para Nova geração</Link>
        </Button>
      </div>
    );
  }

  const filteredItems = filter.trim()
    ? items.filter((item) =>
        Object.values(item).some(
          (v) => typeof v === "string" && v.toLowerCase().includes(filter.toLowerCase())
        )
      )
    : items;

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    setItems((prev) => [{ id: Date.now(), ...form }, ...prev]);
    setForm(initialForm);
    setViewMode("list");
    toast({
      variant: "success",
      title: "Cadastro realizado",
      description: "O registro foi salvo com sucesso.",
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? { ...editingItem, ...form } : i))
    );
    setForm(initialForm);
    setEditingItem(null);
    setViewMode("list");
    toast({
      variant: "success",
      title: "Registro atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleEdit = (item: { id: number } & Record<string, string>) => {
    setEditingItem(item);
    setForm(
      Object.fromEntries(
        spec.fields.map((f) => [f.id, String(item[f.id] ?? "")])
      )
    );
    setViewMode("edit");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItem?.id === id) {
      setEditingItem(null);
      setForm(initialForm);
      setViewMode("list");
    }
    setDeleteTargetId(null);
    toast({
      variant: "success",
      title: "Registro excluído",
      description: "O registro foi removido com sucesso.",
    });
  };

  const confirmDelete = () => {
    if (deleteTargetId != null) {
      removeItem(deleteTargetId);
    }
  };

  const cancelForm = () => {
    setForm(initialForm);
    setEditingItem(null);
    setViewMode("list");
  };

  // Layout produto: header + menu só da tela gerada + conteúdo + diálogo de exclusão
  const productShell = (content: React.ReactNode) => (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/gerador/nova"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Voltar ao gerador
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-primary">EstrelaUI</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-medium">NORTE</span>
            <span className="text-xs text-muted-foreground">UID00001-2026</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-border bg-muted/30">
          <nav className="p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {spec.type === "login" ? spec.title : spec.entity}
            </button>
          </nav>
        </aside>
        <main className="flex-1 min-h-0 overflow-auto p-4 md:p-6">
          <AlertDialog open={deleteTargetId != null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O registro será removido permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {content}
        </main>
      </div>
    </div>
  );

  if (spec.type === "login") {
    return productShell(
      <div className="max-w-md mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{spec.title}</CardTitle>
            {spec.subtitle && <CardDescription>{spec.subtitle}</CardDescription>}
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setForm(initialForm);
              }}
              className="space-y-4"
            >
              {spec.fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={form[field.id] ?? ""}
                  onChange={(v) => setForm((p) => ({ ...p, [field.id]: v }))}
                />
              ))}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CRUD: LISTAR > NOVO > EDITAR
  if (viewMode === "new") {
    return productShell(
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Novo {spec.entity}</h1>
          <p className="text-sm text-muted-foreground mt-1">Preencha os campos e salve.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSaveNew} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {spec.fields.map((field) => {
                  const fullWidth =
                    field.type === "checkbox" || field.type === "radio";
                  return (
                    <div
                      key={field.id}
                      className={fullWidth ? "md:col-span-2" : undefined}
                    >
                      <FormField
                        field={field}
                        value={form[field.id] ?? ""}
                        onChange={(v) => setForm((p) => ({ ...p, [field.id]: v }))}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2 pt-5 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === "edit" && editingItem) {
    return productShell(
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Editar {spec.entity}</h1>
          <p className="text-sm text-muted-foreground mt-1">Altere os dados e salve.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {spec.fields.map((field) => {
                  const fullWidth =
                    field.type === "checkbox" || field.type === "radio";
                  return (
                    <div
                      key={field.id}
                      className={fullWidth ? "md:col-span-2" : undefined}
                    >
                      <FormField
                        field={field}
                        value={form[field.id] ?? ""}
                        onChange={(v) => setForm((p) => ({ ...p, [field.id]: v }))}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-5 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancelar
                </Button>
                <Button type="submit">Atualizar</Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTargetId(editingItem.id)}
                >
                  Excluir
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // LISTAR: título acima do subtítulo, ícone de busca, botão Novo cadastro, grid com Ações (ícones)
  const listContent = (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{spec.title}</h1>
          {spec.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{spec.subtitle}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={`Buscar ${spec.entity.toLowerCase()}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 w-full"
              aria-label={`Buscar ${spec.entity.toLowerCase()}`}
            />
          </div>
          <Button onClick={() => setViewMode("new")}>
            Novo cadastro
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{spec.entity}</CardTitle>
          <CardDescription>Lista de registros</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {spec.listColumns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
                <TableHead className="text-right w-[140px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  {spec.listColumns.map((col) => {
                    const field = spec.fields.find((f) => f.label === col);
                    const key = field?.id ?? col;
                    const val = item[key];
                    return (
                      <TableCell key={col}>
                        {col === "Status" || col === "Ativo" ? (
                          <Badge variant="secondary">{String(val || "Ativo")}</Badge>
                        ) : (
                          String(val ?? "—")
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(item)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTargetId(item.id)}
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return productShell(listContent);
}

export { PREVIEW_SPEC_KEY };
