import React from 'react'

import { useBetContext } from '../../providers/AbstractBetProvider'
import {
  BetPanel,
  DashboardCreateBetCard,
  InsightBetPanel,
  MonthlySummary,
  OverallSummary,
} from './components'

function DashboardView() {
  const { add } = useBetContext()

  return (
    <div className="bet-dashboard grid grid-cols-3 gap-4">
      <div className="bet-dashboard__main col-span-2">
        <div className="grid grid-cols-3 gap-2">
          <DashboardCreateBetCard onCreate={add} />
          <MonthlySummary />
          <OverallSummary />
        </div>
        <div className="bet-dashboard__content dashboard-card flex flex-col gap-8">
          <BetPanel />
        </div>
      </div>
      <InsightBetPanel />
    </div>
  )
}

export default DashboardView
