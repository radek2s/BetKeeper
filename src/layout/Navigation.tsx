import React from 'react'
import { Link } from 'react-router-dom'

interface NavProps {
  visible: boolean
}
const Navigation: React.FC<NavProps> = (props) => {
  return (
    <nav className={`App-nav ${props.visible ? 'visible' : 'invisible'}`}>
      <ul>
        <Link to="/">
          <li>Main Page</li>
        </Link>
        <Link to="/list">
          <li>Bet List</li>
        </Link>
        <Link to="/settings">
          <li>Settings</li>
        </Link>
      </ul>
    </nav>
  )
}

export default Navigation
