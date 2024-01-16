import clsx from 'clsx'
import React from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  onClose?: () => void
  className?: string
  children: React.ReactNode
}
function Dialog({ open, onClose, children, className }: DialogProps) {
  if (!open) return null

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClose) onClose()
  }

  return createPortal(
    <div className="dialog__backdrop" onClick={handleClose}>
      <div className={clsx(['dialog', className])}>{children}</div>
    </div>,
    document.body
  )
}

export default Dialog
