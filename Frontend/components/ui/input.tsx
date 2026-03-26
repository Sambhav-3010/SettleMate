import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-none border border-border bg-input px-3 py-2 text-sm transition-colors duration-200 outline-none",
        "placeholder:text-muted-foreground/65",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus:border-white/60 focus:bg-card",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
