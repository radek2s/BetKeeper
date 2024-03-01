import React from 'react'
import { Outlet } from 'react-router-dom'

import { NotificationProvider } from './providers/NotificationProvider'
import { DataSourceProvider } from './providers/DataSourceProvider'
import Navigation from './layout/navigation/Navigation'

function BetKeeperRootView() {
  return (
    <NotificationProvider>
      <DataSourceProvider>
        <div className="root">
          <div className="root__navigation">
            <h1 className="page-logo">Bet Keeper</h1>
            <Navigation />
          </div>
          <main className="root__outlet">
            <Outlet />
          </main>
        </div>
      </DataSourceProvider>
    </NotificationProvider>
  )
}

export default BetKeeperRootView
