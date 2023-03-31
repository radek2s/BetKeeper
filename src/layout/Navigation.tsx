import React from 'react'
import { Link } from 'react-router-dom'

interface NavProps {
  visible: boolean
}
const Navigation: React.FC<NavProps> = ({ visible }) => {
  return (
    <nav className={`App-nav ${visible ? 'visible' : 'invisible'}`}>
      <ul>
        <Link to="/list">
          <li>Bet List</li>
        </Link>
        <Link to="/ideas">
          <li>Bet Ideas</li>
        </Link>
        <Link to="/archive">
          <li>Bet Archive</li>
        </Link>
        <Link to="/settings">
          <li>Settings</li>
        </Link>
      </ul>
    </nav>
  )
}

export default Navigation
