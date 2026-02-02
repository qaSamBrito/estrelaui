import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function DateTimeShowcase() {
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });
  const [time, setTime] = useState("09:00");

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Date Picker"
        description="Seletor de data com calendário popup"
        category="Data & Hora"
        code={`import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const [date, setDate] = useState<Date>();

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
      className="pointer-events-auto"
    />
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </ComponentCard>

      <ComponentCard
        title="Time Picker"
        description="Seletor de hora com input nativo"
        category="Data & Hora"
        code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

const [time, setTime] = useState("09:00");

<div className="flex items-center gap-2">
  <div className="relative">
    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="pl-10 w-[150px]"
    />
  </div>
</div>`}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10 w-[150px]"
            />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Date Range Picker"
        description="Seletor de intervalo de datas"
        category="Data & Hora"
        code={`import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
  from: undefined,
  to: undefined,
});

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {dateRange.from ? (
        dateRange.to ? (
          \`\${format(dateRange.from, "dd/MM/yyyy")} - \${format(dateRange.to, "dd/MM/yyyy")}\`
        ) : (
          format(dateRange.from, "dd/MM/yyyy")
        )
      ) : (
        "Selecione um período"
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      initialFocus
      className="pointer-events-auto"
    />
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[320px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                "Selecione um período"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange.from ? dateRange as { from: Date; to?: Date } : undefined}
              onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
              numberOfMonths={2}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </ComponentCard>

      <ComponentCard
        title="Date Time Picker Combinado"
        description="Seletor de data e hora em um único componente"
        category="Data & Hora"
        code={`import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const [date, setDate] = useState<Date>();
const [time, setTime] = useState("09:00");

<div className="flex gap-2">
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Data"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="pointer-events-auto" />
    </PopoverContent>
  </Popover>
  <div className="relative">
    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-10 w-[130px]" />
  </div>
</div>`}
      >
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10 w-[130px]"
            />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
