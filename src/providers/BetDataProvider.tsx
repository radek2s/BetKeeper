import React from 'react'
import BetEntry from '../models/BetEntry'
import BetLocalStorageService from '../services/BetLocalStorageService'
import { DatabaseContext } from './DatabaseProvider'
import BetIdea from '../models/BetIdea'

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

  getAllActiveBets(): Promise<BetEntry[]>

  getAllArchiveBets(): Promise<BetEntry[]>

  getAllBetIdeas(): Promise<BetIdea[]>

  getBetById(id: number | string): Promise<BetEntry>

  addNewBet(bet: BetEntry): Promise<BetEntry>

  updateBet(bet: BetEntry): Promise<BetEntry>

  archiveBet(id: number | string, archive: boolean): Promise<void>

  /**
   *
   * @param id bet id number
   */
  deleteBet(id: number | string): Promise<void>

  addNewBetIdea(betIdea: BetIdea): Promise<void>
}

export const BetDataContext = React.createContext<BetDataService>(
  new BetLocalStorageService()
)

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
