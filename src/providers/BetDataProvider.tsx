import React from 'react'
import BetEntry from '../models/BetEntry'
import BetFirebaseService from '../services/BetFirebaseService'
import BetServerService from '../services/BetServerService'
import { DatabaseContext } from './DatabaseProvider'

/**
 * BetDataService interface
 *
 * Define all required methods for BetDataContext
 * For production data we will use "BetServerService"
 * but we can also provde "BetMockService" that will
 * provide mocked data to check application.
 */
export interface BetDataService {
  getAllBets(): Promise<BetEntry[]>

  getBetById(id: number | string): Promise<BetEntry>

  addNewBet(bet: BetEntry): Promise<BetEntry>

  updateBet(bet: BetEntry): Promise<BetEntry>

  /**
   *
   * @param id bet id number
   */
  deleteBet(id: number | string): Promise<void>
}

export const BetDataContext = React.createContext<BetDataService>(new BetServerService())

interface Props {
  children: React.ReactNode
}
export const BetDataProvider: React.FC<Props> = ({ children }) => {
  const dbConsumer = React.useContext(DatabaseContext)
  return (
    <>
      <BetDataContext.Provider value={dbConsumer.service}>
        {children}
      </BetDataContext.Provider>
    </>
  )
}
export default BetDataProvider
