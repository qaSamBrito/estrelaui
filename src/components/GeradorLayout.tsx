import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DaltonicToggle } from "@/components/DaltonicToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  FolderOpen,
  Lightbulb,
  Menu,
  ScrollText,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/gerador", label: "Início", icon: LayoutDashboard },
  { path: "/gerador/nova", label: "Nova geração", icon: Sparkles },
  { path: "/meus-prototipos", label: "Meus protótipos", icon: FolderOpen },
  { path: "/componentes", label: "Componentes", icon: Lightbulb },
  { path: "/auditoria", label: "Auditoria", icon: ScrollText },
];

function SidebarContent({
  collapsed,
  onLinkClick,
}: {
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  const location = useLocation();

  return (
    <>
      {/* Logo NORTE - padrão Estrela UI */}
      <div className="h-14 border-b border-sidebar-border flex items-center px-4 gap-2 shrink-0 bg-sidebar">
        <div
          className="h-8 w-8 rounded bg-gradient-corporate flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-white font-bold text-sm">N</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground">NORTE</span>
        )}
      </div>

      {/* Menu principal - Gerador de Telas */}
      <nav
        className="flex-1 p-2 space-y-1 overflow-y-auto"
        aria-label="Gerador de Telas"
      >
        {!collapsed && (
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Gerador de Telas
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/gerador" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Ajuda e Sair (padrão Estrela UI) */}
      <div className="border-t border-sidebar-border p-2 space-y-1 shrink-0">
        <Link
          to="/manual"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full",
            location.pathname === "/manual" && "bg-sidebar-accent text-primary"
          )}
          aria-label="Manual de uso do sistema"
        >
          <HelpCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Ajuda</span>}
        </Link>
        <Link
          to="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
          aria-label="Voltar para a Biblioteca"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </div>
    </>
  );
}

export function GeradorLayout() {
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col bg-sidebar">
                <SidebarContent collapsed={false} onLinkClick={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <Link
              to="/gerador"
              className="flex items-center gap-3 font-semibold"
              aria-label="EstrelaUI NORTE - Início"
            >
              <span className="text-primary">EstrelaUI</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-secondary">NORTE</span>
              <span className="text-xs text-muted-foreground font-normal">
                UID00001-2026
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DaltonicToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className={cn(
            "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 shrink-0",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent
            collapsed={sidebarCollapsed}
            onLinkClick={undefined}
          />
          <button
            type="button"
            className="h-10 border-t border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent/50 text-sidebar-foreground shrink-0 w-full"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </aside>

        <main className="flex-1 min-h-0 overflow-auto w-full" id="main-content">
          <div className="min-h-full w-full py-4 px-4">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
