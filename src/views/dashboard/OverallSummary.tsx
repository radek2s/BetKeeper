import React from 'react'
import { Bet } from '../../models/Bet'
import { useBetContext } from '../../providers/AbstractBetProvider'
import DashboardStatisticsCard from './DashboardStatisticsCard'
import { filterPendingBets, filterResolvedBets } from './utils'

function OverallSummary() {
  //TODO: Pass BetList as property instead of betContext
  const { getAll } = useBetContext()

  // eslint-disable-next-line no-magic-numbers
  const pending = Math.round((filterPendingBets(getAll()).length / getAll().length) * 100)

  // eslint-disable-next-line no-magic-numbers
  const resolved = Math.round(
    (filterResolvedBets(getAll()).length / getAll().length) * 100
  )

  return (
    <DashboardStatisticsCard title="Overall status" className="dark">
      <div className="statistics primary">
        <span className="statistics__value">{pending}%</span>
        <span className="statistics__label">pending</span>
      </div>
      <div className="statistics">
        <span className="statistics__value">{resolved}%</span>
        <span className="statistics__label">resolved</span>
      </div>
    </DashboardStatisticsCard>
  )
}

export default OverallSummary