import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, FileText, Image, Code } from "lucide-react";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["treeview"];

interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
  fileType?: "document" | "image" | "code";
}

const fileTree: TreeNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "1.1",
        name: "components",
        type: "folder",
        children: [
          { id: "1.1.1", name: "Button.tsx", type: "file", fileType: "code" },
          { id: "1.1.2", name: "Card.tsx", type: "file", fileType: "code" },
          { id: "1.1.3", name: "Input.tsx", type: "file", fileType: "code" },
        ],
      },
      {
        id: "1.2",
        name: "pages",
        type: "folder",
        children: [
          { id: "1.2.1", name: "Home.tsx", type: "file", fileType: "code" },
          { id: "1.2.2", name: "About.tsx", type: "file", fileType: "code" },
        ],
      },
      { id: "1.3", name: "App.tsx", type: "file", fileType: "code" },
      { id: "1.4", name: "index.css", type: "file", fileType: "code" },
    ],
  },
  {
    id: "2",
    name: "public",
    type: "folder",
    children: [
      { id: "2.1", name: "logo.png", type: "file", fileType: "image" },
      { id: "2.2", name: "favicon.ico", type: "file", fileType: "image" },
    ],
  },
  { id: "3", name: "README.md", type: "file", fileType: "document" },
  { id: "4", name: "package.json", type: "file", fileType: "code" },
];

function TreeNodeComponent({ 
  node, 
  level = 0, 
  expanded, 
  onToggle, 
  selected, 
  onSelect 
}: { 
  node: TreeNode; 
  level?: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;
  
  const getFileIcon = () => {
    if (node.type === "folder") {
      return isExpanded ? FolderOpen : Folder;
    }
    switch (node.fileType) {
      case "image": return Image;
      case "code": return Code;
      default: return FileText;
    }
  };
  
  const Icon = getFileIcon();
  
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          onSelect(node.id);
          if (node.type === "folder") {
            onToggle(node.id);
          }
        }}
      >
        {node.type === "folder" ? (
          <span className="h-4 w-4 flex items-center justify-center">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        ) : (
          <span className="h-4 w-4" />
        )}
        <Icon className={cn(
          "h-4 w-4",
          node.type === "folder" ? "text-warning" : "text-muted-foreground"
        )} />
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeViewShowcase() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1", "1.1"]));
  const [selected, setSelected] = useState<string | null>("1.1.1");

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Tree View - Explorador de Arquivos"
        description="Estrutura hierárquica navegável para pastas e arquivos"
        category="Hierarquia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-sm border rounded-lg p-2 bg-card">
          {fileTree.map((node) => (
            <TreeNodeComponent
              key={node.id}
              node={node}
              expanded={expanded}
              onToggle={toggleExpand}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Tree View - Categorias"
        description="Estrutura para categorias e subcategorias"
        category="Hierarquia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-sm border rounded-lg p-2 bg-card">
          {[
            {
              id: "1",
              name: "Eletrônicos",
              expanded: true,
              children: [
                { id: "1.1", name: "Smartphones", count: 156 },
                { id: "1.2", name: "Notebooks", count: 89 },
                { id: "1.3", name: "Tablets", count: 45 },
              ],
            },
            {
              id: "2",
              name: "Vestuário",
              expanded: false,
              children: [
                { id: "2.1", name: "Masculino", count: 234 },
                { id: "2.2", name: "Feminino", count: 312 },
              ],
            },
            {
              id: "3",
              name: "Casa & Decoração",
              expanded: false,
              children: [],
            },
          ].map((category) => (
            <div key={category.id}>
              <button className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-accent">
                <div className="flex items-center gap-2">
                  {category.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
              </button>
              {category.expanded && (
                <div className="ml-6 space-y-1">
                  {category.children?.map((sub) => (
                    <button key={sub.id} className="flex items-center justify-between w-full py-1.5 px-3 rounded-md hover:bg-accent text-sm">
                      <span>{sub.name}</span>
                      <span className="text-muted-foreground">({sub.count})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Tree View com Checkboxes"
        description="Seleção múltipla em estrutura hierárquica"
        category="Hierarquia"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full max-w-sm border rounded-lg p-4 bg-card space-y-2">
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" id="all" className="h-4 w-4 rounded border-input" defaultChecked />
            <label htmlFor="all" className="font-medium text-sm">Todos os Departamentos</label>
          </div>
          <div className="ml-6 space-y-2">
            {["Recursos Humanos", "Financeiro", "Tecnologia", "Marketing"].map((dept) => (
              <div key={dept} className="flex items-center gap-2 py-1">
                <input type="checkbox" id={dept} className="h-4 w-4 rounded border-input" defaultChecked />
                <label htmlFor={dept} className="text-sm">{dept}</label>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
