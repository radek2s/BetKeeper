import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import App from './App'
import BetArchive from './views/BetArchiveList'
import BetPage from './views/BetListPage'
import SettingsPage from './views/Settings'

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
])

export default router
