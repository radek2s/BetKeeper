import React from 'react'
import { useLocation } from 'react-router-dom'

import { ManageBetDialog } from '@/views/dashboard/components'
import IconHome from '../icons/Home'
import IconCog from '../icons/Cog'
import NavigationItem from './NavigationItem'
import IconAdd from '../icons/Add'
import { useDialog } from '../dialog'
import { useBetContext } from '@/providers/BetProvider'
import { Bet } from '@/models/Bet'

function Navigation() {
  const { pathname } = useLocation()

  const { visible, show, hide } = useDialog()
  const { add } = useBetContext()

  function handleClose(bet: Bet | undefined) {
    hide()
    if (bet) add(bet)
  }
  return (
    <div className="page-navigation__wrapper">
      <ul className="page-navigation">
        <li>
          <NavigationItem link="/dashboard" pathname={pathname}>
            <IconHome />
            <span className="nav-text">Dashboard</span>
          </NavigationItem>
        </li>
        <li id="mobile-add" onClick={show}>
          <div className="icon-bg icon-bg__dark">
            <IconAdd />
          </div>
        </li>
        <li>
          <NavigationItem link="/settings" pathname={pathname}>
            <IconCog />
            <span className="nav-text">Settings</span>
          </NavigationItem>
        </li>
      </ul>

      <ManageBetDialog visible={visible} onClose={handleClose} />
    </div>
  )
}

export default Navigation
