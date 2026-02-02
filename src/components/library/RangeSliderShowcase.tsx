import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

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
        code={`import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const [value, setValue] = useState([50]);

<div className="space-y-4 w-full max-w-md">
  <Label>Volume: {value[0]}%</Label>
  <Slider
    value={value}
    onValueChange={setValue}
    max={100}
    step={1}
  />
</div>`}
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
        code={`import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const [range, setRange] = useState([20, 80]);

<div className="space-y-4 w-full max-w-md">
  <Label>Intervalo: {range[0]} - {range[1]}</Label>
  <Slider
    value={range}
    onValueChange={setRange}
    max={100}
    step={1}
  />
</div>`}
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
        code={`import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const [priceRange, setPriceRange] = useState([100, 500]);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

<div className="space-y-4 w-full max-w-md">
  <div className="flex justify-between">
    <Label>Faixa de Preço</Label>
    <span className="text-sm text-muted-foreground">
      {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
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
</div>`}
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
        code={`import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const steps = [0, 25, 50, 75, 100];
const [value, setValue] = useState([25]);

<div className="space-y-4 w-full max-w-md">
  <Label>Qualidade: {value[0]}%</Label>
  <Slider
    value={value}
    onValueChange={setValue}
    max={100}
    step={25}
  />
  <div className="flex justify-between text-xs text-muted-foreground">
    {steps.map((step) => (
      <span key={step}>{step}%</span>
    ))}
  </div>
</div>`}
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
        code={`import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

<div className="space-y-4 w-full max-w-md opacity-50">
  <Label>Valor bloqueado: 60%</Label>
  <Slider
    value={[60]}
    max={100}
    step={1}
    disabled
  />
</div>`}
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
