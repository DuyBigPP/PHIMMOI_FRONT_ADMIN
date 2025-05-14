import React from "react";
import { cn } from "@/lib/utils";

interface VisuallyHiddenProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * VisuallyHidden component
 * 
 * This component hides content visually, but keeps it accessible to screen readers.
 * Used for providing additional context to assistive technologies while not displaying content visually.
 */
export const VisuallyHidden = ({
  className,
  children,
  ...props
}: VisuallyHiddenProps & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{
        clip: "rect(0, 0, 0, 0)",
      }}
      {...props}
    >
      {children}
    </span>
  );
}; 