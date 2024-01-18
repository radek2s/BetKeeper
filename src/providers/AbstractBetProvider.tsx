//TODO: Rename file to BetProvider
import React, { ReactNode, createContext, useContext } from 'react'
import { BetService } from './BetService.interface'
import useLocalStorageProvider from './hooks/useLocalStorageProvider'
import useFirebaseProvider from './hooks/useFirebaseProvider'
import { DataSource, isFirebaseConfig } from './DataSourceProvider'

const BetContext = createContext<BetService | null>(null)

interface BetProviderProps {
  children: ReactNode
  datasource: DataSource
}
export function BetProvider({ children, datasource }: BetProviderProps) {
  const localStorageProvider = useLocalStorageProvider()
  const firebaseProvider = useFirebaseProvider(
    isFirebaseConfig(datasource) ? datasource : null
  )

  switch (datasource.type) {
    case 'local':
      return (
        <BetContext.Provider value={localStorageProvider}>{children}</BetContext.Provider>
      )
    case 'firebase':
      return (
        <BetContext.Provider value={firebaseProvider}>{children}</BetContext.Provider>
      )
    default:
      throw new Error('Unrecoginized datasource')
  }
}

export function useBetContext() {
  const context = useContext(BetContext)

  if (context == null) throw new Error('Bet Provider must be in scope!')

  return context
}
