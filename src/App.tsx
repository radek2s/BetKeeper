import React from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navigation from './layout/Navigation'
import BetDataProvider from './providers/BetDataProvider'
import { DatabaseProvider } from './providers/DatabaseProvider'

import './Icons'

function App() {
  return (
    <div className="App">
      <DatabaseProvider>
        <BetDataProvider>
          <>
            <header className="App-header">
              <h1>Bet Keeper</h1>
            </header>

            <Navigation />
            <div className="App-main">
              <Outlet />
            </div>
          </>
        </BetDataProvider>
      </DatabaseProvider>
    </div>
  )
}

export default App
