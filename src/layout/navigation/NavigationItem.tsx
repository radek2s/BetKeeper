'use client'
import clsx from 'clsx'
import Link from 'next/link'
import React, { ReactNode } from 'react'
// import { Link } from 'react-router-dom'

interface NavigationItemProps {
  link: string
  pathname: string
  children: ReactNode
}
function NavigationItem({ link, pathname, children }: NavigationItemProps) {
  return (
    <Link
      href={link}
      className={clsx(['flex items-center gap-2', pathname === link && 'active'])}>
      {children}
    </Link>
  )
}

export default NavigationItem
