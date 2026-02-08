import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle, Copy } from "lucide-react";

type StackValue = "" | "react" | "vue" | "bootstrap" | "angular";

interface ComponentCardProps {
  title: string;
  description: string;
  code?: string;
  codeReact?: string;
  codeVue?: string;
  codeBootstrap?: string;
  codeAngular?: string;
  children: React.ReactNode;
  category?: string;
}

function getCardCode(
  stack: StackValue,
  code?: string,
  codeReact?: string,
  codeVue?: string,
  codeBootstrap?: string,
  codeAngular?: string
): string {
  if (stack === "") return "";
  if (stack === "react") return codeReact ?? code ?? "";
  if (stack === "vue") return codeVue ?? code ?? "";
  if (stack === "bootstrap") return codeBootstrap ?? code ?? "";
  if (stack === "angular") return codeAngular ?? code ?? "";
  return code ?? "";
}

/** Card com barra própria (Combo, ?, <>, Copiar) e bloco de código só deste item. */
export function ComponentCard({
  title,
  description,
  code,
  codeReact,
  codeVue,
  codeBootstrap,
  codeAngular,
  children,
  category,
}: ComponentCardProps) {
  const [codeStack, setCodeStack] = useState<StackValue>("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const snippet = getCardCode(codeStack, code, codeReact, codeVue, codeBootstrap, codeAngular);
  const hasCode = !!(code ?? codeReact ?? codeVue ?? codeBootstrap ?? codeAngular);

  const handleCopy = useCallback(() => {
    if (snippet) {
      void navigator.clipboard.writeText(snippet);
    }
  }, [snippet]);

  const toolbar = hasCode ? (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Select value={codeStack || " "} onValueChange={(v) => setCodeStack((v === " " ? "" : v) as StackValue)}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">Selecione</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="bootstrap">Bootstrap</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectContent>
      </Select>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Como usar">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-md max-h-[80vh] overflow-y-auto" align="end">
          <div className="space-y-4">
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        title="Copiar código"
        onClick={handleCopy}
        disabled={!snippet}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  ) : null;

  return (
    <div className="bg-card rounded-lg border shadow-card overflow-hidden">
      <div className="p-4 border-b bg-gradient-section">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {category && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded mb-2">
                {category}
              </span>
            )}
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {toolbar && <div className="flex-shrink-0">{toolbar}</div>}
        </div>
      </div>
      <div className={cn("p-6 bg-card flex items-center justify-center min-h-[120px]")}>
        <div className="flex flex-wrap gap-4 items-center justify-center w-full">
          {children}
        </div>
      </div>
      {hasCode && snippet && (
        <div className="border-t bg-muted/20">
          <div className="p-4">
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm text-foreground overflow-x-auto">
              <code>{snippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}