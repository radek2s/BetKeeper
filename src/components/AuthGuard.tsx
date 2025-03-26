'use client'
import { useCorbado } from '@corbado/react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

function AuthGuard({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated, user, logout } = useCorbado()
  const router = useRouter()

  if (loading) return <p>Loading...</p>


  if (!isAuthenticated) router.push('/login')


  return <div>
    <div>
      {user?.email}
      Login?
    </div>
    <button onClick={logout}>
      Logout
    </button>
    <div>

      {children}
    </div></div>
}

export default AuthGuard
