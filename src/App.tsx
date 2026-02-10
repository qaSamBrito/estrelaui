import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { GeradorLayout } from "@/components/GeradorLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ComponentLibrary from "./pages/ComponentLibrary";
import Index from "./pages/Index";
import ExampleForm from "./pages/ExampleForm";
import NotFound from "./pages/NotFound";
import Generator from "./pages/Generator";
import MeusPrototipos from "./pages/MeusPrototipos";
import Componentes from "./pages/Componentes";
import Auditoria from "./pages/Auditoria";
import GeradorInicial from "./pages/GeradorInicial";
import GeradorPreview from "./pages/GeradorPreview";
import Manual from "./pages/Manual";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="estrelaui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ComponentLibrary />} />
            <Route path="/formulario" element={<Index />} />
            <Route path="/exemplo" element={<ExampleForm />} />
            <Route path="gerador/preview" element={<GeradorPreview />} />
            <Route element={<GeradorLayout />}>
              <Route path="gerador/nova" element={<ErrorBoundary><Generator /></ErrorBoundary>} />
              <Route path="gerador" element={<GeradorInicial />} />
              <Route path="meus-prototipos" element={<MeusPrototipos />} />
              <Route path="componentes" element={<Componentes />} />
              <Route path="auditoria" element={<Auditoria />} />
              <Route path="manual" element={<Manual />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;