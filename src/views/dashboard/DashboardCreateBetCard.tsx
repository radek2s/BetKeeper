import React, { ReactNode } from 'react'

interface DashboardCreateBetCardProps {
  onCreate: () => void
}
function DashboardCreateBetCard({ onCreate }: DashboardCreateBetCardProps) {
  return (
    <div
      className="dashboard-card dashboard-action-card primary"
      onClick={() => {
        console.log('Created')
      }}>
      <img src="/addBet.png" alt="Add bet graphic" />
      <div className="dashboard-action-card__action">
        <svg
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
            fill="#111111"
          />
        </svg>
        Add new bet
      </div>
    </div>
  )
}

export default DashboardCreateBetCard
