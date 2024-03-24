/* eslint-disable react/react-in-jsx-scope */
'use client'

import { CorbadoAuth } from '@corbado/react'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const router = useRouter()
  const onLoggedIn = () => {
    router.push('/dashboard')
  }
  const navigateToSignUp = () => {
    router.push('/signup')
  }

  return (
    <div className="login-wrapper">
      <CorbadoAuth onLoggedIn={onLoggedIn} navigateToSignUp={navigateToSignUp} />;
    </div>
  )
}
