import BetEntry from '../models/BetEntry'
import { BetDataService } from '../providers/BetDataProvider'

/**
 * Bet Firebase storage Service
 *
 * Keep your bets on your Firebase storage.
 *
 * EXAMPLE OF VALID CLASS DESIGN
 */
export default class BetFirebaseService implements BetDataService {
  getAllBets(): Promise<BetEntry[]> {
    throw new Error('Method not implemented.')
  }
  getBetById(id: number): Promise<BetEntry> {
    throw new Error('Method not implemented.')
  }
  addNewBet(bet: BetEntry): Promise<BetEntry> {
    throw new Error('Method not implemented.')
  }
  updateBet(bet: BetEntry): Promise<BetEntry> {
    throw new Error('Method not implemented.')
  }
  deleteBet(id: number): void {
    throw new Error('Method not implemented.')
  }
}
