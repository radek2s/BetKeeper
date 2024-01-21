import React, { useState } from 'react'
import clsx from 'clsx'

import ResolveBetDialog from './ResolveBetDialog'
import { Bet, BetResolveType } from '../../../models/Bet'
import { useDialog } from '../../../layout/dialog'
import { Button } from '../../../layout/button'
import IconChevron from '../../../layout/icons/Chevron'

interface BetItemProps {
  bet: Bet
  readonly?: boolean
  onResolve: (betId: string | number, resolve: BetResolveType) => void
}
function BetItem({ bet, onResolve, readonly = false }: BetItemProps) {
  //TODO: Add read only mode
  const [expanded, setExpanded] = useState<boolean>(false)
  const { visible, show, hide } = useDialog()

  function isActive(type: BetResolveType) {
    return [type, 'draw'].includes(bet.betResolve) ? 'active' : ''
  }

  function handleResolve(resolve: BetResolveType | undefined) {
    hide()
    if (resolve) onResolve(bet.id, resolve)
  }

  return (
    <div className="bet-item flex flex-col p-3 px-4 rounded-xl shadow">
      <ResolveBetDialog bet={bet} visible={visible} onResolved={handleResolve} />
      <header className="text-sm flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12.763"
          height="12.763"
          viewBox="0 0 12.763 12.763">
          <path
            id="time-fill"
            d="M8.381,14.763a6.381,6.381,0,1,1,6.381-6.381A6.381,6.381,0,0,1,8.381,14.763Zm.638-6.381V5.191H7.743V9.658h3.829V8.381Z"
            transform="translate(-2 -2)"
            fill="#5d5d5d"
          />
        </svg>

        {bet.description}
      </header>
      <section className="flex flex-col items-center gap-4 my-2">
        <span className="text-center">{bet.title}</span>
      </section>
      {expanded && (
        <section className="bet-item__details flex flex-col gap-2">
          <div className={clsx(['bet-item__option', isActive('person1')])}>
            {bet.option1}
          </div>
          <div className={clsx(['bet-item__option', isActive('person2')])}>
            {bet.option2}
          </div>
        </section>
      )}

      {!readonly && (
        <div className="flex justify-center my-4">
          <Button color="primary" className="w-2/3 flex justify-center" onClick={show}>
            Resolve
          </Button>
        </div>
      )}

      <div
        className={clsx(['bet-item__expand', expanded && 'open'])}
        onClick={() => setExpanded((s) => !s)}>
        <IconChevron />
      </div>
    </div>
  )
}

export default BetItem
