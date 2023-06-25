import React from 'react'
import { Link } from 'react-router-dom'

interface NavProps {
  visible: boolean
  onClick: () => void
}
const Navigation: React.FC<NavProps> = ({ visible, onClick }) => {
  return (
    <nav className={`App-nav ${visible ? 'visible' : 'invisible'}`}>
      <ul>
        <Link to="/list" onClick={onClick}>
          <li>Bet List</li>
        </Link>
        <Link to="/archive" onClick={onClick}>
          <li>Bet Archive</li>
        </Link>
        <Link to="/settings" onClick={onClick}>
          <li>Settings</li>
        </Link>
      </ul>
    </nav>
  )
}

export default Navigation
