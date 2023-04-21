import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Icon } from '@fluentui/react'

import Navigation from './layout/Navigation'
import BetDataProvider from './providers/BetDataProvider'
import { DatabaseProvider } from './providers/DatabaseProvider'
import { PushNotificationProvider } from './providers/PushNotificationService'

import './Icons'
import './App.css'

function App() {
  const [navVisible, setNavVisible] = useState<boolean>(true)

  return (
    <div className="App">
      <PushNotificationProvider>
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
      </PushNotificationProvider>
    </div>
  )
}

export default App
