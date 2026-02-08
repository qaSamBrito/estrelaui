import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import { componentDataById } from "@/lib/componentExport";

const exportData = componentDataById["rangeslider"];

export function RangeSliderShowcase() {
  const [singleValue, setSingleValue] = useState([50]);
  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [stepValue, setStepValue] = useState([25]);

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Slider Simples"
        description="Slider para seleção de um único valor"
        category="Controles"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full max-w-md">
          <Label>Volume: {singleValue[0]}%</Label>
          <Slider
            value={singleValue}
            onValueChange={setSingleValue}
            max={100}
            step={1}
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Range Slider (Dual Thumb)"
        description="Slider com dois thumbs para seleção de intervalo"
        category="Controles"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full max-w-md">
          <Label>Intervalo: {rangeValue[0]} - {rangeValue[1]}</Label>
          <Slider
            value={rangeValue}
            onValueChange={setRangeValue}
            max={100}
            step={1}
          />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Range de Preço"
        description="Slider para faixa de preço com formatação monetária"
        category="Controles"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full max-w-md">
          <div className="flex justify-between">
            <Label>Faixa de Preço</Label>
            <span className="text-sm text-muted-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceRange[0])} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceRange[1])}
            </span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={1000}
            step={10}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>R$ 0</span>
            <span>R$ 1.000</span>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Slider com Steps"
        description="Slider com valores discretos e marcadores"
        category="Controles"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full max-w-md">
          <Label>Qualidade: {stepValue[0]}%</Label>
          <Slider
            value={stepValue}
            onValueChange={setStepValue}
            max={100}
            step={25}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {[0, 25, 50, 75, 100].map((step) => (
              <span key={step}>{step}%</span>
            ))}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Slider Desabilitado"
        description="Estado desabilitado do slider"
        category="Controles"
        codeReact={exportData?.codeReact ?? exportData?.code ?? ""}
        codeVue={exportData?.codeVue ?? exportData?.code ?? ""}
        codeBootstrap={exportData?.codeBootstrap ?? exportData?.code ?? ""}
      >
        <div className="space-y-4 w-full max-w-md opacity-50">
          <Label>Valor bloqueado: 60%</Label>
          <Slider
            value={[60]}
            max={100}
            step={1}
            disabled
          />
        </div>
      </ComponentCard>
    </div>
  );
}
