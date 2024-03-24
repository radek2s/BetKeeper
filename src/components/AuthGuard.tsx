'use client'
import { useCorbado } from '@corbado/react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

function AuthGuard({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useCorbado()
  const router = useRouter()

  if (loading) return <p>Loading...</p>

  if (!isAuthenticated) router.push('/login')

  return <div>{children}</div>
}

export default AuthGuard
