import React from 'react'

import { useBetContext } from '@/providers/BetProvider'

import { filterPendingBets, filterResolvedBets } from '../../utils'
import DashboardStatisticsCard from '../../layout/DashboardStatisticsCard'

function MonthlySummary() {
  const { getAll } = useBetContext()

  const newBets = 0 //TODO: We need to know the creation date from bet interface

  const pending = filterPendingBets(getAll()).length

  const resolved = filterResolvedBets(getAll()).length

  return (
    <DashboardStatisticsCard title="Monthly summary" className="dark">
      <div className="statistics primary">
        <span className="statistics__value">+{newBets}</span>
        <span className="statistics__label">new&nbsp;bets</span>
      </div>
      <div className="statistics">
        <span className="statistics__value">{pending}</span>
        <span className="statistics__label">pending</span>
      </div>
      <div className="statistics">
        <span className="statistics__value">{resolved}</span>
        <span className="statistics__label">resolved</span>
      </div>
    </DashboardStatisticsCard>
  )
}

export default MonthlySummary
