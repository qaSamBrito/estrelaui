import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ComponentCard } from "./ComponentCard";

export function SelectShowcase() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Select / Dropdown"
        description="Menu de seleção para escolhas únicas"
        category="Formulários"
        code={`import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="status">Status *</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Selecione o status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ativo">Ativo</SelectItem>
      <SelectItem value="inativo">Inativo</SelectItem>
      <SelectItem value="pendente">Pendente</SelectItem>
    </SelectContent>
  </Select>
</div>`}
      >
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Checkbox"
        description="Para seleções múltiplas ou confirmações"
        category="Formulários"
        code={`import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Aceito os termos e condições</Label>
</div>

// Checkbox marcado
<div className="flex items-center space-x-2">
  <Checkbox id="newsletter" defaultChecked />
  <Label htmlFor="newsletter">Receber newsletter</Label>
</div>`}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="cursor-pointer">
              Aceito os termos e condições
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" defaultChecked />
            <Label htmlFor="newsletter" className="cursor-pointer">
              Receber newsletter
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled" className="cursor-not-allowed opacity-50">
              Opção desabilitada
            </Label>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Radio Group"
        description="Para seleção única entre opções"
        category="Formulários"
        code={`import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

<RadioGroup defaultValue="option-1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-1" id="option-1" />
    <Label htmlFor="option-1">Opção 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-2" id="option-2" />
    <Label htmlFor="option-2">Opção 2</Label>
  </div>
</RadioGroup>`}
      >
        <RadioGroup defaultValue="mensal" className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mensal" id="mensal" />
            <Label htmlFor="mensal" className="cursor-pointer">Plano Mensal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trimestral" id="trimestral" />
            <Label htmlFor="trimestral" className="cursor-pointer">Plano Trimestral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="anual" id="anual" />
            <Label htmlFor="anual" className="cursor-pointer">Plano Anual</Label>
          </div>
        </RadioGroup>
      </ComponentCard>

      <ComponentCard
        title="Switch"
        description="Para alternar entre estados on/off"
        category="Formulários"
        code={`import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Ativar notificações</Label>
</div>`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between w-full max-w-sm">
            <Label htmlFor="notifications" className="cursor-pointer">
              Notificações por email
            </Label>
            <Switch id="notifications" />
          </div>
          <div className="flex items-center justify-between w-full max-w-sm">
            <Label htmlFor="dark-mode" className="cursor-pointer">
              Modo escuro
            </Label>
            <Switch id="dark-mode" defaultChecked />
          </div>
          <div className="flex items-center justify-between w-full max-w-sm">
            <Label htmlFor="disabled-switch" className="cursor-not-allowed opacity-50">
              Opção desabilitada
            </Label>
            <Switch id="disabled-switch" disabled />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}