import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function PageHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mb-8 flex gap-4 items-center justify-between", className)}
    >
      <div className="text-2xl font-semibold">{title}</div>
      {children && <div>{children}</div>}
    </div>
  );
}
