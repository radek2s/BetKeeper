import React, { Suspense } from 'react'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './layout/Navigation'
import RouterOutlet from './layout/RouterOutlet'
import Loading from './layout/Loading'
import BetDataProvider, { BetDataContext } from './providers/BetDataProvider'
import BetFirebaseService from './services/BetFirebaseService'
import {
  DatabaseContext,
  DatabaseProvider,
  defaultConnection,
} from './providers/DatabaseProvider'

function App() {
  //Initialize BetServerService to get data from REST API
  // const betDataService = new BetServerService()

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
