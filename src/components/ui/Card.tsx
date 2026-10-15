import { cn } from "@/lib/utils";
import "./ui-surfaces.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

/** A solid token card. Hover changes only the hairline border. */
export function Card({
  className,
  children,
  hoverEffect = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "ui-card",
        hoverEffect && "ui-card--interactive",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
