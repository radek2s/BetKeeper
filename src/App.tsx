import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from './layout/Navigation';
import RouterOutlet from './layout/RouterOutlet';
import Loading from './layout/Loading';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bet Keeper</h1>
      </header>

      <Router>
        <Suspense fallback={<Loading/>}>
          <Navigation />
          <RouterOutlet />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
