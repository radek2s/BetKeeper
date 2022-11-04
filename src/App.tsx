import React, { Suspense } from 'react'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './layout/Navigation'
import RouterOutlet from './layout/RouterOutlet'
import Loading from './layout/Loading'
import { BetDataContext } from './providers/BetDataProvider'
import BetServerService from './services/BetServerService'

function App() {
  //Initialize BetServerService to get data from REST API
  const betDataService = new BetServerService()

  return (
    <div className="App">
      <BetDataContext.Provider value={betDataService}>
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
      </BetDataContext.Provider>
    </div>
  )
}

export default App
