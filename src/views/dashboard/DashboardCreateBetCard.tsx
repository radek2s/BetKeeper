import React, { useState } from 'react'
import IconAdd from '../../layout/icons/Add'
import Button from '../../layout/button/Button'
import Dialog from '../../layout/dialog/Dialog'
import CreateBetDialog from './CreateBetDialog'

interface DashboardCreateBetCardProps {
  onCreate: () => void
}
function DashboardCreateBetCard({ onCreate }: DashboardCreateBetCardProps) {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  return (
    <div
      className="dashboard-card dashboard-action-card primary"
      onClick={() => {
        setDialogVisible(true)
      }}>
      <img src="/addBet.png" alt="Add bet graphic" />
      <div className="dashboard-action-card__action" onClick={onCreate}>
        <IconAdd />
        Add new bet
      </div>

      {/* //TODO: Return create bet to service */}
      <Dialog open={dialogVisible}>
        <CreateBetDialog />
        <Button onClick={() => setDialogVisible(false)}>Close</Button>
      </Dialog>
    </div>
  )
}

export default DashboardCreateBetCard
