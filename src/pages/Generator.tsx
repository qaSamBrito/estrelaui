import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { cn } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { buildSpecFromPrompt, type Field, type ScreenSpec, type ThemeId } from "@/lib/generatorSpec";
import { PREVIEW_SPEC_KEY } from "@/pages/GeradorPreview";
import { Eye, Pencil, Trash2, Plus, FileText, Package, Upload, ChevronUp, ChevronDown, CheckCircle, SlidersHorizontal, Settings2, ExternalLink, Code2, Copy, Download, Sparkles, Check, X, Save, Search } from "lucide-react";
import { SiReact, SiVuedotjs, SiBootstrap } from "react-icons/si";

type SavedSpec = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt?: number;
  status: "draft" | "final";
  tags: string[];
  modoPO: boolean;
  spec: ScreenSpec;
};

type EditContext =
  | { type: "title" }
  | { type: "field"; fieldId: string }
  | { type: "entity" }
  | { type: "listColumn"; index: number };

const STORAGE_KEY = "estrelaui-generator-specs";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "app";

const mapFieldTypeToHtml = (type: string) => {
  if (["number", "email", "password", "date"].includes(type)) return type;
  return "text";
};

/** Gera HTML nativo de um campo (select, radio, checkbox, date, text...) para protótipo/Bootstrap. */
function buildHtmlFieldMarkup(field: Field, inputClass = "form-control"): string {
  const inputType = ["text", "number", "email", "password", "date"].includes(field.type) ? field.type : "text";
  if (field.type === "select" && field.options?.length) {
    const opts = field.options.map((o) => `<option value="${o.replace(/"/g, "&quot;")}">${o}</option>`).join("\n        ");
    return `<div class="mb-3">
      <label class="form-label">${field.label}</label>
      <select name="${field.id}" class="${inputClass}" aria-label="${field.label}" data-testid="input-${field.id}">
        <option value="">${field.placeholder ?? "Selecione"}</option>
        ${opts}
      </select>
    </div>`;
  }
  if (field.type === "radio" && field.options?.length) {
    const radios = field.options.map((o) => `<label class="me-3"><input type="radio" name="${field.id}" value="${o.replace(/"/g, "&quot;")}" aria-label="${o}" /> ${o}</label>`).join("\n        ");
    return `<div class="mb-3">
      <label class="form-label d-block">${field.label}</label>
      <div>${radios}</div>
    </div>`;
  }
  if (field.type === "checkbox") {
    return `<div class="mb-3 form-check">
      <input type="checkbox" name="${field.id}" class="form-check-input" id="form-${field.id}" aria-label="${field.label}" data-testid="input-${field.id}" />
      <label class="form-check-label" for="form-${field.id}">${field.label}</label>
    </div>`;
  }
  if (field.type === "switch") {
    return `<div class="mb-3 form-check form-switch">
      <input type="checkbox" role="switch" name="${field.id}" class="form-check-input" id="form-${field.id}" aria-label="${field.label}" data-testid="input-${field.id}" />
      <label class="form-check-label" for="form-${field.id}">${field.label}</label>
    </div>`;
  }
  return `<div class="mb-3">
      <label class="form-label">${field.label}</label>
      <input name="${field.id}" type="${inputType}" class="${inputClass}" placeholder="${field.placeholder ?? ""}" aria-label="${field.label}" data-testid="input-${field.id}" />
    </div>`;
}

/** Gera HTML de um campo para o protótipo (NORTE) - label.form-group + controle nativo. */
function buildPrototypeHtmlField(field: Field): string {
  const inputType = ["text", "number", "email", "password", "date"].includes(field.type) ? field.type : "text";
  if (field.type === "select" && field.options?.length) {
    const opts = field.options.map((o) => `<option value="${o.replace(/"/g, "&quot;")}">${o}</option>`).join("\n        ");
    return `<label class="form-group"><span>${field.label}</span>
  <select name="${field.id}" aria-label="${field.label}" data-testid="input-${field.id}"><option value="">${field.placeholder ?? "Selecione"}</option>${opts}</select></label>`;
  }
  if (field.type === "radio" && field.options?.length) {
    const radios = field.options.map((o) => `<label class="me-2"><input type="radio" name="${field.id}" value="${o.replace(/"/g, "&quot;")}" aria-label="${o}" /> ${o}</label>`).join("\n        ");
    return `<label class="form-group"><span>${field.label}</span><div class="flex flex-wrap gap-2">${radios}</div></label>`;
  }
  if (field.type === "checkbox") {
    return `<label class="form-group flex items-center gap-2"><input type="checkbox" name="${field.id}" aria-label="${field.label}" data-testid="input-${field.id}" /><span>${field.label}</span></label>`;
  }
  if (field.type === "switch") {
    return `<label class="form-group flex items-center justify-between gap-2"><span>${field.label}</span><input type="checkbox" role="switch" name="${field.id}" aria-label="${field.label}" data-testid="input-${field.id}" class="h-6 w-11 rounded-full" /></label>`;
  }
  return `<label class="form-group"><span>${field.label}</span>
  <input name="${field.id}" type="${inputType}" placeholder="${field.placeholder ?? ""}" aria-label="${field.label}" data-testid="input-${field.id}" /></label>`;
}

/** Gera o fragmento de um campo para código React (buildAppFile) - usa elementos nativos no ZIP. */
function buildReactFieldMarkup(field: Field, formName: string): string {
  const inputType = ["text", "number", "email", "password", "date"].includes(field.type) ? field.type : "text";
  if (field.type === "select" && field.options?.length) {
    const opts = field.options.map((o) => `              <option value="${o.replace(/"/g, '\\"')}">${o}</option>`).join("\n");
    return `<label className="form-group">
            <span>${field.label}</span>
            <select name="${field.id}" value={${formName}.${field.id}} onChange={handleChange} aria-label="${field.label}" data-testid="input-${field.id}">
              <option value="">${field.placeholder ?? "Selecione"}</option>
${opts}
            </select>
          </label>`;
  }
  if (field.type === "radio" && field.options?.length) {
    const radios = field.options.map((o) => `              <label className="flex items-center gap-2"><input type="radio" name="${field.id}" value="${o.replace(/"/g, '\\"')}" checked={${formName}.${field.id} === "${o.replace(/"/g, '\\"')}"} onChange={handleChange} aria-label="${o}" /><span>${o}</span></label>`).join("\n");
    return `<label className="form-group">
            <span>${field.label}</span>
            <div className="flex flex-wrap gap-4">
${radios}
            </div>
          </label>`;
  }
  if (field.type === "checkbox") {
    return `<label className="form-group flex items-center gap-2">
            <input type="checkbox" name="${field.id}" checked={${formName}.${field.id} === "on" || ${formName}.${field.id} === "true"} onChange={(e) => setForm((p) => ({ ...p, ${field.id}: e.target.checked ? "on" : "" }))} aria-label="${field.label}" data-testid="input-${field.id}" />
            <span>${field.label}</span>
          </label>`;
  }
  if (field.type === "switch") {
    return `<label className="form-group flex items-center justify-between gap-2">
            <span>${field.label}</span>
            <input type="checkbox" role="switch" name="${field.id}" checked={${formName}.${field.id} === "on" || ${formName}.${field.id} === "true"} onChange={(e) => setForm((p) => ({ ...p, ${field.id}: e.target.checked ? "on" : "" }))} aria-label="${field.label}" data-testid="input-${field.id}" className="h-6 w-11 rounded-full" />
          </label>`;
  }
  return `<label className="form-group">
            <span>${field.label}</span>
            <input
              name="${field.id}"
              type="${inputType}"
              placeholder="${field.placeholder ?? ""}"
              value={${formName}.${field.id}}
              onChange={handleChange}
              aria-label="${field.label}"
              data-testid="input-${field.id}"
            />
          </label>`;
}

