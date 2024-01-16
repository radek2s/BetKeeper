/* eslint-disable react/prop-types */
import clsx from 'clsx'
import React from 'react'
type ButtonColor = 'none' | 'default' | 'primary'

interface ButtonProps {
  children: React.ReactNode
  iconStart?: React.ReactNode
  color?: ButtonColor
  onClick?: () => void
}

type ButtonType = ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>

function Button({ children, iconStart, color = 'default', ...props }: ButtonType) {
  return (
    <button {...props} className={clsx([color, props.className])}>
      {iconStart && <div className="button-icon__start">{iconStart}</div>}
      {children}
    </button>
  )
}

export default Button
