import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-neu-outset-sm)] hover:shadow-[var(--glow-primary)] hover:translate-y-[-2px] active:translate-y-0 active:shadow-[var(--shadow-neu-inset-sm)]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[var(--shadow-neu-outset-sm)] hover:shadow-[var(--glow-destructive)] hover:translate-y-[-2px] active:translate-y-0 active:shadow-[var(--shadow-neu-inset-sm)]',
        outline:
          'border-2 border-primary/30 bg-transparent text-foreground shadow-[var(--shadow-neu-outset-sm)] hover:border-primary/60 hover:bg-primary/5 active:shadow-[var(--shadow-neu-inset-sm)]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-[var(--shadow-neu-outset-sm)] hover:bg-secondary/80 hover:translate-y-[-1px] active:translate-y-0 active:shadow-[var(--shadow-neu-inset-sm)]',
        ghost:
          'hover:bg-muted hover:text-foreground active:bg-muted/80',
        link:
          'text-primary underline-offset-4 hover:underline',
        glass:
          'bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] text-foreground hover:shadow-[var(--glow-primary)] hover:border-primary/40 active:shadow-[var(--shadow-neu-inset-sm)]',
        neon:
          'border-2 border-primary bg-transparent text-primary shadow-[var(--glow-primary)] hover:bg-primary/10 hover:shadow-[0_0_35px_oklch(0.78_0.16_195_/_0.5)] active:shadow-[var(--shadow-neu-inset-sm)]',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg gap-1.5 px-4 text-xs',
        lg: 'h-14 rounded-xl px-8 text-base',
        icon: 'size-11 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-14 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
