import React, { useState } from "react";
import { ComponentCard } from "./ComponentCard";
import { Star, Heart, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingShowcase() {
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const [heartRating, setHeartRating] = useState(4);
  const [thumbsRating, setThumbsRating] = useState<"up" | "down" | null>("up");

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Rating com Estrelas"
        description="Componente de avaliação clássico com 5 estrelas"
        category="Avaliação"
        code={`import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);

<div className="flex gap-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      onClick={() => setRating(star)}
      onMouseEnter={() => setHoverRating(star)}
      onMouseLeave={() => setHoverRating(0)}
      className="focus:outline-none transition-transform hover:scale-110"
    >
      <Star
        className={cn(
          "h-8 w-8 transition-colors",
          (hoverRating || rating) >= star
            ? "fill-warning text-warning"
            : "text-muted-foreground"
        )}
      />
    </button>
  ))}
</div>
<p className="text-sm text-muted-foreground mt-2">
  {rating > 0 ? \`Você avaliou: \${rating} estrela\${rating > 1 ? 's' : ''}\` : 'Clique para avaliar'}
</p>`}
      >
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hoverRating || rating) >= star
                      ? "fill-warning text-warning"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {rating > 0 ? `Você avaliou: ${rating} estrela${rating > 1 ? 's' : ''}` : 'Clique para avaliar'}
          </p>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Rating com Corações"
        description="Variação usando ícones de coração"
        category="Avaliação"
        code={`import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const [rating, setRating] = useState(0);

<div className="flex gap-1">
  {[1, 2, 3, 4, 5].map((heart) => (
    <button
      key={heart}
      onClick={() => setRating(heart)}
      className="focus:outline-none transition-transform hover:scale-110"
    >
      <Heart
        className={cn(
          "h-7 w-7 transition-colors",
          rating >= heart
            ? "fill-destructive text-destructive"
            : "text-muted-foreground"
        )}
      />
    </button>
  ))}
</div>`}
      >
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((heart) => (
            <button
              key={heart}
              onClick={() => setHeartRating(heart)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Heart
                className={cn(
                  "h-7 w-7 transition-colors",
                  heartRating >= heart
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Thumbs Up / Down"
        description="Avaliação binária com curtir/descurtir"
        category="Avaliação"
        code={`import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const [rating, setRating] = useState<"up" | "down" | null>(null);

<div className="flex gap-4">
  <Button
    variant={rating === "up" ? "default" : "outline"}
    onClick={() => setRating(rating === "up" ? null : "up")}
    className={cn(rating === "up" && "bg-success hover:bg-success/90")}
  >
    <ThumbsUp className="mr-2 h-4 w-4" />
    Curtir
  </Button>
  <Button
    variant={rating === "down" ? "default" : "outline"}
    onClick={() => setRating(rating === "down" ? null : "down")}
    className={cn(rating === "down" && "bg-destructive hover:bg-destructive/90")}
  >
    <ThumbsDown className="mr-2 h-4 w-4" />
    Não Curtir
  </Button>
</div>`}
      >
        <div className="flex gap-4">
          <button
            onClick={() => setThumbsRating(thumbsRating === "up" ? null : "up")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md border transition-colors",
              thumbsRating === "up"
                ? "bg-success text-success-foreground border-success"
                : "border-input hover:bg-accent"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            Curtir
          </button>
          <button
            onClick={() => setThumbsRating(thumbsRating === "down" ? null : "down")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md border transition-colors",
              thumbsRating === "down"
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "border-input hover:bg-accent"
            )}
          >
            <ThumbsUp className="h-4 w-4 rotate-180" />
            Não Curtir
          </button>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Rating Somente Leitura"
        description="Exibição de avaliação sem interação"
        category="Avaliação"
        code={`import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const rating = 4.5;

<div className="flex items-center gap-2">
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          "h-5 w-5",
          rating >= star
            ? "fill-warning text-warning"
            : rating >= star - 0.5
            ? "fill-warning/50 text-warning"
            : "text-muted-foreground"
        )}
      />
    ))}
  </div>
  <span className="text-sm font-medium">{rating}</span>
  <span className="text-sm text-muted-foreground">(128 avaliações)</span>
</div>`}
      >
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-5 w-5",
                  4.5 >= star
                    ? "fill-warning text-warning"
                    : 4.5 >= star - 0.5
                    ? "fill-warning/50 text-warning"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium">4.5</span>
          <span className="text-sm text-muted-foreground">(128 avaliações)</span>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Rating com Tamanhos"
        description="Variações de tamanho do componente de rating"
        category="Avaliação"
        code={`import { Star } from "lucide-react";

// Pequeno
<div className="flex gap-0.5">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star key={star} className="h-4 w-4 fill-warning text-warning" />
  ))}
</div>

// Médio
<div className="flex gap-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star key={star} className="h-6 w-6 fill-warning text-warning" />
  ))}
</div>

// Grande
<div className="flex gap-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star key={star} className="h-10 w-10 fill-warning text-warning" />
  ))}
</div>`}
      >
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-16">Pequeno:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-16">Médio:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-warning text-warning" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-16">Grande:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-10 w-10 fill-warning text-warning" />
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
