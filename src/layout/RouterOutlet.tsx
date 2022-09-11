import React, { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BetApi from '../features/BetApi';
const BetPage = lazy(() => import('../views/BetListPage'));
const MainPage = lazy(() => import('../views/MainPage'));


const RouterOutlet: React.FC = () => {
  const [serviceApi] = React.useState<BetApi>(new BetApi()); //zmienna do wszystkich betów
  return (
    <main className="App-main">
      <Switch>

        <Route path="/list">
          <BetPage serviceApi={serviceApi}></BetPage>
        </Route>

        <Route path="/">
          <MainPage />
        </Route>

      </Switch>
    </main>
  )
}

export default RouterOutlet
