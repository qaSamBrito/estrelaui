import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["sidebar"];
import { 
  Home, FileText, Users, Settings, BarChart, Calendar,
  ChevronLeft, ChevronRight, LogOut, HelpCircle, Bell,
  Folder, FolderOpen, ChevronDown
} from "lucide-react";

export function SidebarShowcase() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("documentos");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "documentos", label: "Documentos", icon: FileText, submenu: [
      { id: "todos", label: "Todos" },
      { id: "recentes", label: "Recentes" },
      { id: "favoritos", label: "Favoritos" },
    ]},
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "relatorios", label: "Relatórios", icon: BarChart },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Menu Lateral"
        description="Menu lateral com ícones e texto - hierarquia visual definida"
        category="Navegação"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="w-full flex gap-4">
          <aside className={cn(
            "h-[400px] border rounded-lg bg-sidebar transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64"
          )}>
            {/* Logo */}
            <div className="h-14 border-b flex items-center px-4 gap-2">
              <div className="h-8 w-8 rounded bg-gradient-corporate flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              {!collapsed && <span className="font-semibold">NORTE</span>}
            </div>
            
            {/* Menu Items */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      setActiveItem(item.id);
                      if (item.submenu) {
                        setOpenSubmenu(openSubmenu === item.id ? null : item.id);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === item.id 
                        ? "bg-sidebar-accent text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.submenu && (
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            openSubmenu === item.id && "rotate-180"
                          )} />
                        )}
                      </>
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {item.submenu && !collapsed && openSubmenu === item.id && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.id}
                          className="w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-sidebar-accent/30"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Footer */}
            <div className="border-t p-2 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/50">
                <HelpCircle className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Ajuda</span>}
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10">
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Sair</span>}
              </button>
            </div>
            
            {/* Collapse Toggle */}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="h-10 border-t flex items-center justify-center hover:bg-sidebar-accent/50"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </aside>
          
          {/* Content Area Preview */}
          <div className="flex-1 border rounded-lg bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Área de conteúdo principal</p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}