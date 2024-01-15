import React, { useContext, useEffect } from 'react'
import DashboardCreateBetCard from './DashboardCreateBetCard'
import DashboardStatisticsCard from './DashboardStatisticsCard'
import { BetDataContext } from '../../providers/BetDataProvider'
import BetEntry from '../../models/BetEntry'
import BetItem from '../../components/BetItem'
function DashboardView() {
  // TODO: Prepare logic component that will provide bets
  const [bets, setBets] = React.useState<BetEntry[]>([])
  const { getAllBets } = useContext(BetDataContext)

  useEffect(() => {
    getAllBets().then((res) => setBets(res))
  }, [])

  return (
    <div className="bet-dashboard grid grid-cols-3 gap-4">
      <div className="bet-dashboard__main col-span-2">
        <div className="grid grid-cols-3 gap-2">
          <DashboardCreateBetCard
            onCreate={() => {
              console.log('')
            }}
          />
          <DashboardStatisticsCard title="Monthly summary" className="dark">
            {/* TODO: Make this as component and provide logic */}
            <div className="statistics primary">
              <span className="statistics__value">+2</span>
              <span className="statistics__label">new bets</span>
            </div>
            <div className="statistics">
              <span className="statistics__value">3</span>
              <span className="statistics__label">resolved</span>
            </div>
            <div className="statistics">
              <span className="statistics__value">18</span>
              <span className="statistics__label">pending</span>
            </div>
          </DashboardStatisticsCard>
          <DashboardStatisticsCard title="Overall status" className="dark">
            <div className="statistics primary">
              <span className="statistics__value">15%</span>
              <span className="statistics__label">pending</span>
            </div>
            <div className="statistics">
              <span className="statistics__value">35%</span>
              <span className="statistics__label">resolved</span>
            </div>
          </DashboardStatisticsCard>
        </div>
        <div className="bet-dashboard__content dashboard-card flex flex-col gap-8">
          <div className="flex justify_between">
            <div>
              {/* TODO: Make a button component to use Icons and active state */}
              <button>Pending</button>
              <button>Resolved</button>
              <button>Archived</button>
            </div>
            <div>
              <input placeholder="Search for bet" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {bets?.map((bet) => (
              <BetItem key={bet.id} bet={bet} />
            ))}
          </div>
        </div>
      </div>
      <DashboardStatisticsCard title="Insight" className="bet-dashboard__sidebar">
        {/* TODO: Make this as component and provide logic */}
        <div>
          <h4>Oldest penging bet:</h4>
        </div>
        <div>
          <h4>Latest resolved:</h4>
        </div>
      </DashboardStatisticsCard>
    </div>
  )
}

export default DashboardView
