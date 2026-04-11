'use client'

import * as React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(184,255,71,0.4)] hover:-translate-y-0.5',
        secondary: 'bg-secondary text-secondary-foreground hover:shadow-[0_0_20px_rgba(74,247,255,0.4)] hover:-translate-y-0.5',
        ghost: 'bg-transparent border border-white/20 text-white hover:border-white hover:bg-white/5',
        glass: 'bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20',
        danger: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        default: 'h-12 px-8 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Slottable>{children}</Slottable>
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
