import React from 'react'
import { useBetContext } from '../../../providers/BetProvider'
import { filterResolvedBets } from '../utils'
import DashboardStatisticsCard from '../layout/DashboardStatisticsCard'
import BetItem from './BetItem'

function InsightBetPanel() {
  const { getAll } = useBetContext()

  const oldest = getAll().at(0)

  const latestResolved = filterResolvedBets(getAll()).at(-1)

  return (
    <DashboardStatisticsCard title="Insight" className="bet-dashboard__sidebar">
      <div className="flex flex-col gap-4 w-full">
        <div>
          {oldest && (
            <>
              <h4>Oldest penging bet:</h4>
              <BetItem readonly bet={oldest} />
            </>
          )}
        </div>
        <div>
          {latestResolved && (
            <>
              <h4>Latest resolved:</h4>
              <BetItem readonly bet={latestResolved} />
            </>
          )}
        </div>
      </div>
    </DashboardStatisticsCard>
  )
}

export default InsightBetPanel
