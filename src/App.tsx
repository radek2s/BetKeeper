import React, { useEffect, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navigation from './layout/Navigation'
import BetDataProvider from './providers/BetDataProvider'
import { DatabaseProvider } from './providers/DatabaseProvider'

import './Icons'
import { Icon } from '@fluentui/react'
import { getTokens, onMessageListener } from './NotificationService'

function App() {
  const [navVisible, setNavVisible] = useState<boolean>(true)

  getTokens()

  onMessageListener()
    .then((payload) => {
      console.log('hi')

      console.log(payload)
    })
    .catch((err) => console.log('failed: ', err))

  useEffect(() => {
    const channel = new MessageChannel()
    navigator.serviceWorker.controller?.postMessage(
      {
        data: 'Hello',
      },
      [channel.port2]
    )
    // navigator.firebaseMessagingSw.controller.postMessage({

    // })
    // const channel = new BroadcastChannel("jsworker")
    // channel.postMessage({ female: "Radek" })
  }, [])

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
