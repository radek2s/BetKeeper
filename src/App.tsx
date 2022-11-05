import React, { Suspense } from 'react'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './layout/Navigation'
import RouterOutlet from './layout/RouterOutlet'
import Loading from './layout/Loading'
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

            <Router>
              <Suspense fallback={<Loading />}>
                <Navigation />
                <RouterOutlet />
              </Suspense>
            </Router>
          </>
        </BetDataProvider>
      </DatabaseProvider>
    </div>
  )
}

export default App
