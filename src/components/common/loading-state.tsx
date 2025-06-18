import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingState = ({ size = "md", text, className }: LoadingStateProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex min-h-96 flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
        aria-label="Loading"
      />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
};

export default LoadingState;
