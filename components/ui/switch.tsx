"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        // Checked state - teal/green
        "data-[state=checked]:bg-[#057C72]",
        // Unchecked state - gray
        "data-[state=unchecked]:bg-[#C9C9C9]",
        // Focus state
        "focus-visible:ring-2 focus-visible:ring-[#057C72] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // Thumb is always white
          "bg-white shadow-md",
          // Position when checked
          "data-[state=checked]:translate-x-[calc(100%+10px)]",
          // Position when unchecked
          "data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }