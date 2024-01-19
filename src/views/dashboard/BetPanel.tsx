import React, { useState } from 'react'
import Button from '../../layout/button/Button'
import IconFire from '../../layout/icons/Fire'
import IconSmoke from '../../layout/icons/Smoke'
import IconMoon from '../../layout/icons/Moon'
import BetItem from '../../components/BetItem'
import { useBetContext } from '../../providers/AbstractBetProvider'
import { Bet } from '../../models/Bet'
import {
  filterArchivedBets,
  filterPendingNotArchivedBets,
  filterResolvedNotArchivedBets,
} from './utils'

type TabState = 'pending' | 'resolved' | 'archived'

function BetPanel() {
  const [activeFilter, setActiveFilter] = useState<TabState>('pending')
  const [search, setSearch] = useState<string>()

  const isActiveFilter = (tab: TabState) => {
    return tab === activeFilter ? 'primary' : 'none'
  }

  const { getAll } = useBetContext()

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

  const getBets = searchBets(getActiveFilter()(getAll()))

  return (
    <div>
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
          <BetItem key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  )
}

export default BetPanel
