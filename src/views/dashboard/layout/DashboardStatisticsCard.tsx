import React, { ReactNode } from 'react'

interface DashboardStatisticsCardProps {
  title: string
  children: ReactNode
  className?: string
}
function DashboardStatisticsCard({
  title,
  children,
  className,
}: DashboardStatisticsCardProps) {
  return (
    <div className={`dashboard-card dashboard-statistics-card ${className}`}>
      <h3 className="dashboard-statistics-card__title">{title}</h3>
      <div className="dashboard-statistics-card__content">{children}</div>
    </div>
  )
}

export default DashboardStatisticsCard
