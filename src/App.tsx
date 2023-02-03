import React, { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navigation from './layout/Navigation'
import BetDataProvider from './providers/BetDataProvider'
import { DatabaseProvider } from './providers/DatabaseProvider'

import './Icons'
import { Icon } from '@fluentui/react'

function App() {
  const [navVisible, setNavVisible] = useState<boolean>(true)
  return (
    <div className="App">
      <DatabaseProvider>
        <BetDataProvider>
          <>
            <header className="App-header">
              <Icon iconName={'mobile-menu'} onClick={() => setNavVisible((e) => !e)} />
              <h1>Bet Keeper</h1>
            </header>

            <Navigation visible={navVisible} />
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
