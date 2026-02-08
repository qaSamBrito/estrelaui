import React, { useState, useRef } from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, Image, FileText, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["fileupload"];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "complete" | "error";
}

export function FileUploadShowcase() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([
    { name: "documento.pdf", size: 245000, type: "application/pdf", progress: 100, status: "complete" },
    { name: "imagem.png", size: 1200000, type: "image/png", progress: 65, status: "uploading" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf")) return FileText;
    return File;
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Upload com Drag & Drop"
        description="Área de upload com suporte a arrastar e soltar arquivos"
        category="Upload"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-full max-w-md",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <input ref={inputRef} type="file" multiple className="hidden" />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Clique para enviar</span> ou arraste arquivos
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, PDF até 10MB</p>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Lista de Arquivos com Progresso"
        description="Exibição de arquivos enviados com barra de progresso"
        category="Upload"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-3 w-full max-w-md">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileIcon className="h-8 w-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="h-1 mt-2" />
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {file.status === "complete" && <Check className="h-5 w-5 text-success" />}
                  {file.status === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Upload Compacto"
        description="Botão de upload simples e compacto"
        category="Upload"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex items-center gap-4">
          <Button onClick={() => inputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Enviar Arquivo
          </Button>
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Selecionar
          </Button>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Upload de Imagem com Preview"
        description="Upload de imagem com visualização prévia"
        category="Upload"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => inputRef.current?.click()}
            className="h-32 w-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Image className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-2">Adicionar</span>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
