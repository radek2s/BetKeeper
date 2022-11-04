import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
const BetPage = lazy(() => import('../views/BetListPage'))
const MainPage = lazy(() => import('../views/MainPage'))

const RouterOutlet: React.FC = () => {
  return (
    <main className="App-main">
      <Switch>
        <Route path="/list">
          <BetPage></BetPage>
        </Route>

        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </main>
  )
}

export default RouterOutlet
