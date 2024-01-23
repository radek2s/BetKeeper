import React, { ReactNode } from 'react'
import Dialog from './Dialog'
import { Button } from '../button'

interface ConfirmationDialogProps {
  visible: boolean
  title: string
  onClose: (result: boolean) => void
  children?: ReactNode
  labelAccept?: string
  labelCancel?: string
}
function ConfirmationDialog({
  visible,
  title,
  onClose,
  children,
  labelAccept = 'Ok',
  labelCancel = 'Cancel',
}: ConfirmationDialogProps) {
  return (
    <Dialog className="confirmation-dialog" onClose={() => onClose(false)} open={visible}>
      <header>
        <h2>{title}</h2>
      </header>
      <section className="confirmation-dialog__content">{children}</section>
      <footer className="flex justify-center gap-1">
        <Button color="primary" onClick={() => onClose(true)}>
          {labelAccept}
        </Button>
        <Button onClick={() => onClose(false)}>{labelCancel}</Button>
      </footer>
    </Dialog>
  )
}

export default ConfirmationDialog
