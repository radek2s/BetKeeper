import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'

import BetKeeperRootView from './Root'
import DashboardView from './views/dashboard/DashboardView'
import SettingsView from './views/settings/SettingsView'

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="dashboard"></Navigate>,
  },
  {
    path: '/',
    element: <BetKeeperRootView />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardView />,
      },
      {
        path: 'settings',
        element: <SettingsView />,
      },
    ],
  },
])

export default router
