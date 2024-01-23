import React, { useState } from 'react'

import {
  filterArchivedBets,
  filterPendingNotArchivedBets,
  filterResolvedNotArchivedBets,
} from '../utils'
import { useBetContext } from '../../../providers/AbstractBetProvider'
import { Bet } from '../../../models/Bet'
import Button from '../../../layout/button/Button'
import IconSmoke from '../../../layout/icons/Smoke'
import IconFire from '../../../layout/icons/Fire'
import IconMoon from '../../../layout/icons/Moon'
import { useDialog } from '@/layout/dialog'
import ConfirmationDialog from '@/layout/dialog/ConfirmationDialog'

import EditBetDialog from './ManageBetDialog'
import BetItem from './BetItem'

type TabState = 'pending' | 'resolved' | 'archived'

function BetPanel() {
  const [activeFilter, setActiveFilter] = useState<TabState>('pending')
  const [search, setSearch] = useState<string>()

  const [activeBet, setActiveBet] = useState<Bet | null>(null)
  const [activeBetId, setActiveBetId] = useState<string | number | null>(null)
  const { visible, show, hide } = useDialog()
  const { visible: visibleConfirm, show: showConfirm, hide: hideConfirm } = useDialog()

  const isActiveFilter = (tab: TabState) => {
    return tab === activeFilter ? 'primary' : 'none'
  }

  const { getAll, resolve } = useBetContext()

  const getActiveFilter = () => {
    switch (activeFilter) {
      case 'pending':
        return filterPendingNotArchivedBets
      case 'resolved':
        return filterResolvedNotArchivedBets
      case 'archived':
        return filterArchivedBets
    }
  }

  const searchBets = (bets: Bet[]): Bet[] => {
    return bets.filter(({ title }) =>
      title.toLowerCase().includes(search?.toLowerCase() || '')
    )
  }

  const handleEdit = (bet: Bet) => {
    setActiveBet(bet)
    show()
  }

  const handleEditSave = (bet?: Bet) => {
    hide()
    setActiveBet(null)
    //TODO: Update bet
    console.log(bet)
  }

  const handleDelete = (betId: string | number) => {
    showConfirm()
    setActiveBetId(betId)
  }

  const handleOnDeleted = (result: boolean) => {
    hideConfirm()
    if (result) {
      //TODO: Delete
      console.log('Delete', activeBetId)
    }
    setActiveBetId(null)
  }

  const handleOnArchived = (betId: string | number) => {
    //TODO: Archive bet
    console.log(betId)
  }

  const handleOnRestored = (betId: string | number) => {
    //TODO: Restore bet
    console.log(betId)
  }

  const getBets = searchBets(getActiveFilter()(getAll()))

  return (
    <div>
      {activeBet && (
        <EditBetDialog
          visible={visible}
          variant="edit"
          initialData={activeBet}
          onClose={handleEditSave}
        />
      )}

      <ConfirmationDialog
        visible={visibleConfirm}
        title="Delete bet"
        onClose={handleOnDeleted}>
        <div className="flex flex-col items-center gap-2 my-4">
          <img style={{ height: '160px' }} src="undraw_warn.svg" />
          <p>This operation can&apos;t be undone!</p>
        </div>
      </ConfirmationDialog>

      <div className="flex justify_between">
        <div className="flex gap-1">
          <Button
            color={isActiveFilter('pending')}
            iconStart={<IconSmoke />}
            onClick={() => setActiveFilter('pending')}>
            Pending
          </Button>
          <Button
            color={isActiveFilter('resolved')}
            iconStart={<IconFire />}
            onClick={() => setActiveFilter('resolved')}>
            Resolved
          </Button>
          <Button
            color={isActiveFilter('archived')}
            iconStart={<IconMoon />}
            onClick={() => setActiveFilter('archived')}>
            Archived
          </Button>
        </div>
        <div>
          <input
            placeholder="🔍 Search for bet"
            value={search}
            onChange={(v) => setSearch(v.target.value)}
          />
        </div>
      </div>
      <div className="bet-list my-6">
        {getBets?.map((bet) => (
          <BetItem
            key={bet.id}
            bet={bet}
            onResolve={resolve}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onArchive={!bet.archived ? handleOnArchived : undefined}
            onRestore={bet.archived ? handleOnRestored : undefined}
            readonly={activeFilter !== 'pending'}
          />
        ))}
      </div>
    </div>
  )
}

export default BetPanel
