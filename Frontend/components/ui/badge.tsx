import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-300 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-neu-outset-sm)] hover:shadow-[var(--glow-primary)]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground shadow-[var(--shadow-neu-outset-sm)] hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-white shadow-[var(--shadow-neu-outset-sm)] hover:shadow-[var(--glow-destructive)]',
        outline:
          'border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/5',
        success:
          'border-transparent bg-[oklch(0.72_0.20_145)] text-[oklch(0.14_0_0)] shadow-[var(--shadow-neu-outset-sm)] hover:shadow-[var(--glow-success)]',
        glass:
          'bg-[var(--glass-bg)] backdrop-blur-lg border-[var(--glass-border)] text-foreground',
        neon:
          'border-primary/50 bg-transparent text-primary shadow-[var(--glow-primary)] hover:bg-primary/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
