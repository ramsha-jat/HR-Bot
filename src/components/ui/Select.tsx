import { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = ({ className, children, ...props }: SelectProps) => {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
