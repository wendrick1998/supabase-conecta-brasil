
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-vendah-purple/10 text-vendah-purple hover:bg-vendah-purple/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-vendah-neon/10 text-vendah-neon",
        warning: "border-transparent bg-orange-400/20 text-orange-400",
        info: "border-transparent bg-vendah-blue/10 text-vendah-blue",
        count: "border-transparent bg-text-muted text-white text-xs rounded-full px-2",
        open: "border-transparent bg-vendah-purple/10 text-vendah-purple font-medium px-3 py-1 rounded-full",
        answered: "border-transparent bg-vendah-neon/10 text-vendah-neon font-medium px-3 py-1 rounded-full",
        closed: "border-transparent bg-text-muted/20 text-text-muted font-medium px-3 py-1 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
