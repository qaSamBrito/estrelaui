import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DaltonicToggle } from "@/components/DaltonicToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Sparkles, FolderOpen, Lightbulb, Menu, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/gerador", label: "Início", icon: LayoutDashboard },
  { path: "/gerador/nova", label: "Nova geração", icon: Sparkles },
  { path: "/meus-prototipos", label: "Meus protótipos", icon: FolderOpen },
  { path: "/componentes", label: "Componentes", icon: Lightbulb },
  { path: "/auditoria", label: "Auditoria", icon: ScrollText },
];

function NavLinks({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  const location = useLocation();
  return (
    <nav className={cn("flex flex-col space-y-1 p-4", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gerador de Telas</p>
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
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function GeradorLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-56 p-0">
                <NavLinks onLinkClick={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <Link to="/gerador" className="flex items-center gap-3 font-semibold">
              <span className="text-primary">EstrelaUI</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-secondary">NORTE</span>
              <span className="text-xs text-muted-foreground font-normal">UID00001-2026</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DaltonicToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-muted/30">
          <NavLinks className="flex-1" />
        </aside>

        <main className="flex-1 min-h-0 overflow-auto w-full">
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
