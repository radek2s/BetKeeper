import BetEntry from '../models/BetEntry'
import { BetDataService } from '../providers/BetDataProvider'

export default class BetLocalStorageService implements BetDataService {
  private static STORAGE_KEY = 'bets'

  async getAllBets(): Promise<BetEntry[]> {
    const data = JSON.parse(
      localStorage.getItem(BetLocalStorageService.STORAGE_KEY) || '[]'
    )
    return data.map((bet: BetEntry) => BetEntry.fromObject(bet))
  }
  getBetById(id: number): Promise<BetEntry> {
    throw new Error(`Method not implemented. getById(${id})`)
  }
  async addNewBet(bet: BetEntry): Promise<BetEntry> {
    const bets = await this.getAllBets()
    const lastId = bets[bets.length - 1]?.id as number
    bet.id = (+lastId || 0) + 1
    bets.push(bet)
    this.saveAllBets(bets)
    return bet
  }
  async updateBet(bet: BetEntry): Promise<BetEntry> {
    const bets = await this.getAllBets()
    const index = bets.findIndex((b: BetEntry) => b.id === bet.id)
    bets[index] = bet
    this.saveAllBets(bets)
    return bet
  }
  async deleteBet(id: number): Promise<void> {
    const bets = await this.getAllBets()
    this.saveAllBets(bets.filter((b: BetEntry) => b.id !== id))
  }

  private saveAllBets(bets: BetEntry[]) {
    localStorage.setItem(BetLocalStorageService.STORAGE_KEY, JSON.stringify(bets))
  }
}
