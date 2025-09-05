import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const Progress = ({ value, className, ...props }: ProgressProps) => {
  return (
    <div
      className={cn("w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
