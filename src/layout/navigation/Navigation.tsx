import React from 'react'
import IconHome from '../icons/Home'
import IconCog from '../icons/Cog'
import { Link, useLocation, useNavigation } from 'react-router-dom'
import NavigationItem from './NavigationItem'

function Navigation() {
  const { pathname } = useLocation()
  return (
    <ul className="page-navigation">
      <li>
        <NavigationItem link="/new/dashboard" pathname={pathname}>
          <IconHome />
          Dashboard
        </NavigationItem>
      </li>
      <li>
        <NavigationItem link="/new/settings" pathname={pathname}>
          <IconCog />
          Settings
        </NavigationItem>
      </li>
    </ul>
  )
}

export default Navigation
