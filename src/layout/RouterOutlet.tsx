import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
const BetPage = lazy(() => import('../views/BetPage'));
const MainPage = lazy(() => import('../views/MainPage'));


const RouterOutlet: React.FC = () => {

    return (
        <main className="App-main">
            <Switch>

              <Route path="/list">
                <BetPage />
              </Route>

              <Route path="/">
                <MainPage />
              </Route>

            </Switch>
          </main>
    )
}

export default RouterOutlet;