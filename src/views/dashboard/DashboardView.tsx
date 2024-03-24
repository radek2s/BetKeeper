import React from 'react'

import { useBetContext } from '../../providers/BetProvider'
import {
  BetPanel,
  DashboardCreateBetWidget,
  InsightBetPanel,
  MonthlySummary,
  OverallSummary,
} from './components'
import { useCorbado, useCorbadoSession } from '@corbado/react'
import { Button } from '@/layout/button'

function DashboardView() {
  const { add } = useBetContext()
  const { user } = useCorbadoSession()
  const { logout } = useCorbado()

  const getUsers = async () => {}

  return (
    <div className="grid grid-cols-3 gap-4 bet-dashboard">
      <div className="bet-dashboard__main col-span-2">
        <div>
          Hello! {user.sub}: {user.email}
          <Button onClick={getUsers}>Get users</Button>
          <Button onClick={logout}>Logout</Button>
        </div>
        <div className="bet-dashboard__panel grid grid-cols-3 gap-2">
          <DashboardCreateBetWidget onCreate={add} />
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
