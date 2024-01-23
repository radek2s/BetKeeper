import React, { ChangeEvent, useState } from 'react'
import clsx from 'clsx'

import { Bet, BetResolveType } from '../../../models/Bet'
import { Dialog } from '../../../layout/dialog'
import { Button } from '../../../layout/button'
interface ResolveBetDialogProps {
  bet: Bet
  visible: boolean
  onResolved: (resolveStatus?: BetResolveType) => void
}
function ResolveBetDialog({ bet, visible, onResolved }: ResolveBetDialogProps) {
  const [winner, setWinner] = useState<BetResolveType>('pending')

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setWinner(e.target.value as BetResolveType)
  }

  function isSelected(type: BetResolveType) {
    return [type, 'draw'].includes(winner) ? 'selected' : ''
  }

  function resolve() {
    if (winner === 'pending') return
    onResolved(winner)
  }

  return (
    <Dialog open={visible} className="bet-resolve-dialog">
      <div>
        <h2>Resolve Bet</h2>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-center">{bet.title}</h4>
        <p className="text-center text-sm">{bet.description}</p>
        <div className="flex w-full gap-2 my-4 justify-center">
          <div
            className={clsx([
              'option-item w-full flex items-center justify-center',
              isSelected('person1'),
            ])}>
            {bet.option1}
          </div>
          <div
            className={clsx([
              'option-item w-full flex items-center justify-center',
              isSelected('person2'),
            ])}>
            {bet.option2}
          </div>
        </div>
        <div className="flex flex-col">
          <label>Choose winner:</label>
          <select onChange={handleChange} value={winner}>
            <option value="pending" disabled>
              -
            </option>
            <option value="person1">Person 1</option>
            <option value="person2">Person 2</option>
            <option value="draw">Draw</option>
          </select>
        </div>
        <div className="flex justify-end gap-1 my-1">
          <Button color="primary" onClick={resolve}>
            Save
          </Button>
          <Button onClick={() => onResolved()}>Close</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ResolveBetDialog
