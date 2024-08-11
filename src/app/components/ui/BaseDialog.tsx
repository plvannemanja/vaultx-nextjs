import {
  Dialog,
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

export function BaseDialog({ trigger, children, title, description, className, footer }: IBaseDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={`max-w-2xl ${className}`}>
        <div className="w-full overflow-x-hidden">
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
          <div className="w-full">
            {children}
          </div>
          <DialogFooter className="sm:justify-start">
            {
              footer && (
                footer
              )
            }
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
