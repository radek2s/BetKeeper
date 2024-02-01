import React, { useMemo, useState } from 'react'
import clsx from 'clsx'

import { Bet, BetResolveType } from '@/models/Bet'
import { IconChevron, IconClock, IconMoreHorizontal } from '@/layout/icons'
import { useDialog } from '@/layout/dialog'
import { Button } from '@/layout/button'

import ResolveBetDialog from '../ResolveBetDialog'

interface BetItemProps {
  bet: Bet
  readonly?: boolean
  onEdit?: (bet: Bet) => void
  onArchive?: (betId: string | number) => void
  onRestore?: (betId: string | number) => void
  onDelete?: (betId: string | number) => void
  onResolve: (betId: string | number, resolve: BetResolveType) => void
}
/**
 * Bet Item Component
 *
 * Responsible for rendering single Bet Instance details
 * It is layout component that implements buttons
 * but logic should be handled elswhere.
 */
function BetItem({
  bet,
  onResolve,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  readonly = false,
}: BetItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false)
  const { visible, show, hide } = useDialog()

  function isActive(type: BetResolveType) {
    return [type, 'draw'].includes(bet.betResolve) ? 'active' : ''
  }

  function handleResolve(resolve: BetResolveType | undefined) {
    hide()
    if (resolve) onResolve(bet.id, resolve)
  }

  const actionButton = useMemo(() => {
    return onEdit || onArchive || onDelete || onRestore
  }, [onEdit, onArchive, onDelete, onRestore])

  return (
    <div className="bet-item flex flex-col p-3 px-4 rounded-xl shadow">
      <ResolveBetDialog bet={bet} visible={visible} onResolved={handleResolve} />
      <header className="text-sm flex justify-between">
        <div className="flex items-center gap-1" role="contentinfo">
          <IconClock />

          {bet.description}
        </div>

        {actionButton && (
          <div className="menu">
            <div className="menu-button" role="button" aria-label="Bet Menu Button">
              <IconMoreHorizontal />
            </div>
            <div className="menu-content" role="menu">
              <ul>
                {onEdit && (
                  <li role="menuitem" onClick={() => onEdit(bet)}>
                    Edit
                  </li>
                )}
                {onArchive && (
                  <li role="menuitem" onClick={() => onArchive(bet.id)}>
                    Archive
                  </li>
                )}
                {onRestore && (
                  <li role="menuitem" onClick={() => onRestore(bet.id)}>
                    Restore
                  </li>
                )}
                {onDelete && (
                  <li role="menuitem" onClick={() => onDelete(bet.id)}>
                    Delete
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </header>
      <section className="flex flex-col items-center gap-4 my-2">
        <span role="heading" className="text-center">
          {bet.title}
        </span>
      </section>
      {expanded && (
        <section className="bet-item__details flex flex-col gap-2">
          <div className={clsx(['bet-item__option', isActive('person1')])} role="option">
            {bet.option1}
          </div>
          <div className={clsx(['bet-item__option', isActive('person2')])} role="option">
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
        role="button"
        aria-label="expand-button"
        className={clsx(['bet-item__expand', expanded && 'open'])}
        onClick={() => setExpanded((s) => !s)}>
        <IconChevron />
      </div>
    </div>
  )
}

export default BetItem
