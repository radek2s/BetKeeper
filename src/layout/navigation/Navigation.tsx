'use client'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { Bet } from '@/models/Bet'
import { ManageBetDialog } from '@/views/dashboard/components'
import { useBetContext } from '@/providers/BetProvider'
import { IconAdd, IconCog, IconHome } from '../icons'
import { useDialog } from '../dialog'

import NavigationItem from './NavigationItem'

function Navigation() {
  // const { pathname } = useLocation()

  const { visible, show, hide } = useDialog()
  const { add } = useBetContext()

  function handleClose(bet: Bet | undefined) {
    hide()
    if (bet) add(bet)
  }
  return (
    <div className="page-navigation__wrapper">
      <ul className="page-navigation" role="navigation">
        <li role="listitem">
          <NavigationItem link="/dashboard" pathname={'/dashboard'}>
            <IconHome />
            <span className="nav-text">Dashboard</span>
          </NavigationItem>
        </li>
        <li role="listitem" id="mobile-add" onClick={show}>
          <div className="icon-bg icon-bg__dark">
            <IconAdd />
          </div>
        </li>
        <li role="listitem">
          <NavigationItem link="/settings" pathname={''}>
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
