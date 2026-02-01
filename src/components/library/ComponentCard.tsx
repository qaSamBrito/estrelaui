import React, { useState } from "react";
import { Copy, Check, Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentCardProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
  category?: string;
}

export function ComponentCard({ title, description, code, children, category }: ComponentCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-lg border shadow-card overflow-hidden">
      <div className="p-4 border-b bg-gradient-section">
        <div className="flex items-start justify-between">
          <div>
            {category && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded mb-2">
                {category}
              </span>
            )}
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCode(!showCode)}
              className="h-8 w-8"
            >
              {showCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div className={cn("p-6 bg-card", !showCode && "flex items-center justify-center min-h-[120px]")}>
        {showCode ? (
          <pre className="code-block text-xs overflow-x-auto whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}