import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const formVariants = cva(
  "space-y-4"
)

export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  asChild?: boolean
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "form"
    return (
      <Comp
        className={cn(formVariants({ className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Form.displayName = "Form"

export { Form, formVariants }
