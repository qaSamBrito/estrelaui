import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const DALTONIC_KEY = "estrelaui-daltonic";

export function DaltonicToggle() {
  const [daltonic, setDaltonic] = useState(() => localStorage.getItem(DALTONIC_KEY) === "true");

  useEffect(() => {
    document.documentElement.setAttribute("data-daltonic", daltonic ? "true" : "false");
    localStorage.setItem(DALTONIC_KEY, String(daltonic));
  }, [daltonic]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Acessibilidade</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setDaltonic((d) => !d)} className="gap-2">
          <Eye className="h-4 w-4" />
          Modo daltônico
          {daltonic && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
