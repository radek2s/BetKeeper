import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import BetPage from './views/BetListPage'
import SettingsPage from './views/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'list',
        element: <BetPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

export default router
