// @/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[--background]",
  {
    variants: {
      variant: {
        // Solid gold button
        default:
          "bg-[--primary] text-[--primary-foreground] hover:bg-[color-mix(in_oklch,var(--primary) 90%,black)]",

        // Subtle outline that *doesn't* disappear on dark hover
        outline:
          "border border-[--border] text-[--foreground] bg-transparent hover:bg-[color-mix(in_oklch,var(--muted) 35%,transparent)] hover:text-[--foreground]",

        // Ghost keeps text visible and adds soft hover surface
        ghost:
          "text-[--muted-foreground] hover:text-[--foreground] hover:bg-[color-mix(in_oklch,var(--muted) 25%,transparent)]",

        secondary:
          "bg-[--secondary] text-[--secondary-foreground] hover:bg-[color-mix(in_oklch,var(--secondary) 90%,black)]",

        destructive:
          "bg-[--destructive] text-[--destructive-foreground] hover:bg-[color-mix(in_oklch,var(--destructive) 90%,black)]",
        link: "text-[--primary] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button, buttonVariants }