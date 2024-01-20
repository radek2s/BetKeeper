import React, { useContext, useEffect } from 'react'
import DashboardCreateBetCard from './DashboardCreateBetCard'
import DashboardStatisticsCard from './DashboardStatisticsCard'
import { BetDataContext } from '../../providers/BetDataProvider'
import BetEntry from '../../models/BetEntry'
import BetPanel from './BetPanel'
import OverallSummary from './OverallSummary'
import MonthlySummary from './MonthlySummary'
import InsightBetPanel from './InsightBetPanel'
import { useBetContext } from '../../providers/AbstractBetProvider'

function DashboardView() {
  // TODO: Prepare logic component that will provide bets
  const [bets, setBets] = React.useState<BetEntry[]>([])
  const { getAllBets } = useContext(BetDataContext)
  const { add } = useBetContext()

  useEffect(() => {
    getAllBets().then((res) => setBets(res))
  }, [])

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