/** Renderiza um campo do formulário no preview conforme o tipo (Input, Select, Radio, Checkbox, Switch). */
function renderPreviewField(field: Field): React.ReactNode {
  const inputType = ["text", "number", "email", "password", "date"].includes(field.type) ? field.type : "text";
  if (field.type === "select" && field.options?.length) {
    return (
      <>
        <Label>{field.label}</Label>
        <Select disabled>
          <SelectTrigger><SelectValue placeholder={field.placeholder ?? "Selecione"} /></SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
      </>
    );
  }
  if (field.type === "radio" && field.options?.length) {
    return (
      <>
        <Label>{field.label}</Label>
        <RadioGroup disabled value={field.options[0]}>
          <div className="flex flex-wrap gap-4">
            {field.options.map((opt) => (
              <div key={opt} className="flex items-center gap-2">
                <RadioGroupItem value={opt} id={`preview-${field.id}-${opt}`} />
                <Label htmlFor={`preview-${field.id}-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </>
    );
  }
  if (field.type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox disabled />
        <Label className="font-normal">{field.label}</Label>
      </div>
    );
  }
  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between gap-2">
        <Label>{field.label}</Label>
        <Switch disabled />
      </div>
    );
  }
  return (
    <>
      <Label>{field.label}</Label>
      <Input type={inputType} placeholder={field.placeholder} readOnly />
    </>
  );
}

const buildCodeSnippet = (spec: ScreenSpec) => {
  if (spec.type === "login") {
    return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Acesso ao Sistema</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input type="email" placeholder="seu@email.com" />
    <Input type="password" placeholder="Digite sua senha" />
    <Button className="w-full">Entrar</Button>
  </CardContent>
</Card>`;
  }

  return buildAppFile(spec);
};

const buildAppFile = (spec: ScreenSpec) => {
  if (spec.type === "login") {
    const emailField = spec.fields.find((field) => field.id === "email") ?? spec.fields[0];
    const passwordField =
      spec.fields.find((field) => field.type === "password") ?? spec.fields[1] ?? spec.fields[0];

    return `import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    ${emailField.id || "email"}: "",
    ${passwordField.id || "password"}: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(\`Login enviado: \${JSON.stringify(form, null, 2)}\`);
  };

  return (
    <div className="app-shell" data-theme={theme} data-testid="app-shell" role="main">
      <div className="card" data-testid="card-login">
        <div className="card-header flex justify-between items-center">
          <div>
            <p className="eyebrow">${spec.subtitle}</p>
            <h1>${spec.title}</h1>
          </div>
          <button type="button" className="theme-toggle" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))} title={theme === "light" ? "Modo escuro" : "Modo claro"} aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"} data-testid="theme-toggle">{theme === "light" ? "🌙" : "☀️"}</button>
        </div>

        <form onSubmit={handleSubmit} className="card-body" data-testid="form-login" aria-label="Formulário de login">
          <label className="form-group">
            <span>${emailField.label}</span>
            <input
              name="${emailField.id || "email"}"
              type="${mapFieldTypeToHtml(emailField.type)}"
              placeholder="${emailField.placeholder ?? "seu@email.com"}"
              value={form.${emailField.id || "email"}}
              onChange={handleChange}
              aria-label="${emailField.label}"
              data-testid="input-email"
            />
          </label>

          <label className="form-group">
            <span>${passwordField.label}</span>
            <input
              name="${passwordField.id || "password"}"
              type="password"
              placeholder="${passwordField.placeholder ?? "Digite sua senha"}"
              value={form.${passwordField.id || "password"}}
              onChange={handleChange}
              aria-label="${passwordField.label}"
              data-testid="input-password"
            />
          </label>

          <button type="submit" className="primary-btn" data-testid="button-submit" aria-label="Entrar">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
`;
  }

  const formState = spec.fields.map((field) => `    ${field.id}: "",`).join("\n");
  const formInputs = spec.fields
    .map((field) => buildReactFieldMarkup(field, "form").split("\n").map((l) => "          " + l).join("\n"))
    .join("\n\n");

  const tableHeaders = spec.fields.map((field) => `              <th>${field.label}</th>`).join("\n");
  const tableCells = spec.fields.map((field) => `              <td>{item.${field.id}}</td>`).join("\n");
  const sampleItems = [1, 2]
    .map((index) => {
      const entries = spec.fields.map((field) => `    ${field.id}: "${field.label} ${index}",`).join("\n");
      return `  {
    id: ${index},
${entries}
  }`;
    })
    .join(",\n");

  return `import { useState, useEffect } from "react";
import "./App.css";

type Item = {
  id: number;
${spec.fields.map((field) => `  ${field.id}: string;`).join("\n")}
};

const initialItems: Item[] = [
${sampleItems}
];

const initialForm = {
${formState}
};

function App() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) => value.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const rules = [${spec.fields.filter((f) => f.required || f.minLength || f.maxLength || f.pattern).map((f) => `{
      id: "${f.id}", label: "${f.label}",
      required: ${f.required ?? false},
      minLength: ${f.minLength ?? 0},
      maxLength: ${f.maxLength ?? 9999},
      pattern: ${f.pattern ? `"${String(f.pattern).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"` : "null"},
      patternMessage: "${(f.patternMessage ?? "Formato inválido").replace(/"/g, '\\"')}"
    }`).join(", ")}];
    if (rules.length === 0) return { ok: true };
    for (const r of rules) {
      const v = String(form[r.id] ?? "").trim();
      if (r.required && !v) return { ok: false, msg: "Preencha: " + r.label };
      if (r.minLength > 0 && v.length < r.minLength) return { ok: false, msg: r.label + " deve ter no mínimo " + r.minLength + " caracteres" };
      if (r.maxLength < 9999 && v.length > r.maxLength) return { ok: false, msg: r.label + " deve ter no máximo " + r.maxLength + " caracteres" };
      if (r.pattern && v && !new RegExp(r.pattern).test(v)) return { ok: false, msg: r.patternMessage || r.label + " formato inválido" };
    }
    return { ok: true };
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = validate();
    if (!res.ok) { alert(res.msg); return; }
    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...editingItem, ...form } as Item : i)));
      setEditingItem(null);
    } else {
      const nextItem: Item = { id: Date.now(), ...form };
      setItems((prev) => [nextItem, ...prev]);
    }
    setForm(initialForm);
    setSelectedItem(null);
  };
  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setForm({ ${spec.fields.map((f) => `${f.id}: String(item.${f.id} ?? "")`).join(", ")} });
    setSelectedItem(null);
  };
  const handleCancelEdit = () => {
    setEditingItem(null);
    setForm(initialForm);
  };

  return (
    <div className="app-shell" data-theme={theme} data-testid="app-shell" role="main">
      <div className="page-header">
        <div>
          <p className="eyebrow">${spec.subtitle}</p>
          <h1>${spec.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="search-input"
            placeholder="Buscar ${spec.entity.toLowerCase()}..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Buscar ${spec.entity.toLowerCase()}"
            data-testid="input-search"
          />
          <button type="button" className="theme-toggle" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))} title={theme === "light" ? "Modo escuro" : "Modo claro"} aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"} data-testid="theme-toggle">{theme === "light" ? "🌙" : "☀️"}</button>
        </div>
      </div>

      <div className="grid">
        {selectedItem && (
          <section className="card detail-card" data-testid="section-detail" aria-label="Detalhe do item">
            <div className="card-header flex justify-between items-center">
              <h2>Detalhe</h2>
              <button type="button" className="secondary-btn" onClick={() => setSelectedItem(null)} data-testid="button-back-detail" aria-label="Voltar para lista">Voltar</button>
            </div>
            <div className="detail-body">
              {[${spec.fields.map((f) => `{ key: "${f.id}", label: "${f.label}" }`).join(", ")}].map((f) => (
                <div key={f.key}><span className="detail-label">{f.label}</span><p>{String(selectedItem[f.key as keyof Item] ?? "")}</p></div>
              ))}
            </div>
            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={() => setSelectedItem(null)} data-testid="button-back">Voltar</button>
              <button type="button" className="primary-btn" onClick={() => handleEdit(selectedItem)} data-testid="button-edit-detail" aria-label="Editar item">Editar</button>
            </div>
          </section>
        )}
        <section className="card" data-testid="section-list" aria-label="Lista de ${spec.entity}">
          <div className="card-header">
            <p className="eyebrow">Lista</p>
            <h2>${spec.entity}</h2>
          </div>
          <div className="table-wrapper">
            <table role="grid" aria-label="Tabela de ${spec.entity}">
              <thead>
                <tr>
${tableHeaders}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} data-testid="row-item" data-item-id={item.id}>
${tableCells}
                    <td className="actions">
                      <button type="button" onClick={() => setSelectedItem(item)} data-testid="button-view" aria-label="Ver item">Ver</button>
                      <button type="button" onClick={() => handleEdit(item)} data-testid="button-edit" aria-label="Editar item">Editar</button>
                      <button
                        type="button"
                        onClick={() =>
                          setItems((prev) => prev.filter((current) => current.id !== item.id))
                        }
                        data-testid="button-remove"
                        aria-label="Remover item"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" data-testid="section-form" aria-label={editingItem ? "Editar ${spec.entity}" : "Cadastro de ${spec.entity}"}>
          <div className="card-header">
            <p className="eyebrow">Formulário</p>
            <h2>{editingItem ? "Editar" : "Cadastro de"} ${spec.entity}</h2>
          </div>
          <form className="card-form" onSubmit={handleSubmit} data-testid="form-crud" aria-label="Formulário de cadastro">
${formInputs}
            <div className="form-actions">
              {editingItem ? (
                <>
                  <button type="button" className="secondary-btn" onClick={handleCancelEdit} data-testid="button-cancel">Cancelar</button>
                  <button type="submit" className="primary-btn" data-testid="button-update" aria-label="Atualizar">Atualizar</button>
                </>
              ) : (
                <>
                  <button type="button" className="secondary-btn" onClick={() => setForm(initialForm)} data-testid="button-clear">Limpar</button>
                  <button type="submit" className="primary-btn" data-testid="button-save" aria-label="Salvar">Salvar</button>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
`;
};

/* Tokens EstrelaUI/NORTE (UID00001-2026) — mesmo padrão do index.css */
const NORTE_CSS_VARS = `:root {
  font-family: "Inter", system-ui, sans-serif;
  --background: 210 20% 98%;
  --foreground: 210 29% 13%;
  --card: 0 0% 100%;
  --card-foreground: 210 29% 13%;
  --primary: 204 80% 21%;
  --primary-foreground: 0 0% 100%;
  --accent: 202 59% 48%;
  --muted-foreground: 210 20% 45%;
  --border: 210 20% 88%;
  --ring: 204 80% 21%;
  --radius: 0.5rem;
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}`;

const PROTOTYPE_CSS = NORTE_CSS_VARS + `
body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; }
.app-header { position: sticky; top: 0; z-index: 50; width: 100%; height: 3.5rem; border-bottom: 1px solid hsl(var(--border)); background: hsl(var(--background) / 0.95); display: flex; align-items: center; padding: 0 1rem 0 1.5rem; }
.app-header-inner { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
.app-brand { font-weight: 600; color: hsl(var(--primary)); }
.app-brand-sep { color: hsl(var(--muted-foreground)); }
.app-brand-norte { color: hsl(var(--foreground)); font-weight: 500; }
.app-brand-uid { font-size: 0.75rem; color: hsl(var(--muted-foreground)); font-weight: 400; }
.app-shell { flex: 1; min-height: 0; padding: 2.5rem 1.5rem 4rem; max-width: 1200px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 1.5rem; box-sizing: border-box; }
.page-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.eyebrow { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: hsl(var(--muted-foreground)); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
.card { background: hsl(var(--card)); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 10px 15px -3px hsl(var(--primary) / 0.1), 0 4px 6px -2px hsl(var(--primary) / 0.05); border: 1px solid hsl(var(--border)); }
.card-header { margin-bottom: 1.5rem; }
.card-header h1, .card-header h2 { font-size: 1.25rem; font-weight: 600; margin: 0; color: hsl(var(--foreground)); }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid hsl(var(--border)); }
th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: hsl(var(--muted-foreground)); }
.card-form { display: grid; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.9rem; }
.form-group span { font-weight: 500; color: hsl(var(--foreground)); }
input, select { border-radius: var(--radius); border: 1px solid hsl(var(--border)); padding: 0.75rem 1rem; font-size: 1rem; background: hsl(var(--card)); color: hsl(var(--foreground)); }
input:focus, select:focus { outline: none; border-color: hsl(var(--accent)); box-shadow: 0 0 0 3px hsl(var(--accent) / 0.2); }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
.primary-btn, .secondary-btn, table button { border: none; border-radius: 999px; padding: 0.55rem 1.5rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
.primary-btn { background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent))); color: hsl(var(--primary-foreground)); }
.secondary-btn { background: hsl(var(--foreground) / 0.06); color: hsl(var(--foreground)); }
table button { background: transparent; color: hsl(var(--accent)); padding: 0.35rem 0.75rem; }
.primary-btn:hover, .secondary-btn:hover, table button:hover { opacity: 0.9; }
.search-input { width: min(280px, 100%); border-radius: 999px; border: 1px solid hsl(var(--border)); padding: 0.65rem 1rem; }
.actions { text-align: right; }
.flex { display: flex; } .justify-between { justify-content: space-between; } .items-center { align-items: center; } .gap-2 { gap: 0.5rem; } .flex-wrap { flex-wrap: wrap; }
.detail-card .detail-body { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
.detail-label { font-size: 0.75rem; text-transform: uppercase; color: hsl(var(--muted-foreground)); display: block; margin-bottom: 0.25rem; }
@media (max-width: 640px) { .app-shell { padding: 1.5rem 1rem 3rem; } table { font-size: 0.85rem; } }`;

const PROTOTYPE_CSS_MINIMAL = `:root { font-family: system-ui, sans-serif; color: #1a1a1a; background: #fafafa; }
body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; }
.app-header { position: sticky; top: 0; z-index: 50; width: 100%; height: 3.5rem; border-bottom: 1px solid #eee; background: #fff; display: flex; align-items: center; padding: 0 1rem 0 1.5rem; }
.app-header-inner { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
.app-brand { font-weight: 600; color: #0d47a1; }
.app-brand-sep { color: #666; }
.app-brand-norte { color: #1a1a1a; font-weight: 500; }
.app-brand-uid { font-size: 0.75rem; color: #666; font-weight: 400; }
.app-shell { flex: 1; min-height: 0; padding: 1.5rem; max-width: 1000px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 1rem; box-sizing: border-box; }
.page-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; }
.eyebrow { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
.card { background: #fff; border-radius: 0.5rem; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #eee; }
.card-header { margin-bottom: 1rem; }
.card-header h1, .card-header h2 { font-size: 1.25rem; font-weight: 600; margin: 0; color: #1a1a1a; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; }
th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
.card-form { display: grid; gap: 0.75rem; }
.form-group { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; }
.form-group span { font-weight: 500; color: #1a1a1a; }
input, select { border-radius: 0.375rem; border: 1px solid #ddd; padding: 0.5rem 0.75rem; font-size: 0.875rem; background: #fff; color: #1a1a1a; }
input:focus, select:focus { outline: none; border-color: #333; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }
.form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.primary-btn, .secondary-btn, table button { border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; font-weight: 500; cursor: pointer; font-size: 0.875rem; }
.primary-btn { background: #1a1a1a; color: #fff; }
.secondary-btn { background: #f0f0f0; color: #1a1a1a; }
table button { background: transparent; color: #1a1a1a; padding: 0.25rem 0.5rem; text-decoration: underline; }
.search-input { width: min(260px, 100%); border-radius: 0.375rem; border: 1px solid #ddd; padding: 0.5rem 0.75rem; }
.actions { text-align: right; }
.flex { display: flex; } .justify-between { justify-content: space-between; } .items-center { align-items: center; } .gap-2 { gap: 0.5rem; } .flex-wrap { flex-wrap: wrap; }
.detail-card .detail-body { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
.detail-label { font-size: 0.7rem; text-transform: uppercase; color: #666; display: block; margin-bottom: 0.25rem; }`;

function getThemeCss(theme: ThemeId | undefined): string {
  return theme === "minimal" ? PROTOTYPE_CSS_MINIMAL : PROTOTYPE_CSS;
}

/** CSS do App.css do projeto React gerado — NORTE (EstrelaUI) ou Minimal. */
function getReactAppCss(theme: ThemeId | undefined): string {
  if (theme === "minimal") {
    return `:root, [data-theme="light"] {
  font-family: system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  background-color: #fafafa;
  --bg: #fafafa;
  --fg: #1a1a1a;
  --card-bg: #fff;
  --border: #e0e0e0;
}
html[data-theme="dark"], [data-theme="dark"] {
  color: #e5e5e5;
  background-color: #1a1a1a;
  --bg: #1a1a1a;
  --fg: #e5e5e5;
  --card-bg: #2a2a2a;
  --border: #444;
}

.app-shell { min-height: 100vh; padding: 1.5rem; max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
.page-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; }
.eyebrow { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #666; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
.card { background: var(--card-bg); border-radius: 0.5rem; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid var(--border); }
.card-header { margin-bottom: 1rem; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
.card-form { display: grid; gap: 0.75rem; }
.form-group { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; }
input { border-radius: 0.375rem; border: 1px solid var(--border); padding: 0.5rem 0.75rem; font-size: 0.875rem; }
input:focus { outline: none; border-color: #333; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }
.form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.primary-btn, .secondary-btn, table button { border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; font-weight: 500; cursor: pointer; font-size: 0.875rem; }
.primary-btn { background: #1a1a1a; color: #fff; }
.secondary-btn { background: #f0f0f0; color: #1a1a1a; }
table button { background: transparent; color: #1a1a1a; padding: 0.25rem 0.5rem; text-decoration: underline; }
.theme-toggle { padding: 0.5rem; border: 1px solid var(--border); border-radius: 999px; background: var(--card-bg); cursor: pointer; font-size: 1.1rem; }
.flex { display: flex; } .items-center { align-items: center; } .justify-between { justify-content: space-between; } .gap-2 { gap: 0.5rem; }
.detail-card .detail-body { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
.detail-label { font-size: 0.75rem; text-transform: uppercase; color: #666; display: block; margin-bottom: 0.25rem; }
.search-input { width: min(280px, 100%); border-radius: 0.375rem; border: 1px solid var(--border); padding: 0.5rem 0.75rem; }
.actions { text-align: right; }
@media (max-width: 640px) { .app-shell { padding: 1rem; } table { font-size: 0.85rem; } }
`;
  }
  return `/* EstrelaUI/NORTE (UID00001-2026) */
:root, [data-theme="light"] {
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --background: 210 20% 98%;
  --foreground: 210 29% 13%;
  --card: 0 0% 100%;
  --primary: 204 80% 21%;
  --primary-foreground: 0 0% 100%;
  --accent: 202 59% 48%;
  --muted-foreground: 210 20% 45%;
  --border: 210 20% 88%;
  --radius: 0.5rem;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}
html[data-theme="dark"], [data-theme="dark"] {
  --background: 210 29% 8%;
  --foreground: 210 20% 98%;
  --card: 210 29% 10%;
  --primary: 202 59% 48%;
  --primary-foreground: 0 0% 100%;
  --accent: 202 59% 48%;
  --muted-foreground: 210 20% 65%;
  --border: 210 25% 20%;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

.app-shell {
  min-height: 100vh;
  padding: 2.5rem 1.5rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.card {
  background: hsl(var(--card));
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px hsl(var(--primary) / 0.1), 0 4px 6px -2px hsl(var(--primary) / 0.05);
  border: 1px solid hsl(var(--border));
}

.card-header {
  margin-bottom: 1.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid hsl(var(--border));
}

th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: hsl(var(--muted-foreground));
}

.card-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

input {
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: hsl(var(--accent));
  box-shadow: 0 0 0 3px hsl(var(--accent) / 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.primary-btn,
.secondary-btn,
table button {
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.primary-btn {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  color: hsl(var(--primary-foreground));
}

.secondary-btn {
  background: hsl(var(--foreground) / 0.06);
  color: hsl(var(--foreground));
}

table button {
  background: transparent;
  color: hsl(var(--accent));
  padding: 0.35rem 0.75rem;
}

.primary-btn:hover,
.secondary-btn:hover,
table button:hover {
  transform: translateY(-1px);
}

.theme-toggle {
  padding: 0.5rem;
  border: 1px solid hsl(var(--border));
  border-radius: 999px;
  background: hsl(var(--card));
  cursor: pointer;
  font-size: 1.1rem;
}
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }

.detail-card .detail-body { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
.detail-label { font-size: 0.75rem; text-transform: uppercase; color: hsl(var(--muted-foreground)); display: block; margin-bottom: 0.25rem; }

.search-input {
  width: min(280px, 100%);
  border-radius: 999px;
  border: 1px solid hsl(var(--border));
  padding: 0.65rem 1rem;
}

.actions {
  text-align: right;
}

@media (max-width: 640px) {
  .app-shell {
    padding: 1.5rem 1rem 3rem;
  }

  table {
    font-size: 0.85rem;
  }
}
`;
}

const buildHtmlFile = (spec: ScreenSpec): string => {
  if (spec.type === "login") {
    const emailField = spec.fields.find((f) => f.id === "email") ?? spec.fields[0];
    const passField = spec.fields.find((f) => f.type === "password") ?? spec.fields[1];
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${spec.title}</title><style>${getThemeCss(spec.theme)}</style></head>
<body>
<header class="app-header" role="banner">
  <div class="app-header-inner">
    <span class="app-brand">EstrelaUI</span>
    <span class="app-brand-sep">|</span>
    <span class="app-brand-norte">NORTE</span>
    <span class="app-brand-uid">UID00001-2026</span>
  </div>
</header>
<div class="app-shell" data-testid="app-shell" role="main">
  <div class="card" data-testid="card-login">
    <div class="card-header">
      <p class="eyebrow">${spec.subtitle}</p>
      <h1>${spec.title}</h1>
    </div>
    <form class="card-form" id="form" onsubmit="handleSubmit(event)" data-testid="form-login" aria-label="Formulário de login">
      <label class="form-group"><span>${emailField.label}</span>
        <input name="${emailField.id}" type="${mapFieldTypeToHtml(emailField.type)}" placeholder="${emailField.placeholder ?? ""}" aria-label="${emailField.label}" data-testid="input-email">
      </label>
      <label class="form-group"><span>${passField.label}</span>
        <input name="${passField.id}" type="password" placeholder="${passField.placeholder ?? ""}" aria-label="${passField.label}" data-testid="input-password">
      </label>
      <button type="submit" class="primary-btn" data-testid="button-submit" aria-label="Entrar">Entrar</button>
    </form>
  </div>
</div>
<script>
function handleSubmit(e) { e.preventDefault(); const fd = new FormData(e.target); alert(JSON.stringify(Object.fromEntries(fd), null, 2)); }
</script>
</body>
</html>`;
  }

  const formGroups = spec.fields.map((f) => buildPrototypeHtmlField(f)).join("\n      ");
  const ths = spec.fields.map((f) => `<th>${f.label}</th>`).join("\n              ");
  const tds = spec.fields.map((f) => `<td data-field="${f.id}"></td>`).join("\n                  ");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${spec.title}</title><style>${getThemeCss(spec.theme)}</style></head>
<body>
<header class="app-header" role="banner">
  <div class="app-header-inner">
    <span class="app-brand">EstrelaUI</span>
    <span class="app-brand-sep">|</span>
    <span class="app-brand-norte">NORTE</span>
    <span class="app-brand-uid">UID00001-2026</span>
  </div>
</header>
<div class="app-shell" data-testid="app-shell" role="main">
  <div class="page-header">
    <div><p class="eyebrow">${spec.subtitle}</p><h1>${spec.title}</h1></div>
    <input class="search-input" id="filter" placeholder="Buscar ${spec.entity.toLowerCase()}..." aria-label="Buscar ${spec.entity.toLowerCase()}" data-testid="input-search">
  </div>
  <div class="grid">
    <section class="card" data-testid="section-list" aria-label="Lista de ${spec.entity}">
      <div class="card-header"><p class="eyebrow">Lista</p><h2>${spec.entity}</h2></div>
      <div class="table-wrapper">
        <table role="grid" aria-label="Tabela de ${spec.entity}"><thead><tr>${ths}<th>Ações</th></tr></thead>
        <tbody id="tbody"></tbody></table>
      </div>
    </section>
    <section class="card" data-testid="section-form" aria-label="Cadastro de ${spec.entity}">
      <div class="card-header"><p class="eyebrow">Formulário</p><h2>Cadastro</h2></div>
      <form class="card-form" id="form" onsubmit="handleSubmit(event)" data-testid="form-crud" aria-label="Formulário de cadastro">
        ${formGroups}
        <div class="form-actions">
          <button type="button" class="secondary-btn" onclick="resetForm()" data-testid="button-clear">Limpar</button>
          <button type="submit" class="primary-btn" data-testid="button-save" aria-label="Salvar">Salvar</button>
        </div>
      </form>
    </section>
  </div>
</div>
<script>
const fields = ${JSON.stringify(spec.fields.map((f) => f.id))};
let items = [${[1, 2].map((rowIdx) => `{id:${rowIdx},${spec.fields.map((f) => `${f.id}:"${f.label} ${rowIdx}"`).join(",")}}`).join(",")}];
const tbody = document.getElementById("tbody");
const formEl = document.getElementById("form");
const filterEl = document.getElementById("filter");

function render() {
  const q = (filterEl?.value || "").toLowerCase();
  const list = q ? items.filter(i => Object.values(i).some(v => String(v).toLowerCase().includes(q))) : items;
  tbody.innerHTML = list.map(i => '<tr data-testid="row-item">' + fields.map(f => '<td>' + (i[f]||'') + '</td>').join('') + '<td class="actions"><button type="button" onclick="remove(' + i.id + ')" data-testid="button-remove" aria-label="Remover item">Remover</button></td></tr>').join('');
}
function handleSubmit(e) { e.preventDefault(); const fd = new FormData(formEl); const o = { id: Date.now() }; fields.forEach(f => o[f] = fd.get(f) || ''); items = [o, ...items]; resetForm(); render(); }
function remove(id) { items = items.filter(x => x.id !== id); render(); }
function resetForm() { formEl?.reset(); }
filterEl?.addEventListener("input", render);
render();
</script>
</body>
</html>`;
};

const buildVueAppFile = (spec: ScreenSpec): string => {
  if (spec.type === "login") {
    const emailField = spec.fields.find((f) => f.id === "email") ?? spec.fields[0];
    const passField = spec.fields.find((f) => f.type === "password") ?? spec.fields[1];
    return `<script setup>
import { ref } from 'vue'
const form = ref({ ${emailField.id || "email"}: '', ${passField.id || "password"}: '' })
const handleSubmit = (e) => { e.preventDefault(); alert(JSON.stringify(form.value, null, 2)) }
</script>

<template>
  <div class="app-shell" data-testid="app-shell" role="main">
    <div class="card" data-testid="card-login">
      <div class="card-header">
        <p class="eyebrow">${spec.subtitle}</p>
        <h1>${spec.title}</h1>
      </div>
      <form @submit="handleSubmit" class="card-form" data-testid="form-login" aria-label="Formulário de login">
        <label class="form-group">
          <span>${emailField.label}</span>
          <input v-model="form.${emailField.id || "email"}" type="${mapFieldTypeToHtml(emailField.type)}" placeholder="${emailField.placeholder ?? ""}" aria-label="${emailField.label}" data-testid="input-email" />
        </label>
        <label class="form-group">
          <span>${passField.label}</span>
          <input v-model="form.${passField.id || "password"}" type="password" placeholder="${passField.placeholder ?? ""}" aria-label="${passField.label}" data-testid="input-password" />
        </label>
        <button type="submit" class="primary-btn" data-testid="button-submit" aria-label="Entrar">Entrar</button>
      </form>
    </div>
  </div>
</template>`;
  }

  const buildVueField = (f: Field): string => {
    const inputType = ["text", "number", "email", "password", "date"].includes(f.type) ? f.type : "text";
    if (f.type === "select" && f.options?.length) {
      const opts = f.options.map((o) => `<option value="${o.replace(/"/g, "&quot;")}">${o}</option>`).join("\n          ");
      return `        <label class="form-group">
          <span>${f.label}</span>
          <select v-model="form.${f.id}" aria-label="${f.label}" data-testid="input-${f.id}">
            <option value="">${f.placeholder ?? "Selecione"}</option>
            ${opts}
          </select>
        </label>`;
    }
    if (f.type === "radio" && f.options?.length) {
      const radios = f.options.map((o) => `<label class="me-3"><input type="radio" v-model="form.${f.id}" value="${o.replace(/"/g, "&quot;")}" /> ${o}</label>`).join("\n          ");
      return `        <label class="form-group"><span>${f.label}</span><div class="flex flex-wrap gap-2">${radios}</div></label>`;
    }
    if (f.type === "checkbox") {
      return `        <label class="form-group flex items-center gap-2">
          <input type="checkbox" v-model="form.${f.id}" true-value="on" false-value="" aria-label="${f.label}" data-testid="input-${f.id}" />
          <span>${f.label}</span>
        </label>`;
    }
    if (f.type === "switch") {
      return `        <label class="form-group flex items-center justify-between gap-2">
          <span>${f.label}</span>
          <input type="checkbox" role="switch" v-model="form.${f.id}" true-value="on" false-value="" aria-label="${f.label}" data-testid="input-${f.id}" class="h-6 w-11 rounded-full" />
        </label>`;
    }
    return `        <label class="form-group">
          <span>${f.label}</span>
          <input v-model="form.${f.id}" type="${inputType}" placeholder="${f.placeholder ?? ""}" aria-label="${f.label}" data-testid="input-${f.id}" />
        </label>`;
  };
  const formInputs = spec.fields.map(buildVueField).join("\n");
  const tableCells = spec.fields.map((f) => `                <td>{{ item.${f.id} }}</td>`).join("\n");

  return `<script setup>
import { ref, computed } from 'vue'
const items = ref(${JSON.stringify(
    [1, 2].map((i) => ({ id: i, ...Object.fromEntries(spec.fields.map((f) => [f.id, `${f.label} ${i}`])) }))
  )})
const form = ref({ ${spec.fields.map((f) => `${f.id}: ''`).join(", ")} })
const filter = ref('')
const filteredItems = computed(() => {
  const q = filter.value.toLowerCase()
  return q ? items.value.filter(i => Object.values(i).some(v => String(v).toLowerCase().includes(q))) : items.value
})
const selectedItem = ref(null)
const editingItem = ref(null)
const detailFields = [${spec.fields.map((f) => `{key:'${f.id}',label:'${f.label}'}`).join(", ")}]
const resetForm = () => { form.value = { ${spec.fields.map((f) => `${f.id}: ''`).join(", ")} }; editingItem.value = null }
const handleEdit = (item) => { editingItem.value = item; form.value = { ${spec.fields.map((f) => `${f.id}: String(item.${f.id} ?? '')`).join(", ")} }; selectedItem.value = null }
const handleSubmit = (e) => {
  e.preventDefault()
  if (editingItem.value) {
    items.value = items.value.map(i => i.id === editingItem.value.id ? { ...editingItem.value, ...form.value } : i)
    resetForm()
  } else {
    items.value = [{ id: Date.now(), ...form.value }, ...items.value]
    resetForm()
  }
  selectedItem.value = null
}
const remove = (id) => { items.value = items.value.filter(x => x.id !== id) }
</script>

<template>
  <div class="app-shell" data-testid="app-shell" role="main">
    <div class="page-header">
      <div><p class="eyebrow">${spec.subtitle}</p><h1>${spec.title}</h1></div>
      <input v-model="filter" class="search-input" placeholder="Buscar ${spec.entity.toLowerCase()}..." aria-label="Buscar ${spec.entity.toLowerCase()}" data-testid="input-search" />
    </div>
    <div class="grid">
      <section v-if="selectedItem" class="card detail-card" data-testid="section-detail" aria-label="Detalhe do item">
        <div class="card-header flex justify-between items-center">
          <h2>Detalhe</h2>
          <button type="button" class="secondary-btn" @click="selectedItem = null" data-testid="button-back-detail" aria-label="Voltar para lista">Voltar</button>
        </div>
        <div class="detail-body">
          <div v-for="f in detailFields" :key="f.key">
            <span class="detail-label">{{ f.label }}</span><p>{{ selectedItem[f.key] }}</p>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="secondary-btn" @click="selectedItem = null" data-testid="button-back">Voltar</button>
          <button type="button" class="primary-btn" @click="handleEdit(selectedItem)" data-testid="button-edit-detail" aria-label="Editar item">Editar</button>
        </div>
      </section>
      <section class="card" data-testid="section-list" aria-label="Lista de ${spec.entity}">
        <div class="card-header"><p class="eyebrow">Lista</p><h2>${spec.entity}</h2></div>
        <div class="table-wrapper">
          <table role="grid" :aria-label="'Tabela de ${spec.entity}'">
            <thead><tr>${spec.fields.map((f) => `<th>${f.label}</th>`).join("\n                ")}<th>Ações</th></tr></thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id" data-testid="row-item">
                ${tableCells}
                <td class="actions">
                  <button type="button" @click="selectedItem = item" data-testid="button-view" aria-label="Ver item">Ver</button>
                  <button type="button" @click="handleEdit(item)" data-testid="button-edit" aria-label="Editar item">Editar</button>
                  <button type="button" @click="remove(item.id)" data-testid="button-remove" aria-label="Remover item">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="card" data-testid="section-form" :aria-label="editingItem ? 'Editar ${spec.entity}' : 'Cadastro de ${spec.entity}'">
        <div class="card-header">
          <p class="eyebrow">Formulário</p>
          <h2>{{ editingItem ? 'Editar' : 'Cadastro de' }} ${spec.entity}</h2>
        </div>
        <form @submit="handleSubmit" class="card-form" data-testid="form-crud" aria-label="Formulário de cadastro">
${formInputs}
          <div class="form-actions">
            <template v-if="editingItem">
              <button type="button" class="secondary-btn" @click="resetForm" data-testid="button-cancel">Cancelar</button>
              <button type="submit" class="primary-btn" data-testid="button-update" aria-label="Atualizar">Atualizar</button>
            </template>
            <template v-else>
              <button type="button" class="secondary-btn" @click="resetForm" data-testid="button-clear">Limpar</button>
              <button type="submit" class="primary-btn" data-testid="button-save" aria-label="Salvar">Salvar</button>
            </template>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>`;
};

const generateVueProjectZip = async (spec: ScreenSpec) => {
  const slug = slugify(spec.entity);
  const zip = new JSZip();
  const root = zip.folder(`estrelaui-vue-${slug}`);
  if (!root) return;

  root.file("package.json", JSON.stringify({
    name: `estrelaui-vue-${slug}`,
    private: true,
    version: "0.0.1",
    type: "module",
    scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
    dependencies: { vue: "^3.4.0" },
    devDependencies: { "@vitejs/plugin-vue": "^5.0.0", vite: "^5.0.2" }
  }, null, 2));

  root.file("vite.config.js", `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: { port: 5173 }
});
`);

  root.file("index.html", `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${spec.title}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`);

  const src = root.folder("src");
  src?.file("main.js", `import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).mount("#app");
`);

  src?.file("App.vue", buildVueAppFile(spec));
  src?.file("style.css", getThemeCss(spec.theme));

  root.file("README.md", `# EstrelaUI Vue - ${spec.title}\n\nProjeto Vue 3 gerado automaticamente.\n\n## Como usar\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nLayout segue o padrão EstrelaUI/NORTE.`);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `estrelaui-vue-${slug}.zip`);
};

const buildBootstrapHtmlFile = (spec: ScreenSpec): string => {
  const formGroups = spec.fields.map((f) => buildHtmlFieldMarkup(f, "form-control")).join("\n");
  const ths = spec.fields.map((f) => `<th>${f.label}</th>`).join("\n");
  const tds = spec.fields.map((f) => `<td data-field="${f.id}"></td>`).join("\n");
  const fields = JSON.stringify(spec.fields.map((f) => f.id));
  if (spec.type === "login") {
    const emailField = spec.fields.find((f) => f.id === "email") ?? spec.fields[0];
    const passField = spec.fields.find((f) => f.type === "password") ?? spec.fields[1];
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${spec.title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5" data-testid="app-shell" role="main">
  <div class="card shadow-sm max-w-md mx-auto" data-testid="card-login">
    <div class="card-body">
      <p class="text-uppercase small text-muted mb-1">${spec.subtitle}</p>
      <h1 class="h4 mb-4">${spec.title}</h1>
      <form id="form" onsubmit="handleSubmit(event)" data-testid="form-login" aria-label="Formulário de login">
        <div class="mb-3">
          <label class="form-label">${emailField.label}</label>
          <input name="${emailField.id}" type="${mapFieldTypeToHtml(emailField.type)}" class="form-control" placeholder="${emailField.placeholder ?? ""}" aria-label="${emailField.label}" data-testid="input-email" />
        </div>
        <div class="mb-3">
          <label class="form-label">${passField.label}</label>
          <input name="${passField.id}" type="password" class="form-control" placeholder="${passField.placeholder ?? ""}" aria-label="${passField.label}" data-testid="input-password" />
        </div>
        <button type="submit" class="btn btn-primary w-100" data-testid="button-submit" aria-label="Entrar">Entrar</button>
      </form>
    </div>
  </div>
</div>
<script>function handleSubmit(e){e.preventDefault();alert(JSON.stringify(Object.fromEntries(new FormData(e.target)), null, 2));}</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
  }
  const detailRows = spec.fields
    .map((f) => `<div class="mb-2"><span class="text-muted small">${f.label}</span><p class="mb-0" id="detail-${f.id}"></p></div>`)
    .join("\n");
  const formGroupsEditable = spec.fields.map((f) => buildHtmlFieldMarkup(f, "form-control")).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${spec.title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5" data-testid="app-shell" role="main">
  <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div><p class="text-uppercase small text-muted mb-1">${spec.subtitle}</p><h1 class="h4 mb-0">${spec.title}</h1></div>
    <input class="form-control w-auto" id="filter" placeholder="Buscar ${spec.entity.toLowerCase()}..." style="max-width:220px" aria-label="Buscar ${spec.entity.toLowerCase()}" data-testid="input-search" />
  </div>

  <div id="view-list" class="row g-4" data-testid="section-list" aria-label="Lista de ${spec.entity}">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div><p class="text-uppercase small text-muted mb-1">Lista</p><h2 class="h5 mb-0">${spec.entity}</h2></div>
            <button type="button" class="btn btn-primary btn-sm" onclick="newItem()" data-testid="button-new" aria-label="Novo item">Novo</button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover" role="grid" aria-label="Tabela de ${spec.entity}"><thead><tr>${ths}<th class="text-end">Ações</th></tr></thead>
            <tbody id="tbody"></tbody></table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="view-detail" class="row g-4" style="display:none" data-testid="section-detail" aria-label="Detalhe do item">
    <div class="col-lg-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 mb-0">Detalhe</h2>
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showView('list')" data-testid="button-back-detail" aria-label="Voltar para lista">Voltar</button>
          </div>
          <div id="detail-body">${detailRows}</div>
          <div class="d-flex gap-2 mt-3">
            <button type="button" class="btn btn-outline-secondary" onclick="showView('list')" data-testid="button-back">Voltar</button>
            <button type="button" class="btn btn-primary" onclick="editSelected()" data-testid="button-edit-detail" aria-label="Editar item">Editar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="view-form" class="row g-4" style="display:none" data-testid="section-form" aria-label="Cadastro de ${spec.entity}">
    <div class="col-lg-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 mb-0" id="form-title">Cadastro de ${spec.entity}</h2>
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="cancelForm()" data-testid="button-cancel">Cancelar</button>
          </div>
          <form id="form" onsubmit="handleSubmit(event)" data-testid="form-crud" aria-label="Formulário de cadastro">${formGroupsEditable}
            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn btn-outline-secondary" onclick="resetForm()" data-testid="button-clear">Limpar</button>
              <button type="submit" class="btn btn-primary" id="btn-submit" data-testid="button-save" aria-label="Salvar">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
const fields = ${fields};
let items = [${[1, 2].map((rowIdx) => `{id:${rowIdx},${spec.fields.map((f) => `${f.id}:"${f.label} ${rowIdx}"`).join(",")}}`).join(",")}];
let selectedItem = null;
let editingItem = null;

function showView(view) {
  document.getElementById("view-list").style.display = view === "list" ? "" : "none";
  document.getElementById("view-detail").style.display = view === "detail" ? "" : "none";
  document.getElementById("view-form").style.display = view === "form" ? "" : "none";
}

function render() {
  const q = (document.getElementById("filter").value || "").toLowerCase();
  const list = q ? items.filter(i => Object.values(i).some(v => String(v).toLowerCase().includes(q))) : items;
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = list.map(i => '<tr data-testid="row-item">' + fields.map(f => '<td>' + (i[f]||'') + '</td>').join('') +
    '<td class="text-end"><button type="button" class="btn btn-link btn-sm" onclick="viewDetail('+i.id+')" data-testid="button-view" aria-label="Ver item">Ver</button> ' +
    '<button type="button" class="btn btn-link btn-sm" onclick="editItem('+i.id+')" data-testid="button-edit" aria-label="Editar item">Editar</button> ' +
    '<button type="button" class="btn btn-link btn-sm text-danger" onclick="remove('+i.id+')" data-testid="button-remove" aria-label="Remover item">Remover</button></td></tr>').join('');
}

function viewDetail(id) {
  selectedItem = items.find(x => x.id === id) || null;
  editingItem = null;
  if (!selectedItem) return;
  fields.forEach(f => { const el = document.getElementById("detail-"+f); if (el) el.textContent = selectedItem[f] || ""; });
  showView("detail");
}

function editSelected() {
  if (selectedItem) { editingItem = selectedItem; selectedItem = null; showView("form"); fillForm(editingItem); setFormTitle("Editar "+"${spec.entity}"); document.getElementById("btn-submit").textContent = "Atualizar"; }
}

function editItem(id) {
  editingItem = items.find(x => x.id === id) || null;
  selectedItem = null;
  showView("form");
  if (editingItem) { fillForm(editingItem); setFormTitle("Editar "+"${spec.entity}"); document.getElementById("btn-submit").textContent = "Atualizar"; }
  else { resetForm(); setFormTitle("Cadastro de "+"${spec.entity}"); document.getElementById("btn-submit").textContent = "Salvar"; }
}

function setFormTitle(t) { const el = document.getElementById("form-title"); if (el) el.textContent = t; }

function fillForm(item) {
  const form = document.getElementById("form");
  if (!form) return;
  fields.forEach(f => { const input = form.querySelector('[name="'+f+'"]'); if (input) input.value = item[f] || ""; });
}

function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("form");
  const fd = new FormData(form);
  const o = { id: editingItem ? editingItem.id : Date.now() };
  fields.forEach(f => o[f] = fd.get(f) || "");
  if (editingItem) {
    items = items.map(i => i.id === editingItem.id ? o : i);
  } else {
    items = [o, ...items];
  }
  editingItem = null;
  resetForm();
  setFormTitle("Cadastro de "+"${spec.entity}");
  document.getElementById("btn-submit").textContent = "Salvar";
  showView("list");
  render();
}

function remove(id) {
  if (!confirm("Remover este registro?")) return;
  items = items.filter(x => x.id !== id);
  render();
}

function resetForm() { const form = document.getElementById("form"); if (form) form.reset(); }

function cancelForm() {
  editingItem = null;
  selectedItem = null;
  resetForm();
  setFormTitle("Cadastro de "+"${spec.entity}");
  document.getElementById("btn-submit").textContent = "Salvar";
  showView("list");
}

function newItem() {
  editingItem = null;
  selectedItem = null;
  resetForm();
  setFormTitle("Cadastro de "+"${spec.entity}");
  document.getElementById("btn-submit").textContent = "Salvar";
  showView("form");
}

document.getElementById("filter").addEventListener("input", render);
render();
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
};

/** Angular: componente principal seguindo padrão EstrelaUI/NORTE (UID00001-2026). */
const buildAngularComponentHtml = (spec: ScreenSpec): string => {
  if (spec.type === "login") {
    const emailField = spec.fields.find((f) => f.id === "email") ?? spec.fields[0];
    const passField = spec.fields.find((f) => f.type === "password") ?? spec.fields[1] ?? spec.fields[0];
    return `<div class="app-shell" data-testid="app-shell" role="main">
  <div class="card" data-testid="card-login">
    <div class="card-header">
      <p class="eyebrow">${spec.subtitle}</p>
      <h1>${spec.title}</h1>
    </div>
    <form (ngSubmit)="onSubmit()" class="card-form" data-testid="form-login" aria-label="Formulário de login">
      <label class="form-group">
        <span>${emailField.label}</span>
        <input name="${emailField.id || "email"}" type="${mapFieldTypeToHtml(emailField.type)}" [(ngModel)]="form.${emailField.id || "email"}" placeholder="${emailField.placeholder ?? ""}" aria-label="${emailField.label}" data-testid="input-email" />
      </label>
      <label class="form-group">
        <span>${passField.label}</span>
        <input name="${passField.id || "password"}" type="password" [(ngModel)]="form.${passField.id || "password"}" placeholder="${passField.placeholder ?? ""}" aria-label="${passField.label}" data-testid="input-password" />
      </label>
      <button type="submit" class="primary-btn" data-testid="button-submit" aria-label="Entrar">Entrar</button>
    </form>
  </div>
</div>`;
  }
  const buildAngularFieldMarkup = (f: Field): string => {
    const inputType = ["text", "number", "email", "password", "date"].includes(f.type) ? f.type : "text";
    if (f.type === "select" && f.options?.length) {
      const opts = f.options.map((o) => `<option value="${o.replace(/"/g, "&quot;")}">${o}</option>`).join("\n            ");
      return `<label class="form-group">
          <span>${f.label}</span>
          <select name="${f.id}" [(ngModel)]="form.${f.id}" aria-label="${f.label}" data-testid="input-${f.id}">
            <option value="">${f.placeholder ?? "Selecione"}</option>${opts}
          </select>
        </label>`;
    }
    if (f.type === "radio" && f.options?.length) {
      const radios = f.options.map((o) => `<label class="flex items-center gap-2"><input type="radio" name="${f.id}" value="${o.replace(/"/g, "&quot;")}" [(ngModel)]="form.${f.id}" /> <span>${o}</span></label>`).join("\n            ");
      return `<label class="form-group"><span>${f.label}</span><div class="flex flex-wrap gap-4">${radios}</div></label>`;
    }
    if (f.type === "checkbox") {
      return `<label class="form-group flex items-center gap-2">
          <input type="checkbox" name="${f.id}" [checked]="form.${f.id} === 'on'" (change)="form.${f.id} = \$event.target.checked ? 'on' : ''" aria-label="${f.label}" data-testid="input-${f.id}" />
          <span>${f.label}</span>
        </label>`;
    }
    if (f.type === "switch") {
      return `<label class="form-group flex items-center justify-between gap-2">
          <span>${f.label}</span>
          <input type="checkbox" role="switch" name="${f.id}" [checked]="form.${f.id} === 'on'" (change)="form.${f.id} = \$event.target.checked ? 'on' : ''" aria-label="${f.label}" data-testid="input-${f.id}" class="h-6 w-11 rounded-full" />
        </label>`;
    }
    return `<label class="form-group">
          <span>${f.label}</span>
          <input name="${f.id}" type="${inputType}" [(ngModel)]="form.${f.id}" placeholder="${f.placeholder ?? ""}" aria-label="${f.label}" data-testid="input-${f.id}" />
        </label>`;
  };
  const formInputs = spec.fields.map(buildAngularFieldMarkup).join("\n");
  const tableCells = spec.fields.map((f) => `<td>{{ item.${f.id} }}</td>`).join("\n");
  const ths = spec.fields.map((f) => `<th>${f.label}</th>`).join("\n");
  const detailRows = spec.fields
    .map((f) => `<div><span class="detail-label">${f.label}</span><p>{{ selectedItem?.${f.id} }}</p></div>`)
    .join("\n");
  return `<div class="app-shell" data-testid="app-shell" role="main">
  <div class="page-header">
    <div><p class="eyebrow">${spec.subtitle}</p><h1>${spec.title}</h1></div>
    <input [(ngModel)]="filter" class="search-input" placeholder="Buscar ${spec.entity.toLowerCase()}..." aria-label="Buscar ${spec.entity.toLowerCase()}" data-testid="input-search" />
  </div>
  <div class="grid">
    @if (selectedItem) {
      <section class="card detail-card" data-testid="section-detail" aria-label="Detalhe do item">
        <div class="card-header flex justify-between items-center">
          <h2>Detalhe</h2>
          <button type="button" class="secondary-btn" (click)="selectedItem = null" data-testid="button-back-detail" aria-label="Voltar para lista">Voltar</button>
        </div>
        <div class="detail-body">${detailRows}</div>
        <div class="form-actions">
          <button type="button" class="secondary-btn" (click)="selectedItem = null" data-testid="button-back">Voltar</button>
          <button type="button" class="primary-btn" (click)="edit(selectedItem)" data-testid="button-edit-detail" aria-label="Editar item">Editar</button>
        </div>
      </section>
    }
    <section class="card" data-testid="section-list" aria-label="Lista de ${spec.entity}">
      <div class="card-header"><p class="eyebrow">Lista</p><h2>${spec.entity}</h2></div>
      <div class="table-wrapper">
        <table role="grid" [attr.aria-label]="'Tabela de ' + entity">
          <thead><tr>${ths}<th>Ações</th></tr></thead>
          <tbody>
            @for (item of filteredItems(); track item.id) {
              <tr data-testid="row-item">
                ${tableCells}
                <td class="actions">
                  <button type="button" (click)="selectedItem = item" data-testid="button-view" aria-label="Ver item">Ver</button>
                  <button type="button" (click)="edit(item)" data-testid="button-edit" aria-label="Editar item">Editar</button>
                  <button type="button" (click)="remove(item.id)" data-testid="button-remove" aria-label="Remover item">Remover</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
    <section class="card" data-testid="section-form" [attr.aria-label]="editingItem ? 'Editar ' + entity : 'Cadastro de ' + entity">
      <div class="card-header">
        <p class="eyebrow">Formulário</p>
        <h2>{{ editingItem ? 'Editar' : 'Cadastro de' }} ${spec.entity}</h2>
      </div>
      <form (ngSubmit)="onSubmit()" class="card-form" data-testid="form-crud" aria-label="Formulário de cadastro">
${formInputs}
        <div class="form-actions">
          @if (editingItem) {
            <button type="button" class="secondary-btn" (click)="resetForm()" data-testid="button-cancel">Cancelar</button>
            <button type="submit" class="primary-btn" data-testid="button-update" aria-label="Atualizar">Atualizar</button>
          } @else {
            <button type="button" class="secondary-btn" (click)="resetForm()" data-testid="button-clear">Limpar</button>
            <button type="submit" class="primary-btn" data-testid="button-save" aria-label="Salvar">Salvar</button>
          }
        </div>
      </form>
    </section>
  </div>
</div>`;
};

const buildAngularComponentTs = (spec: ScreenSpec): string => {
  const formProps = spec.fields.map((f) => `${f.id}: ""`).join("; ");
  const itemType = spec.fields.map((f) => `  ${f.id}: string;`).join("\n");
  const sampleData = [1, 2]
    .map((i) => `    { id: ${i}, ${spec.fields.map((f) => `${f.id}: "${f.label} ${i}"`).join(", ")} }`)
    .join(",\n");
  if (spec.type === "login") {
    const emailId = spec.fields.find((f) => f.id === "email")?.id ?? "email";
    const passId = spec.fields.find((f) => f.type === "password")?.id ?? "password";
    return `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/** Tela gerada pelo EstrelaUI Gerador - Padrão NORTE (UID00001-2026). */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  form = { ${emailId}: '', ${passId}: '' };

  onSubmit() {
    alert('Login enviado: ' + JSON.stringify(this.form, null, 2));
  }
}
`;
  }
  const formInit = spec.fields.map((f) => `${f.id}: ""`).join(", ");
  const formFromItem = spec.fields.map((f) => `${f.id}: String(item.${f.id} ?? '')`).join(", ");
  return `import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Item {
  id: number;
${itemType}
}

/** Tela CRUD gerada pelo EstrelaUI Gerador - Padrão NORTE (UID00001-2026). */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  entity = '${spec.entity.replace(/'/g, "\\'")}';
  items = signal<Item[]>([${sampleData}]);
  form: Record<string, string> = { ${formInit} };
  filter = signal('');
  selectedItem = signal<Item | null>(null);
  editingItem = signal<Item | null>(null);

  filteredItems = computed(() => {
    const q = this.filter().toLowerCase();
    const list = this.items();
    return q ? list.filter((i) => Object.values(i).some((v) => String(v).toLowerCase().includes(q))) : list;
  });

  edit(item: Item) {
    this.editingItem.set(item);
    this.form = { ${formFromItem} };
    this.selectedItem.set(null);
  }

  remove(id: number) {
    this.items.update((list) => list.filter((x) => x.id !== id));
  }

  resetForm() {
    this.form = { ${formInit} };
    this.editingItem.set(null);
  }

  onSubmit() {
    const f = { ...this.form };
    const current = this.editingItem();
    if (current) {
      this.items.update((list) =>
        list.map((i) => (i.id === current.id ? { ...current, ...f } : i))
      );
    } else {
      this.items.update((list) => [{ id: Date.now(), ...f }, ...list]);
    }
    this.resetForm();
    this.selectedItem.set(null);
  }
}
`;
};

const generateAngularProjectZip = async (spec: ScreenSpec) => {
  const slug = slugify(spec.entity);
  const zip = new JSZip();
  const root = zip.folder(`estrelaui-angular-${slug}`);
  if (!root) return;

  root.file(
    "package.json",
    JSON.stringify(
      {
        name: `estrelaui-angular-${slug}`,
        version: "0.0.1",
        scripts: { ng: "ng", start: "ng serve", build: "ng build" },
        dependencies: { "@angular/animations": "~17.3.0", "@angular/common": "~17.3.0", "@angular/compiler": "~17.3.0", "@angular/core": "~17.3.0", "@angular/forms": "~17.3.0", "@angular/platform-browser": "~17.3.0", "@angular/platform-browser-dynamic": "~17.3.0", "rxjs": "~7.8.0", "tslib": "^2.3.0", "zone.js": "~0.14.0" },
        devDependencies: { "@angular-devkit/build-angular": "~17.3.0", "@angular/cli": "~17.3.0", "@angular/compiler-cli": "~17.3.0", "typescript": "~5.4.0" },
      },
      null,
      2
    )
  );

  root.file(
    "angular.json",
    `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "css",
            "assets": [],
            "styles": ["src/styles.css"],
            "scripts": []
          },
          "configurations": { "production": { "budgets": [{"type": "initial","maximumWarning": "500kb","maximumError": "1mb"}], "outputHashing": "all" }, "development": { "optimization": false, "extractLicenses": false, "sourceMap": true } },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": { "production": { "buildTarget": "app:build:production" }, "development": { "buildTarget": "app:build:development" } },
          "defaultConfiguration": "development"
        }
      }
    }
  },
  "defaultProject": "app"
}
`
  );

  root.file("tsconfig.json", `{ "compileOnSave": false, "compilerOptions": { "outDir": "./dist/out-tsc", "strict": true, "noImplicitOverride": true, "noPropertyAccessFromIndexSignature": true, "noImplicitReturns": true, "noFallthroughCasesInSwitch": true, "skipLibCheck": true, "esModuleInterop": true, "sourceMap": true, "declaration": false, "experimentalDecorators": true, "moduleResolution": "bundler", "importHelpers": true, "target": "ES2022", "module": "ES2022", "lib": ["ES2022", "dom"], "useDefineForClassFields": false }, "angularCompilerOptions": { "enableI18nLegacyMessageIdFormat": false, "strictInjectionParameters": true, "strictInputAccessModifiers": true, "strictTemplates": true } }`);
  root.file("tsconfig.app.json", `{ "extends": "./tsconfig.json", "compilerOptions": { "outDir": "./out-tsc/app" }, "files": ["src/main.ts"], "include": ["src/**/*.d.ts"] }`);

  const src = root.folder("src");
  src?.file("index.html", `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${spec.title}</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <app-root></app-root>
</body>
</html>`);
  src?.file("main.ts", `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
`);
  src?.file("styles.css", `* { box-sizing: border-box; }
body { margin: 0; background: var(--bg, #f8fafc); }
` + getThemeCss(spec.theme));

  const app = src?.folder("app");
  app?.file("app.component.ts", buildAngularComponentTs(spec));
  app?.file("app.component.html", buildAngularComponentHtml(spec));
  app?.file("app.component.css", getThemeCss(spec.theme));
  app?.file(
    "app.config.ts",
    `import { ApplicationConfig } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection()],
};
`
  );

  root.file("README.md", `# EstrelaUI Angular - ${spec.title}

Projeto Angular gerado automaticamente pelo EstrelaUI Gerador.

## Padrão

Layout e componentes seguem o **padrão EstrelaUI/NORTE (UID00001-2026)**.

## Como usar

\`\`\`bash
npm install
npm start
\`\`\`

Acesse http://localhost:4200
`);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `estrelaui-angular-${slug}.zip`);
};

const generateBootstrapZip = async (spec: ScreenSpec) => {
  const slug = slugify(spec.entity);
  const zip = new JSZip();
  const root = zip.folder(`estrelaui-bootstrap-${slug}`);
  if (!root) return;
  root.file("index.html", buildBootstrapHtmlFile(spec));
  root.file("README.md", `# EstrelaUI Bootstrap - ${spec.title}\n\nProjeto HTML + Bootstrap gerado automaticamente.\n\n## Como usar\n\n1. Extraia o ZIP.\n2. Abra \`index.html\` no navegador.\n3. Bootstrap via CDN (requer internet).`);
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `estrelaui-bootstrap-${slug}.zip`);
};

const generateHtmlZip = async (spec: ScreenSpec) => {
  const slug = slugify(spec.entity);
  const zip = new JSZip();
  const root = zip.folder(`prototipo-${slug}`);
  if (!root) return;
  root.file("index.html", buildHtmlFile(spec));
  root.file(
    "README.md",
    `# Protótipo: ${spec.title}\n\nArquivo gerado pelo EstrelaUI Gerador.\n\n## Como usar\n\n1. Extraia o ZIP.\n2. Abra \`index.html\` no navegador.\n3. Protótipo funcional para demonstração (dados em memória).`
  );
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `prototipo-${slug}.zip`);
};

const buildAppFileWithApi = (spec: ScreenSpec): string => {
  const slug = slugify(spec.entity);
  const capSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  const typeName = spec.entity.replace(/\s/g, "");
  const formState = spec.fields.map((f) => `    ${f.id}: "",`).join("\n");
  const formInputs = spec.fields
    .map(
      (f) => `          <label className="form-group">
            <span>${f.label}</span>
            <input
              name="${f.id}"
              type="${mapFieldTypeToHtml(f.type)}"
              placeholder="${f.placeholder ?? ""}"
              value={form.${f.id}}
              onChange={handleChange}
              aria-label="${f.label}"
              data-testid="input-${f.id}"
            />
          </label>`
    )
    .join("\n\n");
  const tableHeaders = spec.fields.map((f) => `              <th>${f.label}</th>`).join("\n");
  const tableCells = spec.fields.map((f) => `              <td>{item.${f.id}}</td>`).join("\n");
  return `import { useState, useEffect } from "react";
import { list${capSlug}, create${capSlug}, delete${capSlug} } from "./lib/api";
import type { ${typeName} } from "./types/${slug}";
import "./App.css";

const initialForm = {
${formState}
};

function App() {
  const [items, setItems] = useState<${typeName}[]>([]);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    list${capSlug}().then(setItems).finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(filter.toLowerCase()))
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = await create${capSlug}(form);
    if (created) setItems((prev) => [created, ...prev]);
    setForm(initialForm);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Remover este registro?")) {
      await delete${capSlug}(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="app-shell" data-testid="app-shell" role="main">
      <div className="page-header">
        <div>
          <p className="eyebrow">${spec.subtitle}</p>
          <h1>${spec.title}</h1>
        </div>
        <input
          className="search-input"
          placeholder="Buscar ${spec.entity.toLowerCase()}..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Buscar ${spec.entity.toLowerCase()}"
          data-testid="input-search"
        />
      </div>

      <div className="grid">
        <section className="card" data-testid="section-list" aria-label="Lista de ${spec.entity}">
          <div className="card-header">
            <p className="eyebrow">Lista</p>
            <h2>${spec.entity}</h2>
          </div>
          <div className="table-wrapper">
            {loading ? (
              <p data-testid="loading" role="status" aria-live="polite">Carregando...</p>
            ) : (
              <table role="grid" aria-label="Tabela de ${spec.entity}">
                <thead>
                  <tr>
${tableHeaders}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} data-testid="row-item">
${tableCells}
                      <td className="actions">
                        <button type="button" onClick={() => handleDelete(item.id)} data-testid="button-remove" aria-label="Remover item">
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="card" data-testid="section-form" aria-label="Cadastro de ${spec.entity}">
          <div className="card-header">
            <p className="eyebrow">Formulário</p>
            <h2>Cadastro de ${spec.entity}</h2>
          </div>
          <form className="card-form" onSubmit={handleSubmit} data-testid="form-crud" aria-label="Formulário de cadastro">
${formInputs}
            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={() => setForm(initialForm)} data-testid="button-clear">
                Limpar
              </button>
              <button type="submit" className="primary-btn" data-testid="button-save" aria-label="Salvar">
                Salvar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
`;
};

const generateReactProjectZip = async (spec: ScreenSpec, withBackend: boolean = false) => {
  const slug = slugify(spec.entity);
  const zip = new JSZip();
  const root = zip.folder(`estrelaui-${slug}`);
  if (!root) return;

  const useApi = withBackend && spec.type === "crud";
  const appContent = useApi ? buildAppFileWithApi(spec) : buildAppFile(spec);

  const packageJson = {
    name: `estrelaui-${slug}`,
    private: true,
    version: "0.0.1",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview"
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0"
    },
    devDependencies: {
      "@types/react": "^18.2.66",
      "@types/react-dom": "^18.2.22",
      "@vitejs/plugin-react": "^4.2.0",
      typescript: "^5.3.3",
      vite: "^5.0.2"
    }
  };

  root.file("package.json", JSON.stringify(packageJson, null, 2));
  root.file(
    "tsconfig.json",
    `{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
  );

  root.file(
    "tsconfig.node.json",
    `{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
  );

  root.file(
    "vite.config.ts",
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
`
  );

  root.file(
    "index.html",
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${spec.title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  );

  const src = root.folder("src");
  src?.file(
    "main.tsx",
    `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
  );

  src?.file("App.tsx", appContent);
  src?.file("App.css", getReactAppCss(spec.theme ?? "norte"));

  src?.file(
    "index.css",
    `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #e2e8f0;
}
`
  );

  src?.file("vite-env.d.ts", `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}`);

  if (useApi) {
    const capSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
    const typeName = spec.entity.replace(/\s/g, "");
    const typeDef = spec.fields.map((f) => `  ${f.id}: string;`).join("\n");
    const libFolder = src?.folder("lib");
    const typesFolder = src?.folder("types");
    libFolder?.file(
      "api.ts",
      `const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export type Create${typeName}Input = {
${spec.fields.map((f) => `  ${f.id}: string;`).join("\n")}
};

export async function list${capSlug}(): Promise<import("../types/${slug}").${typeName}[]> {
  const data = await request<import("../types/${slug}").${typeName}[]>("/${slug}");
  return Array.isArray(data) ? data : [];
}

export async function create${capSlug}(input: Create${typeName}Input): Promise<import("../types/${slug}").${typeName} | null> {
  try {
    return await request<import("../types/${slug}").${typeName}>(\`/${slug}\`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch {
    return null;
  }
}

export async function delete${capSlug}(id: number): Promise<void> {
  await request(\`/${slug}/\${id}\`, { method: "DELETE" });
}
`
    );
    typesFolder?.file(
      `${slug}.ts`,
      `export type ${typeName} = {
  id: number;
${typeDef}
};
`
    );
    root.file(
      ".env.example",
      `VITE_API_URL=http://localhost:3000/api`
    );
  }

  root.file(
    "README.md",
    useApi
      ? `# EstrelaUI Front - ${spec.title} (com integração API)

Projeto React gerado automaticamente com integração de backend.

- **Entidade:** ${spec.entity}
- **Tipo:** CRUD com API
- **Campos:** ${spec.fields.map((field) => field.label).join(", ")}
- **Stack:** React + Vite + TypeScript

## Como usar

1. Configure a URL da API
   \`\`\`bash
   cp .env.example .env
   # Edite .env e defina VITE_API_URL com a URL do seu backend
   \`\`\`
2. Instale as dependências
   \`\`\`bash
   npm install
   \`\`\`
3. Execute o projeto
   \`\`\`bash
   npm run dev
   \`\`\`

## Integração com backend

- \`src/lib/api.ts\`: cliente HTTP com funções list, create, delete
- \`src/types/${slug}.ts\`: tipos TypeScript da entidade
- O backend deve expor endpoints REST: GET /api/${slug}, POST /api/${slug}, DELETE /api/${slug}/:id
`
      : `# EstrelaUI Front - ${spec.title}

Projeto React gerado automaticamente a partir da especificação:

- **Entidade:** ${spec.entity}
- **Tipo:** ${spec.type.toUpperCase()}
- **Campos:** ${spec.fields.map((field) => field.label).join(", ")}
- **Stack:** React + Vite + TypeScript

## Como usar

1. Instale as dependências
   \`\`\`bash
   npm install
   \`\`\`
2. Execute o projeto
   \`\`\`bash
   npm run dev
   \`\`\`

O layout base segue os tokens do EstrelaUI e está pronto para evoluir com integrações reais de backend.
`
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `estrelaui-${slug}.zip`);
};

const DEFAULT_PROMPT = "Quero um CRUD de produtos com filtro por status";
const DEFAULT_STACK = "react";

const ensureTags = (raw: string) =>
  Array.from(
    new Set(
      raw
        .split(",")
        .map((item) => item.trim())
        .flatMap((item) => item.split(" "))
        .map((tag) => (tag.startsWith("#") ? tag : tag ? `#${tag}` : ""))
        .filter(Boolean)
    )
  );

const suggestTags = (spec: ScreenSpec) => {
  const base = spec.entity ? spec.entity.replace(/\s+/g, "-").toLowerCase() : "itens";
  return [
    "#crud",
    `#${base}`,
    `#${spec.stack}`,
    "#prototype",
    "#ux"
  ];
};

const migrateSavedSpec = (item: Partial<SavedSpec>, fallbackSpec: ScreenSpec, index: number): SavedSpec => ({
  id: item.id ?? `${Date.now()}-${index}`,
  name: item.name ?? item.spec?.title ?? `Protótipo ${index + 1}`,
  createdAt: item.createdAt ?? Date.now(),
  updatedAt: item.updatedAt ?? item.createdAt ?? Date.now(),
  status: item.status ?? "final",
  tags: item.tags && item.tags.length > 0 ? item.tags : ["#geral"],
  modoPO: item.modoPO ?? false,
  spec: item.spec ?? fallbackSpec,
});

export default function Generator() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedFromNav = location.state as SavedSpec | null;
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [previewSpec, setPreviewSpec] = useState<SavedSpec | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConcluirDialog, setShowConcluirDialog] = useState(false);
  const [showExcluirDialog, setShowExcluirDialog] = useState(false);
  const [specToExcluir, setSpecToExcluir] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [hasGenerated, setHasGenerated] = useState(false);
  const PAGE_SIZE = 6;
  const [prompt, setPrompt] = useState("");
  const [stack, setStack] = useState(DEFAULT_STACK);
  const [spec, setSpec] = useState<ScreenSpec>(() => buildSpecFromPrompt(DEFAULT_PROMPT, DEFAULT_STACK));
  const [editContext, setEditContext] = useState<EditContext | null>(null);
  const [fieldDraft, setFieldDraft] = useState({ label: "", placeholder: "", required: false, pattern: "", patternMessage: "" });
  const [titleDraft, setTitleDraft] = useState({ title: spec.title, subtitle: spec.subtitle });
  const [entityDraft, setEntityDraft] = useState("");
  const [listColumnDraft, setListColumnDraft] = useState("");
  const [savedSpecs, setSavedSpecs] = useState<SavedSpec[]>([]);
  const [saveName, setSaveName] = useState(spec.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isExportingZipBackend, setIsExportingZipBackend] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [modoPrototipo, setModoPrototipo] = useState(false);
  const [useIA, setUseIA] = useState(false);
  const [iaProvider, setIaProvider] = useState<"url" | "openai">("url");
  const [apiUrlIA, setApiUrlIA] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [openaiModel, setOpenaiModel] = useState("gpt-4o-mini");
  const [isInterpretingIA, setIsInterpretingIA] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const promptPlaceholder = DEFAULT_PROMPT;
  const [formError, setFormError] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [lastSaveFeedback, setLastSaveFeedback] = useState<string | null>(null);
  const [activePreviewCodeTab, setActivePreviewCodeTab] = useState<"preview" | "codigo">("preview");
  const [batchMode, setBatchMode] = useState(false);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [suggestedPromptFromFile, setSuggestedPromptFromFile] = useState("");
  const [isReadingBatchFile, setIsReadingBatchFile] = useState(false);
  type BatchItem = { id: string; name: string; spec: ScreenSpec };
  const [batchSpecs, setBatchSpecs] = useState<BatchItem[]>([]);
  const [batchCurrentId, setBatchCurrentId] = useState<string | null>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const codeSnippet = useMemo(() => buildCodeSnippet(spec), [spec]);

  /** Resumo da tela (atualizado pelo painel Ajustar especificação). */
  const livePromptSummary = useMemo(() => {
    const fieldsStr = spec.fields.map((f) => f.label).join(", ");
    const cols = spec.listColumns.join(", ");
    return `${spec.type === "crud" ? "CRUD" : spec.type} de ${spec.entity}. ${spec.title}. ${spec.subtitle}. Campos: ${fieldsStr}. Colunas da lista: ${cols}.`;
  }, [spec]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SavedSpec>[];
        const fallback = buildSpecFromPrompt(DEFAULT_PROMPT, DEFAULT_STACK);
        setSavedSpecs(parsed.map((item, index) => migrateSavedSpec(item, fallback, index)));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSpecs));
  }, [savedSpecs]);

  useEffect(() => {
    setTitleDraft({ title: spec.title, subtitle: spec.subtitle });
    setSaveName(spec.title);
    setTagSuggestions(suggestTags(spec));
  }, [spec.title, spec.subtitle, spec.entity, spec.stack]);

  useEffect(() => {
    if (savedFromNav) {
      setSpec(savedFromNav.spec);
      setPrompt(savedFromNav.spec.prompt);
      setStack(savedFromNav.spec.stack);
      setViewMode("form");
      setEditingId(savedFromNav.id);
      setModoPrototipo(savedFromNav.modoPO);
      setTagsInput(savedFromNav.tags.join(" "));
      setTags(savedFromNav.tags);
      setActiveStep(2);
      setHasGenerated(true);
      setConcluido(savedFromNav.status === "final");
      setActivePreviewCodeTab("preview");
    }
  }, [savedFromNav]);

  useEffect(() => {
    if ((savedFromNav || editingId) && viewMode === "form" && hasGenerated) {
      const t = setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(t);
    }
  }, [savedFromNav, editingId, viewMode, hasGenerated]);

  useEffect(() => {
    setTags(ensureTags(tagsInput));
  }, [tagsInput]);

  useEffect(() => {
    if (modoPrototipo && tags.length === 0) {
      const firstSuggestion = tagSuggestions[0];
      if (firstSuggestion) {
        setTagsInput(firstSuggestion);
      }
    }
    if (!modoPrototipo) {
      setTagsInput((prev) => prev); // keep but not mandatory
    }
  }, [modoPrototipo, tagSuggestions, tags.length]);

  useEffect(() => {
    if (!batchMode || !batchCurrentId) return;
    setBatchSpecs((prev) =>
      prev.map((item) => (item.id === batchCurrentId ? { ...item, spec, name: saveName || item.name } : item))
    );
  }, [batchMode, batchCurrentId, spec, saveName]);

  const filteredSpecs = useMemo(() => {
    if (!searchQuery.trim()) return savedSpecs;
    const q = searchQuery.toLowerCase();
    return savedSpecs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.spec.entity.toLowerCase().includes(q) ||
        s.spec.title.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [savedSpecs, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSpecs.length / PAGE_SIZE));
  const paginatedSpecs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSpecs.slice(start, start + PAGE_SIZE);
  }, [filteredSpecs, page]);

  const handleCadastrarNova = () => {
    setBatchMode(false);
    setBatchFile(null);
    setBatchSpecs([]);
    setBatchCurrentId(null);
    setSuggestedPromptFromFile("");
    setViewMode("form");
    setEditingId(null);
    setSpec((prev) => ({ ...buildSpecFromPrompt(DEFAULT_PROMPT, stack), theme: prev.theme ?? "norte" }));
    setPrompt("");
    setTagsInput("");
    setTags([]);
    setModoPrototipo(false);
    setActiveStep(1);
    setHasGenerated(false);
    setConcluido(false);
    setFormError(null);
    setSaveName("Novo protótipo");
    setActivePreviewCodeTab("preview");
  };

  const handleEditarSpec = (item: SavedSpec) => {
    setSpec(item.spec);
    setPrompt(item.spec.prompt);
    setStack(item.spec.stack);
    setEditingId(item.id);
    setViewMode("form");
    setEditContext(null);
    setModoPrototipo(item.modoPO);
    setTagsInput(item.tags.join(" "));
    setTags(item.tags);
    setActiveStep(item.status === "final" ? 3 : 2);
    setHasGenerated(true);
    setConcluido(item.status === "final");
    setSaveName(item.name);
    setFormError(null);
    setActivePreviewCodeTab("preview");
    logAudit("gerador.tela_editada", { entityId: item.id, entityName: item.name });
  };

  const handleExcluirSpec = (id: string) => {
    setSpecToExcluir(id);
    setShowExcluirDialog(true);
  };

  const confirmExcluir = () => {
    if (specToExcluir) {
      const item = savedSpecs.find((s) => s.id === specToExcluir);
      logAudit("gerador.tela_excluida", { entityId: specToExcluir, entityName: item?.name });
      setSavedSpecs((prev) => prev.filter((s) => s.id !== specToExcluir));
    }
    setShowExcluirDialog(false);
    setSpecToExcluir(null);
  };

  const handlePreviewSpec = (item: SavedSpec) => setPreviewSpec(item);

  const persistSpec = useCallback(
    (
      status: "draft" | "final",
      options?: { auto?: boolean; specOverride?: ScreenSpec; nameOverride?: string; asCopy?: boolean }
    ) => {
      const baseSpec = options?.specOverride ?? spec;
      const now = Date.now();
      const id = options?.asCopy ? (window.crypto?.randomUUID?.() ?? String(now)) : (editingId ?? (window.crypto?.randomUUID?.() ?? String(now)));
      const existing = savedSpecs.find((s) => s.id === id);
      const entry: SavedSpec = {
        id,
        name: options?.asCopy
          ? `copia - ${(options?.nameOverride ?? saveName)?.trim() || baseSpec.title}`
          : (options?.nameOverride ?? saveName)?.trim() || baseSpec.title,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        status,
        tags: tags.length > 0 ? tags : ["#geral"],
        modoPO: modoPrototipo,
        spec: { ...baseSpec, prompt, stack },
      };
      setSavedSpecs((prev) => (options?.asCopy ? [entry, ...prev] : [entry, ...prev.filter((s) => s.id !== id)]));
      if (!options?.asCopy) setEditingId(id);

      const action =
        status === "final"
          ? "gerador.tela_concluida"
          : existing
            ? "gerador.tela_editada"
            : "gerador.tela_criada";

      logAudit(action, {
        entityId: id,
        entityName: entry.name,
        details: options?.auto ? { auto: true } : undefined,
      });

      return entry;
    },
    [editingId, modoPrototipo, prompt, saveName, savedSpecs, spec, stack, tags]
  );

  const handleSaveDraft = useCallback(() => {
    if (!hasGenerated) return;
    setIsSaving(true);
    try {
      persistSpec("draft");
      setLastSaveFeedback(`Rascunho salvo, ${new Date().toLocaleString("pt-BR")}`);
    } finally {
      setIsSaving(false);
    }
  }, [hasGenerated, persistSpec]);

  const handleClearPrompt = () => {
    setPrompt("");
    setHasGenerated(false);
    setActiveStep(1);
    setConcluido(false);
    setTagsInput("");
    setTags([]);
    setFormError(null);
  };

  const handleAddTagSuggestion = (tag: string) => {
    setTagsInput((prev) => {
      const existing = ensureTags(prev);
      if (existing.includes(tag)) return prev;
      return prev ? `${prev} ${tag}` : tag;
    });
  };

  const interpretWithIA = useCallback(
    async (promptText: string, options?: { source?: string; fileName?: string }): Promise<string> => {
      if (iaProvider === "url" && apiUrlIA.trim()) {
        const res = await fetch(apiUrlIA.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptText,
            ...(options?.source && { source: options.source }),
            ...(options?.fileName && { fileName: options.fileName }),
          }),
        });
        if (!res.ok) return promptText;
        const data = (await res.json()) as { interpretedPrompt?: string; prompt?: string };
        const interpreted = data.interpretedPrompt ?? data.prompt;
        return typeof interpreted === "string" && interpreted.trim() ? interpreted.trim() : promptText;
      }
      if (iaProvider === "openai") {
        const key = openaiApiKey.trim() || (import.meta as unknown as { env?: { VITE_OPENAI_API_KEY?: string } }).env?.VITE_OPENAI_API_KEY;
        if (!key) return promptText;
        const systemContent =
          "Você é um assistente de especificação de front-end. Dado o texto do usuário, retorne apenas uma descrição refinada e clara, no mesmo idioma, adequada para gerar uma tela (formulário, CRUD, login, etc.). Sem código, sem explicação: apenas a descrição refinada em um único bloco de texto.";
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: openaiModel,
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: promptText },
            ],
            max_tokens: 1024,
          }),
        });
        if (!res.ok) return promptText;
        const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const content = data.choices?.[0]?.message?.content?.trim();
        return content ?? promptText;
      }
      return promptText;
    },
    [iaProvider, apiUrlIA, openaiApiKey, openaiModel]
  );

  const handleBatchFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBatchFile(file);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      setSuggestedPromptFromFile("");
      setPrompt("");
      setIsReadingBatchFile(false);
      return;
    }
    setIsReadingBatchFile(true);
    try {
      const text = await file.text();
      const truncated = text.length > 4000 ? text.slice(0, 4000) + "\n\n[... texto truncado ...]" : text;
      setSuggestedPromptFromFile(truncated);
      setPrompt(truncated);
      if (useIA && (apiUrlIA.trim() || iaProvider === "openai")) {
        setIsInterpretingIA(true);
        try {
          const interpreted = await interpretWithIA(truncated, { source: "file", fileName: file.name });
          if (interpreted !== truncated) {
            setPrompt(interpreted);
            setSuggestedPromptFromFile(interpreted);
          }
        } finally {
          setIsInterpretingIA(false);
        }
      }
    } finally {
      setIsReadingBatchFile(false);
    }
  };

  const handleGenerate = async () => {
    setFormError(null);
    if (!prompt.trim()) {
      setFormError("Descreva o que a tela deve conter antes de gerar.");
      setActiveStep(1);
      return;
    }
    if (modoPrototipo && tags.length === 0) {
      setFormError("Inclua pelo menos uma tag ao usar o modo Protótipo.");
      setActiveStep(1);
      return;
    }
    setEditContext(null);
    let promptToUse = prompt.trim();
    if (useIA && (apiUrlIA.trim() || iaProvider === "openai")) {
      setIsInterpretingIA(true);
      try {
        const interpreted = await interpretWithIA(promptToUse);
        if (interpreted.trim()) {
          promptToUse = interpreted;
          setPrompt(promptToUse);
        }
      } catch {
        // fallback: usa o prompt original
      } finally {
        setIsInterpretingIA(false);
      }
    }
    const newSpec = buildSpecFromPrompt(promptToUse, stack);
    setSpec((prev) => ({ ...newSpec, theme: prev.theme ?? "norte" }));
    setShowSuccessModal(true);
    setHasGenerated(true);
    setActiveStep(2);
    setConcluido(false);
    setTitleDraft({ title: newSpec.title, subtitle: newSpec.subtitle });
    setSaveName(newSpec.title);
    setTagSuggestions(suggestTags(newSpec));
    if (batchMode) {
      const id = `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setBatchSpecs((prev) => [...prev, { id, name: newSpec.title, spec: newSpec }]);
      setBatchCurrentId(id);
    } else {
      if (modoPrototipo) {
        persistSpec("draft", { auto: true, specOverride: newSpec, nameOverride: newSpec.title });
      } else {
        logAudit("gerador.tela_criada", { entityName: newSpec.entity });
      }
    }
  };

  const handleOpenPreviewInBrowser = () => {
    try {
      localStorage.setItem(PREVIEW_SPEC_KEY, JSON.stringify(spec));
      const url = `${window.location.origin}/gerador/preview`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // fallback: abre o HTML bruto como antes
      const html = buildHtmlFile(spec);
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = codeSnippet;
      ta.setAttribute("readonly", "");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleSelectField = (fieldId: string) => {
    const field = spec.fields.find((current) => current.id === fieldId);
    if (!field) return;
    setEditContext({ type: "field", fieldId });
    setFieldDraft({
      label: field.label,
      placeholder: field.placeholder ?? "",
      required: field.required ?? false,
      pattern: field.pattern ?? "",
      patternMessage: field.patternMessage ?? ""
    });
  };

  const handleSelectTitle = () => {
    setEditContext({ type: "title" });
    setTitleDraft({ title: spec.title, subtitle: spec.subtitle });
  };

  const applyFieldChanges = () => {
    if (editContext?.type !== "field") return;
    setSpec((prev) => {
      const index = prev.fields.findIndex((field) => field.id === editContext.fieldId);
      if (index === -1) return prev;

      const updatedFields = [...prev.fields];
      const oldLabel = updatedFields[index].label;
      updatedFields[index] = {
        ...updatedFields[index],
        label: fieldDraft.label || updatedFields[index].label,
        placeholder: fieldDraft.placeholder || undefined,
        required: fieldDraft.required,
        pattern: fieldDraft.pattern || undefined,
        patternMessage: fieldDraft.patternMessage || undefined
      };

      const updatedColumns = prev.listColumns.map((column) =>
        column === oldLabel ? updatedFields[index].label : column
      );

      return {
        ...prev,
        fields: updatedFields,
        listColumns: updatedColumns
      };
    });
  };

  const applyTitleChanges = () => {
    setSpec((prev) => ({
      ...prev,
      title: titleDraft.title || prev.title,
      subtitle: titleDraft.subtitle || prev.subtitle
    }));
  };

  const applyEntityChanges = () => {
    if (editContext?.type !== "entity") return;
    const next = entityDraft.trim() || spec.entity;
    setSpec((prev) => ({ ...prev, entity: next }));
  };

  const applyListColumnChanges = () => {
    if (editContext?.type !== "listColumn") return;
    setSpec((prev) => {
      const idx = editContext.index;
      const next = [...prev.listColumns];
      next[idx] = listColumnDraft.trim() || next[idx];
      return { ...prev, listColumns: next };
    });
  };

  const moveField = (fromIndex: number, direction: 1 | -1) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= spec.fields.length) return;
    setSpec((prev) => {
      const nextFields = [...prev.fields];
      const [removed] = nextFields.splice(fromIndex, 1);
      nextFields.splice(toIndex, 0, removed);
      const nextCols = [...prev.listColumns];
      if (nextCols.length === prev.fields.length) {
        const [c] = nextCols.splice(fromIndex, 1);
        nextCols.splice(toIndex, 0, c);
      } else {
        const fromLabel = prev.fields[fromIndex].label;
        const toLabel = prev.fields[toIndex].label;
        const fromColIdx = nextCols.indexOf(fromLabel);
        const toColIdx = nextCols.indexOf(toLabel);
        if (fromColIdx !== -1 && toColIdx !== -1) {
          const [c] = nextCols.splice(fromColIdx, 1);
          nextCols.splice(toColIdx, 0, c);
        }
      }
      return { ...prev, fields: nextFields, listColumns: nextCols };
    });
  };

  const moveListColumn = (fromIndex: number, direction: 1 | -1) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= spec.listColumns.length) return;
    setSpec((prev) => {
      const next = [...prev.listColumns];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return { ...prev, listColumns: next };
    });
  };

  const addField = () => {
    setSpec((prev) => ({
      ...prev,
      fields: [...prev.fields, { id: `field-${Date.now()}`, label: "Novo campo", type: "text", placeholder: "" }],
      listColumns: [...prev.listColumns, "Novo campo"]
    }));
  };

  const removeField = (index: number) => {
    setSpec((prev) => {
      const nextFields = prev.fields.filter((_, i) => i !== index);
      const oldLabel = prev.fields[index]?.label;
      const nextCols = oldLabel ? prev.listColumns.filter((c) => c !== oldLabel) : prev.listColumns;
      return { ...prev, fields: nextFields, listColumns: nextCols.length > 0 ? nextCols : prev.listColumns };
    });
  };

  const updateField = (index: number, patch: Partial<Pick<Field, "label" | "placeholder" | "type">>) => {
    setSpec((prev) => {
      const next = prev.fields.map((f, i) => (i === index ? { ...f, ...patch } : f));
      if (patch.label !== undefined) {
        const oldLabel = prev.fields[index]?.label;
        const nextCols = oldLabel ? prev.listColumns.map((c) => (c === oldLabel ? patch.label ?? c : c)) : prev.listColumns;
        return { ...prev, fields: next, listColumns: nextCols };
      }
      return { ...prev, fields: next };
    });
  };

  const addListColumn = () => {
    setSpec((prev) => ({ ...prev, listColumns: [...prev.listColumns, "Nova coluna"] }));
  };

  const removeListColumn = (index: number) => {
    setSpec((prev) => ({ ...prev, listColumns: prev.listColumns.filter((_, i) => i !== index) }));
  };

  const updateListColumn = (index: number, name: string) => {
    setSpec((prev) => ({
      ...prev,
      listColumns: prev.listColumns.map((c, i) => (i === index ? name : c))
    }));
  };

  const handleSaveCurrentSpec = () => {
    if (editContext?.type === "title") applyTitleChanges();
    if (editContext?.type === "field") applyFieldChanges();
    if (editContext?.type === "entity") applyEntityChanges();
    if (editContext?.type === "listColumn") applyListColumnChanges();
    setEditContext(null);
    if (!batchMode) handleSaveDraft();
  };

  const handleLoadSpec = (saved: SavedSpec) => {
    setSpec(saved.spec);
    setPrompt(saved.spec.prompt);
    setStack(saved.spec.stack);
    setEditContext(null);
    setEditingId(saved.id);
    setModoPrototipo(saved.modoPO);
    setTagsInput(saved.tags.join(" "));
    setTags(saved.tags);
    setSaveName(saved.name);
    setActiveStep(saved.status === "final" ? 3 : 2);
    setHasGenerated(true);
    setConcluido(saved.status === "final");
    setViewMode("form");
  };

  const handleDeleteSpec = (id: string) => {
    handleExcluirSpec(id);
  };

  const handleConcluirTela = () => {
    if (!hasGenerated) return;
    if (!batchMode && modoPrototipo && tags.length === 0) {
      setFormError("Inclua pelo menos uma tag antes de concluir o protótipo.");
      return;
    }
    setShowConcluirDialog(true);
  };

  const confirmConcluir = () => {
    setIsSaving(true);
    try {
      if (batchMode && batchSpecs.length > 0) {
        const now = Date.now();
        const newSaved: SavedSpec[] = batchSpecs.map((item) => ({
          id: item.id,
          name: item.name,
          createdAt: now,
          updatedAt: now,
          status: "final" as const,
          tags: ensureTags(""),
          modoPO: modoPrototipo,
          spec: item.spec,
        }));
        setSavedSpecs((prev) => [...prev, ...newSaved]);
        batchSpecs.forEach((item) => logAudit("gerador.tela_concluida", { entityName: item.spec.entity, entityId: item.id }));
      } else {
        persistSpec("final");
      }
      setConcluido(true);
      setActiveStep(3);
      setActivePreviewCodeTab("codigo");
    } finally {
      setIsSaving(false);
    }
    setShowConcluirDialog(false);
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      if (stack === "vue") {
        await generateVueProjectZip(spec);
      } else if (stack === "bootstrap") {
        await generateBootstrapZip(spec);
      } else if (stack === "angular") {
        await generateAngularProjectZip(spec);
      } else {
        await generateReactProjectZip(spec, false);
      }
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleDownloadZipBackend = async () => {
    setIsExportingZipBackend(true);
    try {
      await generateReactProjectZip(spec, true);
    } finally {
      setIsExportingZipBackend(false);
    }
  };

  const handleDownloadPdf = async () => {
    const el = previewRef.current;
    if (!el) return;
    setIsExportingPdf(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const hPage = pdf.internal.pageSize.getHeight();
      const h = Math.min((canvas.height * w) / canvas.width, hPage);
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`${slugify(spec.entity)}-prototipo.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadHtmlZip = async () => {
    setIsExportingHtml(true);
    try {
      await generateHtmlZip(spec);
    } finally {
      setIsExportingHtml(false);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="flex flex-col bg-background">
        <div className="container py-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Telas geradas</h1>
            <p className="text-sm text-muted-foreground">
              Pesquise, visualize, edite ou exclua as telas geradas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm" onClick={handleCadastrarNova}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar nova tela
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setBatchMode(true); setViewMode("form"); setActiveStep(1); setHasGenerated(false); setPrompt(""); setBatchFile(null); setSuggestedPromptFromFile(""); setActivePreviewCodeTab("preview"); }}>
              <Plus className="h-4 w-4 mr-2" />
              Gerar telas em lote
            </Button>
          </div>
        </div>

        <div className="container px-4 pb-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Pesquisa e filtros
              </CardTitle>
              <CardDescription>
                Filtre telas por nome, entidade, título ou tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="search-telas">Pesquisar</Label>
                <Input
                  id="search-telas"
                  placeholder="Ex.: produtos, CRUD, #crud"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {filteredSpecs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Nenhuma tela encontrada." : "Nenhuma tela gerada ainda."}
                </p>
                {!searchQuery && (
                  <Button onClick={handleCadastrarNova}>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar nova tela
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedSpecs.map((item) => (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={item.status === "final" ? "default" : "secondary"}>
                        {item.status === "final" ? "Final" : "Rascunho"}
                      </Badge>
                      <span>{item.spec.entity}</span>
                    </div>
                    <CardDescription className="line-clamp-1">{item.spec.subtitle}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.updatedAt ?? item.createdAt).toLocaleString("pt-BR")}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <Badge key={`${item.id}-tag-${tag}`} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    </CardHeader>
                    <CardContent className="mt-auto flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          try {
                            localStorage.setItem(PREVIEW_SPEC_KEY, JSON.stringify(item.spec));
                            window.open(`${window.location.origin}/gerador/preview`, "_blank", "noopener,noreferrer");
                          } catch {
                            /* ignore */
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver no navegador
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditarSpec(item)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExcluirSpec(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <Dialog open={!!previewSpec} onOpenChange={() => setPreviewSpec(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewSpec?.name}</DialogTitle>
            </DialogHeader>
            {previewSpec && (
              <pre className="rounded-md bg-muted p-4 text-xs whitespace-pre-wrap">
                <code>{JSON.stringify(previewSpec.spec, null, 2)}</code>
              </pre>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={showExcluirDialog} onOpenChange={setShowExcluirDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir tela</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta tela? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmExcluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <div className="container py-6 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary" data-testid="gerador-form-heading">
            Nova geração
          </h1>
          <p className="text-sm text-muted-foreground">
            Gere componentes com IA a partir de descrições em linguagem natural
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (savedFromNav ? navigate("/meus-prototipos") : setViewMode("list"))}
          className="shrink-0 text-primary border-input hover:bg-muted/50"
          data-testid="voltar-listagem-btn"
        >
          {savedFromNav ? "Voltar para protótipos" : "Voltar para listagem"}
        </Button>
      </div>

      <div className="container px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Coluna esquerda: Framework + Descrição + Gerar */}
          <div className="lg:col-span-1 space-y-3">
            <Card className="border shadow-sm">
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Framework</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["react", "vue", "bootstrap"] as const).map((s) => {
                      const Icon = s === "react" ? SiReact : s === "vue" ? SiVuedotjs : SiBootstrap;
                      const label = s === "react" ? "React" : s === "vue" ? "Vue" : "Bootstrap";
                      return (
                        <Button
                          key={s}
                          type="button"
                          variant={stack === s ? "default" : "outline"}
                          size="sm"
                          onClick={() => { setStack(s); setSpec((prev) => ({ ...prev, stack: s })); }}
                          aria-pressed={stack === s}
                          aria-label={`Stack ${label}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-medium">
                    Descreva o componente que deseja criar
                  </Label>
                  <Textarea
                    id="prompt"
                    data-testid="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[140px] resize-y"
                    placeholder="criar um crud de produto"
                    aria-label="Descrição do componente"
                  />
                </div>
                <Button
                  className="w-full"
                  data-testid="gerar-tela-btn"
                  onClick={() => void handleGenerate()}
                  disabled={!prompt.trim() || (modoPrototipo && tags.length === 0) || isInterpretingIA || isReadingBatchFile}
                  aria-label={batchMode ? "Gerar telas" : "Gerar código"}
                >
                  <Sparkles className="h-4 w-4 mr-2" aria-hidden />
                  Gerar Código
                </Button>
              </CardContent>
            </Card>
            {batchMode && (
              <div className="space-y-2" role="group" aria-labelledby="batch-upload-label">
                <Label id="batch-upload-label">Upload de arquivo (opcional)</Label>
                <div className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                  "hover:border-primary hover:bg-primary/5 cursor-pointer"
                )}>
                  <input
                    type="file"
                    accept=".txt,.md,.json,.pdf,application/json,text/plain,text/markdown,application/pdf"
                    onChange={handleBatchFileSelect}
                    className="hidden"
                    id="batch-file-upload"
                    aria-describedby="batch-file-hint"
                  />
                  <label htmlFor="batch-file-upload" className="cursor-pointer block">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden />
                    {batchFile ? (
                      <p className="text-sm text-primary font-medium">{batchFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Arraste um arquivo ou clique para enviar (txt, md, json ou pdf)</p>
                        <p id="batch-file-hint" className="text-xs text-muted-foreground mt-1">A IA pode interpretar o conteúdo se a URL estiver configurada.</p>
                      </>
                    )}
                  </label>
                </div>
                {isReadingBatchFile && <p className="text-sm text-muted-foreground" role="status">Lendo arquivo e interpretando...</p>}
              </div>
            )}
                <Collapsible defaultOpen={false} className="rounded-lg border mt-4">
              <CollapsibleTrigger
                className="flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left text-sm font-medium hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180"
                aria-controls="opcoes-avancadas-content"
                id="opcoes-avancadas-trigger"
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" aria-hidden />
                  Opções avançadas
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform" aria-hidden />
              </CollapsibleTrigger>
              <CollapsibleContent id="opcoes-avancadas-content" aria-labelledby="opcoes-avancadas-trigger" className="px-3 pb-3 pt-0">
                <div className="space-y-4 pt-2 border-t">
                  <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5 min-w-0">
                      <Label htmlFor="modo-prototipo">Modo protótipo (PO / cliente)</Label>
                      <p className="text-xs text-muted-foreground">Interface só para apresentação, sem código.</p>
                    </div>
                    <Switch id="modo-prototipo" checked={modoPrototipo} onCheckedChange={setModoPrototipo} aria-label="Ativar modo protótipo para apresentações" />
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="space-y-0.5 min-w-0">
                      <Label htmlFor="usar-ia">Usar IA para interpretar o prompt</Label>
                      <p className="text-xs text-muted-foreground">Refina a descrição via API (opcional).</p>
                    </div>
                    <Switch id="usar-ia" checked={useIA} onCheckedChange={setUseIA} aria-label="Ativar uso de IA para interpretar o prompt" />
                  </div>

                  {useIA && (
                    <div className="space-y-3 rounded-lg bg-muted/30 p-3">
                      <Label id="ia-config-label">Configuração da IA</Label>
                      <div className="space-y-2" role="group" aria-labelledby="ia-config-label">
                        <div className="space-y-1">
                          <Label htmlFor="ia-provider" className="text-xs">Provedor</Label>
                          <Select value={iaProvider} onValueChange={(v) => setIaProvider(v as "url" | "openai")}>
                            <SelectTrigger id="ia-provider" aria-label="Provedor de IA: URL customizada ou OpenAI">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="url">URL customizada (sua API)</SelectItem>
                              <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {iaProvider === "url" && (
                          <div className="space-y-1">
                            <Label htmlFor="api-url-ia" className="text-xs">URL da API (POST)</Label>
                            <Input
                              id="api-url-ia"
                              value={apiUrlIA}
                              onChange={(e) => setApiUrlIA(e.target.value)}
                              placeholder="https://sua-api.com/interpretar"
                              aria-label="URL da API de IA"
                            />
                            <p className="text-xs text-muted-foreground">
                              Corpo: <code className="rounded bg-muted px-1">{"{ prompt }"}</code>; retorno: <code className="rounded bg-muted px-1">interpretedPrompt</code> ou <code className="rounded bg-muted px-1">prompt</code>.
                            </p>
                          </div>
                        )}
                        {iaProvider === "openai" && (
                          <>
                            <div className="space-y-1">
                              <Label htmlFor="openai-model" className="text-xs">Modelo</Label>
                              <Select value={openaiModel} onValueChange={setOpenaiModel}>
                                <SelectTrigger id="openai-model" aria-label="Modelo OpenAI">
                                  <SelectValue placeholder="Selecione o modelo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gpt-4o-mini">gpt-4o-mini (rápido)</SelectItem>
                                  <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                                  <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                                  <SelectItem value="gpt-4">gpt-4</SelectItem>
                                  <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="openai-api-key" className="text-xs">Chave API (opcional)</Label>
                              <Input
                                id="openai-api-key"
                                type="password"
                                value={openaiApiKey}
                                onChange={(e) => setOpenaiApiKey(e.target.value)}
                                placeholder="sk-... ou VITE_OPENAI_API_KEY no .env"
                                aria-label="Chave da API OpenAI; pode usar variável de ambiente"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {modoPrototipo && (
                    <div className="space-y-2">
                      <Label htmlFor="tags-prototipo">Tags do protótipo</Label>
                      <Input
                        id="tags-prototipo"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="#sistema #sprint #versao"
                        aria-describedby="tags-hint"
                        aria-label="Tags do protótipo (mínimo uma tag)"
                      />
                      <p id="tags-hint" className="text-xs text-muted-foreground">Formato <span className="font-semibold">#nome-da-tag</span>. Mínimo de uma tag.</p>
                      {tagSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tagSuggestions.map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTagSuggestion(tag)}
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {formError && <p className="text-sm text-destructive" role="alert">{formError}</p>}
          </div>

          {/* Coluna direita: Preview | Código */}
          <div className="lg:col-span-2">
            <Tabs
              value={hasGenerated ? activePreviewCodeTab : "preview"}
              onValueChange={(v) => hasGenerated && setActivePreviewCodeTab(v as "preview" | "codigo")}
              className="space-y-3"
            >
              <TabsList className={cn("grid w-full max-w-md", hasGenerated ? "grid-cols-2" : "grid-cols-1")}>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                {hasGenerated && (
                  <TabsTrigger value="codigo" className="flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Código
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="codigo" className="space-y-3 mt-3">
                <Card className="border shadow-sm">
                  <CardContent className="pt-4">
                    <div className="relative">
                      <pre className="rounded-md bg-muted p-4 pr-12 text-xs whitespace-pre-wrap max-h-[60vh] overflow-y-auto font-mono">
                        <code>{codeSnippet}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 shrink-0"
                        onClick={handleCopyCode}
                        disabled={!codeSnippet.trim()}
                        aria-label={codeCopied ? "Copiado!" : "Copiar código"}
                        title={codeCopied ? "Copiado!" : "Copiar código"}
                      >
                        {codeCopied ? (
                          <Check className="h-4 w-4 text-success" aria-hidden />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden />
                        )}
                      </Button>
                    </div>
                    {hasGenerated && (
                      <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t">
                        <Button onClick={handleDownloadZip} disabled={isExportingZip} size="sm">
                          {isExportingZip ? "Gerando..." : "Baixar ZIP"}
                        </Button>
                        {spec.type === "crud" && stack === "react" && (
                          <Button variant="secondary" onClick={handleDownloadZipBackend} disabled={isExportingZipBackend} size="sm">
                            {isExportingZipBackend ? "Gerando..." : "Completar para backend"}
                          </Button>
                        )}
                        <Button variant="outline" onClick={handleDownloadPdf} disabled={isExportingPdf} size="sm">
                          {isExportingPdf ? "Gerando..." : "PDF"}
                        </Button>
                        <Button variant="outline" onClick={handleDownloadHtmlZip} disabled={isExportingHtml} size="sm">
                          {isExportingHtml ? "Gerando..." : "HTML (ZIP)"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="preview" className="space-y-4 mt-3">
        {batchMode && batchSpecs.length > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label className="shrink-0">Selecione a tela</Label>
                <Select
                  value={batchCurrentId ?? batchSpecs[0]?.id ?? ""}
                  onValueChange={(id) => {
                    setBatchCurrentId(id);
                    const item = batchSpecs.find((s) => s.id === id);
                    if (item) {
                      setSpec(item.spec);
                      setSaveName(item.name);
                      setTitleDraft({ title: item.spec.title, subtitle: item.spec.subtitle });
                      setEditContext(null);
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:max-w-xs">
                    <SelectValue placeholder="Selecione a tela" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchSpecs.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  Alterações salvas automaticamente.
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {!hasGenerated ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>Gere a tela no passo 1 para visualizar o preview interativo aqui.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Preencha o prompt no passo <span className="font-semibold">1. Descrever</span> e clique em Gerar tela para continuar.
                </p>
              </CardContent>
            </Card>
        ) : concluido ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Protótipo concluído. Acesse a aba <span className="font-semibold">Código</span> para visualizar e baixar os artefatos.
              </CardContent>
            </Card>
        ) : (
          <div className="flex flex-col gap-4">
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Passo 2 · Preview interativo
                </CardTitle>
                <CardDescription>
                  Preview em tempo real. Ajuste título, campos e colunas no painel &quot;Ajustar especificação&quot; abaixo; a especificação é sincronizada com o código gerado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={previewRef} id="prototype-preview" className="bg-background rounded-lg min-h-[280px]" aria-label="Preview da tela gerada">
                {spec.type === "login" ? (
                <div className="max-w-md">
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle>{spec.title}</CardTitle>
                      {spec.subtitle ? <CardDescription>{spec.subtitle}</CardDescription> : null}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {spec.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          {renderPreviewField(field)}
                        </div>
                      ))}
                      <Button className="w-full" disabled>Entrar</Button>
                    </CardContent>
                  </Card>
                </div>
                ) : (
                  <Tabs defaultValue="list">
                    <TabsList className="mb-4 flex-wrap">
                      <TabsTrigger value="list">Lista</TabsTrigger>
                      <TabsTrigger value="grid">Grade</TabsTrigger>
                      <TabsTrigger value="form">Cadastrar</TabsTrigger>
                      <TabsTrigger value="edit">Editar</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3 rounded-lg border border-transparent p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1 min-w-0 flex-1">
                          <h2 className="text-lg font-semibold">{spec.title}</h2>
                          <p className="text-sm text-muted-foreground">Total de registros: 24</p>
                          <p className="text-xs text-muted-foreground mt-1">Entidade: {spec.entity}</p>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder={`Buscar ${spec.entity.toLowerCase()}...`} className="w-48" readOnly />
                          <Button variant="outline" disabled>Filtrar</Button>
                          <Button disabled>Novo</Button>
                        </div>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {spec.listColumns.map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            {spec.listColumns.map((column) => (
                              <TableCell key={column}>
                                {column === "Status" || column === "Ativo" ? (
                                  <Badge className="bg-success text-success-foreground">Ativo</Badge>
                                ) : (
                                  `${column} 1`
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" disabled>Editar</Button>
                                <Button variant="ghost" size="sm" disabled>Excluir</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  <TabsContent value="grid">
                    <div className="grid gap-4 md:grid-cols-2">
                      {[1, 2, 3, 4].map((index) => (
                        <Card key={index} className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{spec.entity} #{index}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                              Atualizado há 2 dias
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            {spec.fields.slice(0, 3).map((field) => (
                              <div key={field.id} className="flex justify-between text-muted-foreground">
                                <span>{field.label}</span>
                                <span className="font-medium">{field.placeholder ?? "—"}</span>
                              </div>
                            ))}
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" disabled>
                                Ver
                              </Button>
                              <Button variant="outline" size="sm" disabled>
                                Editar
                              </Button>
                              <Button variant="ghost" size="sm" disabled className="text-destructive">
                                Excluir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="form">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Cadastro de {spec.entity}</CardTitle>
                        <CardDescription>Preencha os campos abaixo.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        {spec.fields.map((field) => (
                          <div key={field.id} className="space-y-2">
                            {renderPreviewField(field)}
                          </div>
                        ))}
                        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                          <Button variant="outline" disabled>Cancelar</Button>
                          <Button disabled>Cadastrar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="edit">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Editar {spec.entity}</CardTitle>
                        <CardDescription>Ajuste os dados do registro selecionado.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        {spec.fields.map((field) => (
                          <div key={`edit-${field.id}`} className="space-y-2">
                            {renderPreviewField(field)}
                          </div>
                        ))}
                        <div className="md:col-span-2 flex justify-between gap-2 pt-2">
                          <Button variant="ghost" className="text-destructive" disabled>
                            Remover registro
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="outline" disabled>
                              Cancelar
                            </Button>
                            <Button disabled>Atualizar</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prompt da tela</CardTitle>
                <CardDescription>
                  Prompt informado no passo 1. O resumo abaixo atualiza conforme você edita no painel de ajustes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {spec.prompt ? (
                  <>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Prompt (passo 1)</Label>
                      <p className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">{spec.prompt}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Resumo atual (atualizado ao editar)</Label>
                      <p className="rounded-md bg-muted/50 p-3 text-sm">{livePromptSummary}</p>
                    </div>
                  </>
                ) : (
                  <p className="rounded-md bg-muted/50 p-3 text-sm">{livePromptSummary}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <SlidersHorizontal className="h-4 w-4" />
                  Ajustar especificação
                </CardTitle>
                <CardDescription>
                  Edite título, entidade, campos e colunas da lista. O preview acima atualiza em tempo real.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={spec.title}
                      onChange={(e) => setSpec((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Ex: CRUD de Tarefas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtítulo</Label>
                    <Input
                      value={spec.subtitle}
                      onChange={(e) => setSpec((p) => ({ ...p, subtitle: e.target.value }))}
                      placeholder="Ex: Gerencie cadastros..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entidade</Label>
                    <Input
                      value={spec.entity}
                      onChange={(e) => setSpec((p) => ({ ...p, entity: e.target.value }))}
                      placeholder="Ex: tarefas"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Campos do formulário</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar campo
                    </Button>
                  </div>
                  <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
                    {spec.fields.map((field, idx) => (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex flex-col shrink-0">
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveField(idx, -1)} disabled={idx === 0}>
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveField(idx, 1)} disabled={idx === spec.fields.length - 1}>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            className="min-w-[100px] flex-1"
                            value={field.label}
                            onChange={(e) => updateField(idx, { label: e.target.value })}
                            placeholder="Label"
                          />
                          <Input
                            className="min-w-[100px] flex-1"
                            value={field.placeholder ?? ""}
                            onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                            placeholder="Placeholder"
                          />
                          <Select
                            value={field.type}
                            onValueChange={(v) => {
                              const needsOptions = (v === "select" || v === "radio") && (!field.options || field.options.length === 0);
                              updateField(idx, { type: v, ...(needsOptions ? { options: ["Opção 1", "Opção 2"] } : {}) });
                            }}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="email">E-mail</SelectItem>
                              <SelectItem value="number">Número</SelectItem>
                              <SelectItem value="date">Data</SelectItem>
                              <SelectItem value="select">Combo</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="switch">Switch</SelectItem>
                              <SelectItem value="password">Senha</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeField(idx)} title="Remover campo">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {(field.type === "select" || field.type === "radio") && (
                          <div className="pl-9 flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground shrink-0">Opções:</Label>
                            <Input
                              value={field.options?.join(", ") ?? ""}
                              onChange={(e) => updateField(idx, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                              placeholder="Opção 1, Opção 2, Opção 3"
                              className="flex-1 min-w-0"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {spec.type === "crud" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Colunas da lista</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addListColumn}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar coluna
                      </Button>
                    </div>
                    <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
                      {spec.listColumns.map((col, idx) => (
                        <div key={`${col}-${idx}`} className="flex items-center gap-2">
                          <div className="flex flex-col shrink-0">
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveListColumn(idx, -1)} disabled={idx === 0}>
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveListColumn(idx, 1)} disabled={idx === spec.listColumns.length - 1}>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            className="flex-1 min-w-0"
                            value={col}
                            onChange={(e) => updateListColumn(idx, e.target.value)}
                            placeholder="Nome da coluna"
                          />
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeListColumn(idx)} title="Remover coluna">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações</CardTitle>
                <CardDescription>
                  Rascunho técnico: mantém código, estado e prompt para desenvolvedores. Concluir: finaliza e libera entregáveis (ZIP, PDF, código).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={saveName}
                    onChange={(event) => setSaveName(event.target.value)}
                    placeholder="Nome do protótipo"
                    className="flex-1 min-w-0"
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <Button type="button" variant="outline" size="sm" onClick={() => setViewMode("list")}>
                      <X className="h-4 w-4 mr-2" aria-hidden />
                      Cancelar
                    </Button>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleOpenPreviewInBrowser}
                        disabled={!hasGenerated}
                        aria-label="Abrir preview da tela em nova aba (igual ao HTML do ZIP)"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" aria-hidden />
                        Ver preview no navegador
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSaving || !hasGenerated}
                            className="inline-flex"
                          >
                            <Save className="h-4 w-4 mr-2" aria-hidden />
                            {isSaving ? "Salvando..." : "Salvar"}
                            <ChevronDown className="h-4 w-4 ml-1" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              if (!hasGenerated) return;
                              setIsSaving(true);
                              try {
                                persistSpec("final");
                                setLastSaveFeedback(
                                  modoPrototipo
                                    ? `Protótipo salvo, ${new Date().toLocaleString("pt-BR")}`
                                    : `Tela salva, ${new Date().toLocaleString("pt-BR")}`
                                );
                              } finally {
                                setIsSaving(false);
                              }
                            }}
                            disabled={isSaving || !hasGenerated}
                          >
                            {modoPrototipo ? "Salvar protótipo" : "Salvar tela"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => void (handleSaveDraft())}
                            disabled={isSaving || !hasGenerated}
                          >
                            Salvar rascunho
                          </DropdownMenuItem>
                          {(modoPrototipo && editingId != null) ||
                            (!modoPrototipo && editingId != null && savedFromNav != null) ? (
                            <DropdownMenuItem
                              onClick={() => {
                                if (!hasGenerated) return;
                                setIsSaving(true);
                                try {
                                  persistSpec("draft", { asCopy: true });
                                  setLastSaveFeedback(`Cópia salva, ${new Date().toLocaleString("pt-BR")}`);
                                } finally {
                                  setIsSaving(false);
                                }
                              }}
                              disabled={isSaving || !hasGenerated}
                            >
                              Salvar como cópia
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleConcluirTela}
                        disabled={isSaving || !hasGenerated}
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                  {lastSaveFeedback && (
                    <span className="text-sm text-success font-medium" role="status">
                      {lastSaveFeedback}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent
            className={cn(
              "border-primary/20 shadow-card max-w-md rounded-lg bg-background",
              "[&>button]:bg-transparent [&>button]:text-foreground [&>button]:hover:bg-muted [&>button]:rounded-md [&>button]:right-4 [&>button]:top-4"
            )}
          >
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-success/30 bg-success/10 ring-2 ring-success/20">
                  <CheckCircle className="h-6 w-6 text-success" aria-hidden />
                </div>
                <div className="space-y-1.5 pt-0.5">
                  <DialogTitle className="text-primary text-lg font-bold">
                    Tela gerada com sucesso
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                    Ajuste título, subtítulo, entidade e campos no painel &quot;Ajustar especificação&quot; (reordene colunas e campos com as setas). Use &quot;Salvar rascunho&quot; (rascunho técnico) ou &quot;Concluir tela&quot; para finalizar e acessar os entregáveis.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="flex justify-end pt-6 sm:justify-end">
              <Button onClick={() => setShowSuccessModal(false)}>
                Entendi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showConcluirDialog} onOpenChange={setShowConcluirDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{batchMode && batchSpecs.length > 1 ? "Concluir telas" : "Concluir tela"}</AlertDialogTitle>
              <AlertDialogDescription>
                {batchMode && batchSpecs.length > 0
                  ? `Deseja concluir e ir para os entregáveis? As ${batchSpecs.length} tela(s) serão salvas na listagem.`
                  : "Deseja salvar e concluir esta tela? O protótipo será adicionado à sua listagem."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmConcluir}>
                Concluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
