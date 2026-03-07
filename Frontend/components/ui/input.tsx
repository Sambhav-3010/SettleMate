import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        'h-12 w-full min-w-0 rounded-xl border-2 border-border/50 bg-background px-4 py-3 text-base transition-all duration-300 outline-none',
        // Neumorphic inset shadow
        'shadow-[var(--shadow-neu-inset-sm)]',
        // Placeholder
        'placeholder:text-muted-foreground/50',
        // File input
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        // Focus states - Neon glow
        'focus:border-primary/60 focus:shadow-[var(--glow-primary),var(--shadow-neu-inset-sm)]',
        'focus:bg-background',
        // Selection
        'selection:bg-primary/20 selection:text-foreground',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid states
        'aria-invalid:border-destructive/60 aria-invalid:shadow-[var(--glow-destructive),var(--shadow-neu-inset-sm)]',
        // Dark mode
        'dark:bg-input/30 dark:border-border/30',
        'md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
