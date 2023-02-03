import path from 'node:path/win32'
import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import BetPage from './views/BetListPage'
import SettingsPage from './views/Settings'

const router = createBrowserRouter([
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
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

export default router
