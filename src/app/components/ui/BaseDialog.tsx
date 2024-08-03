import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React from "react"

interface IBaseDialogProps {
  trigger: React.ReactNode,
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  footer?: React.ReactNode
}

export function BaseDialog({trigger, children, title, description, className, footer}: IBaseDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${className}`}>
        <DialogHeader>
          {
            title && (  
              <DialogTitle>
                {title}
              </DialogTitle>
            )
          }
          {
            description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )
          }
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-start">
          {
            footer && (
              footer
            )
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
