import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const colorPresets = [
  "#1e3a5f", "#2563eb", "#0891b2", "#059669", "#16a34a",
  "#ca8a04", "#ea580c", "#dc2626", "#db2777", "#9333ea",
  "#6366f1", "#0d9488", "#84cc16", "#f97316", "#ef4444",
];

export function ColorPickerShowcase() {
  const [selectedColor, setSelectedColor] = useState("#1e3a5f");
  const [customColor, setCustomColor] = useState("#1e3a5f");

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Color Picker com Presets"
        description="Seletor de cores com paleta predefinida"
        category="Cores"
        code={`import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const presets = ["#1e3a5f", "#2563eb", "#0891b2", "#059669", "#dc2626", "#9333ea"];
const [color, setColor] = useState("#1e3a5f");

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[200px] justify-start gap-2">
      <div className="h-5 w-5 rounded border" style={{ backgroundColor: color }} />
      {color.toUpperCase()}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[200px]">
    <div className="grid grid-cols-5 gap-2">
      {presets.map((preset) => (
        <button
          key={preset}
          onClick={() => setColor(preset)}
          className={cn(
            "h-8 w-8 rounded-md border-2 transition-all",
            color === preset ? "border-foreground scale-110" : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: preset }}
        />
      ))}
    </div>
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start gap-2">
              <div 
                className="h-5 w-5 rounded border" 
                style={{ backgroundColor: selectedColor }} 
              />
              {selectedColor.toUpperCase()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px]">
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedColor(preset)}
                  className={cn(
                    "h-8 w-8 rounded-md border-2 transition-all",
                    selectedColor === preset ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </ComponentCard>

      <ComponentCard
        title="Color Picker com Input"
        description="Seletor de cores com input hexadecimal e color picker nativo"
        category="Cores"
        code={`import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const [color, setColor] = useState("#1e3a5f");

<div className="flex flex-col gap-4 w-full max-w-xs">
  <div className="flex items-center gap-4">
    <div className="relative">
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div
        className="h-12 w-12 rounded-lg border-2 cursor-pointer"
        style={{ backgroundColor: color }}
      />
    </div>
    <div className="flex-1">
      <Label htmlFor="hex">Código Hex</Label>
      <Input
        id="hex"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="#000000"
      />
    </div>
  </div>
  <div className="h-8 rounded-md" style={{ backgroundColor: color }} />
</div>`}
      >
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-12 h-12"
              />
              <div
                className="h-12 w-12 rounded-lg border-2 cursor-pointer"
                style={{ backgroundColor: customColor }}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="hex">Código Hex</Label>
              <Input
                id="hex"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="h-8 rounded-md" style={{ backgroundColor: customColor }} />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Paleta de Cores do Sistema"
        description="Cores semânticas do design system"
        category="Cores"
        code={`const systemColors = [
  { name: "Primary", class: "bg-primary", text: "text-primary-foreground" },
  { name: "Secondary", class: "bg-secondary", text: "text-secondary-foreground" },
  { name: "Success", class: "bg-success", text: "text-success-foreground" },
  { name: "Warning", class: "bg-warning", text: "text-warning-foreground" },
  { name: "Destructive", class: "bg-destructive", text: "text-destructive-foreground" },
  { name: "Info", class: "bg-info", text: "text-info-foreground" },
];

<div className="grid grid-cols-3 gap-3">
  {systemColors.map((color) => (
    <div
      key={color.name}
      className={\`\${color.class} \${color.text} p-4 rounded-lg text-center font-medium\`}
    >
      {color.name}
    </div>
  ))}
</div>`}
      >
        <div className="grid grid-cols-3 gap-3 w-full max-w-md">
          {[
            { name: "Primary", class: "bg-primary", text: "text-primary-foreground" },
            { name: "Secondary", class: "bg-secondary", text: "text-secondary-foreground" },
            { name: "Success", class: "bg-success", text: "text-success-foreground" },
            { name: "Warning", class: "bg-warning", text: "text-warning-foreground" },
            { name: "Destructive", class: "bg-destructive", text: "text-destructive-foreground" },
            { name: "Info", class: "bg-info", text: "text-info-foreground" },
          ].map((color) => (
            <div
              key={color.name}
              className={`${color.class} ${color.text} p-4 rounded-lg text-center font-medium text-sm`}
            >
              {color.name}
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Color Picker Inline"
        description="Seletor de cor inline sem popover"
        category="Cores"
        code={`import { useState } from "react";

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
const [selected, setSelected] = useState("#3b82f6");

<div className="flex flex-col gap-3">
  <Label>Escolha uma cor</Label>
  <div className="flex gap-2">
    {colors.map((color) => (
      <button
        key={color}
        onClick={() => setSelected(color)}
        className={\`h-8 w-8 rounded-full border-2 transition-all \${
          selected === color ? "border-foreground scale-110 ring-2 ring-offset-2" : "border-transparent"
        }\`}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
  <p className="text-sm text-muted-foreground">Selecionado: {selected}</p>
</div>`}
      >
        <div className="flex flex-col gap-3">
          <Label>Escolha uma cor</Label>
          <div className="flex gap-2">
            {["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  selectedColor === color ? "border-foreground scale-110 ring-2 ring-offset-2" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Selecionado: {selectedColor}</p>
        </div>
      </ComponentCard>
    </div>
  );
}
