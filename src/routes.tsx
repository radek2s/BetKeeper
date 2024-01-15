import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import App from './App'
import BetArchive from './views/BetArchiveList'
import BetPage from './views/BetListPage'
import SettingsPage from './views/Settings'
import DashboardView from './views/dashboard/DashboardView'
import BetKeeperRootView from './Root'

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="list"></Navigate>,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'list',
        element: <BetPage />,
      },
      {
        path: 'archive',
        element: <BetArchive />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/new',
    element: <BetKeeperRootView />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardView />,
      },
    ],
  },
])

export default router
