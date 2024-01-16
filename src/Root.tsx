import React from 'react'
import { Outlet } from 'react-router-dom'
import { DatabaseProvider } from './providers/DatabaseProvider'
import BetDataProvider from './providers/BetDataProvider'
import { NotificationProvider } from './providers/NotificationProvider'
import Navigation from './layout/navigation/Navigation'

function BetKeeperRootView() {
  return (
    <NotificationProvider>
      <DatabaseProvider>
        <BetDataProvider>
          <div className="root">
            <div className="root__navigation">
              <h1 className="page-logo">Bet Keeper</h1>
              <Navigation />
            </div>
            <main className="root__outlet">
              <Outlet />
            </main>
          </div>
        </BetDataProvider>
      </DatabaseProvider>
    </NotificationProvider>
  )
}

export default BetKeeperRootView
