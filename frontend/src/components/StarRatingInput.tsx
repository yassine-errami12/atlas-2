import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRatingInput({
  value,
  onChange,
  size = 24,
  className,
}: {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              "transition-colors cursor-pointer hover:fill-accent hover:text-accent",
              i <= Math.round(value) ? "fill-accent text-accent" : "text-muted-foreground/40",
            )}
            onClick={() => onChange(i)}
            onMouseEnter={() => {}}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
}
