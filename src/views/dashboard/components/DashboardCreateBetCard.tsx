import React from 'react'

import CreateBetDialog from './ManageBetDialog'
import { Bet } from '../../../models/Bet'
import useDialog from '../../../layout/dialog/useDialog'
import IconAdd from '../../../layout/icons/Add'

interface DashboardCreateBetCardProps {
  onCreate: (bet: Bet) => void
}
function DashboardCreateBetCard({ onCreate }: DashboardCreateBetCardProps) {
  const { visible, show, hide } = useDialog()

  function handleClose(bet: Bet | undefined) {
    hide()
    if (bet) onCreate(bet)
  }

  return (
    <div className="dashboard-card dashboard-action-card primary" onClick={show}>
      <img src="/addBet.png" alt="Add bet graphic" />
      <div className="dashboard-action-card__action">
        <IconAdd />
        Add new bet
      </div>

      <CreateBetDialog visible={visible} onClose={handleClose} />
    </div>
  )
}

export default DashboardCreateBetCard
