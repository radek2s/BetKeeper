import React, { useRef } from 'react'
import Dialog from '../../layout/dialog/Dialog'
import Button from '../../layout/button/Button'
import { Bet } from '../../models/Bet'
interface CreateBetDialogProps {
  visible: boolean
  onClose: (bet?: Bet) => void
}
function CreateBetDialog({ visible, onClose }: CreateBetDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const option1Ref = useRef<HTMLInputElement>(null)
  const resolve2Ref = useRef<HTMLInputElement>(null)

  function handelSave(): Bet {
    return {
      id: '',
      title: titleRef.current?.value || '',
      description: titleRef.current?.value || '',
      archived: false,
      option1: option1Ref.current?.value || '',
      option2: resolve2Ref.current?.value || '',
      betResolve: 'pending',
    }
  }

  return (
    <Dialog open={visible}>
      <div className="px-4 py-2">
        <h2 className="py-4">Create Bet</h2>

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
          <input id="bet-resolve-2" ref={resolve2Ref} />
        </div>
      </div>
      <Button onClick={() => onClose(handelSave())}>Save</Button>
      <Button onClick={() => onClose()}>Close</Button>
    </Dialog>
  )
}

export default CreateBetDialog
