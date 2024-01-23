import React, { useEffect, useRef } from 'react'

import { Bet } from '../../../models/Bet'
import Dialog from '../../../layout/dialog/Dialog'
import Button from '../../../layout/button/Button'

type BetDialogType = 'create' | 'edit'

interface ManageBetDialogProps {
  visible: boolean
  initialData?: Bet
  variant?: BetDialogType
  onClose: (bet?: Bet) => void
}
function ManageBetDialog({
  visible,
  initialData,
  onClose,
  variant = 'create',
}: ManageBetDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const option1Ref = useRef<HTMLInputElement>(null)
  const option2Ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) setInputs(initialData)
  }, [])

  function handelSave(): Bet {
    return {
      id: '',
      title: titleRef.current?.value || '',
      description: descriptionRef.current?.value || '',
      archived: false,
      option1: option1Ref.current?.value || '',
      option2: option2Ref.current?.value || '',
      betResolve: 'pending',
    }
  }

  function setInputs(bet: Bet): void {
    titleRef.current!.value = bet.title
    descriptionRef.current!.value = bet.description
    option1Ref.current!.value = bet.option1
    option2Ref.current!.value = bet.option2
  }

  function getTitle(variant: BetDialogType) {
    return variant === 'create' ? 'Create bet' : 'Edit bet'
  }

  function getActionLabel(variant: BetDialogType) {
    return variant === 'create' ? 'Create' : 'Update'
  }

  return (
    <Dialog open={visible} className="bet-create-dialog">
      <div className="px-4 py-2">
        <h2 className="py-4">{getTitle(variant)}</h2>

        <div className="flex flex-col">
          <label htmlFor="bet-title">Title</label>
          <input id="bet-title" ref={titleRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bet-description">Description</label>
          <input id="bet-description" ref={descriptionRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bet-resolve-1">Resolve 1</label>
          <input id="bet-resolve-1" ref={option1Ref} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bet-resolve-2">Resolve 2</label>
          <input id="bet-resolve-2" ref={option2Ref} />
        </div>
      </div>
      <div className="flex justify-end gap-1">
        <Button color="primary" onClick={() => onClose(handelSave())}>
          {getActionLabel(variant)}
        </Button>
        <Button onClick={() => onClose()}>Close</Button>
      </div>
    </Dialog>
  )
}

export default ManageBetDialog
