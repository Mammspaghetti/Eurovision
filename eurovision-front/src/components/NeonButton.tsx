import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "pink" | "blue";
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary/20 border-primary hover:bg-primary/30 text-primary-foreground box-glow",
      pink: "bg-accent/20 border-accent hover:bg-accent/30 text-accent-foreground box-glow-pink",
      blue: "bg-secondary/20 border-secondary hover:bg-secondary/30 text-secondary-foreground",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative px-8 py-3 rounded-lg border font-display font-semibold text-lg",
          "transition-all duration-300 active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";
export default NeonButton;
