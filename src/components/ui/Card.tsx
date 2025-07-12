import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={cn('bg-surface rounded-xl shadow-card p-6 font-sans', className)}>
      {children}
    </div>
  );
}
