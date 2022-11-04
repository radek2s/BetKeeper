import React from 'react'
import BetEntry from '../models/BetEntry'
import BetServerService from '../services/BetServerService'

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

  getBetById(id: number): Promise<BetEntry>

  addNewBet(bet: BetEntry): Promise<BetEntry>

  updateBet(bet: BetEntry): Promise<BetEntry>

  /**
   *
   * @param id bet id number
   */
  deleteBet(id: number): Promise<void>
}

export const BetDataContext = React.createContext<BetDataService>(new BetServerService())
