import BetEntry from '../models/BetEntry'
import BetIdea from '../models/BetIdea'
import { BetDataService } from '../providers/BetDataProvider'

export default class BetLocalStorageService implements BetDataService {
  private static STORAGE_KEY = 'bets'
  private static STORAGE_KEY_IDEAS = 'bet_ideas'

  async getAllBets(): Promise<BetEntry[]> {
    const data = JSON.parse(
      localStorage.getItem(BetLocalStorageService.STORAGE_KEY) || '[]'
    )
    return data.map((bet: BetEntry) => BetEntry.fromObject(bet))
  }

  async getAllActiveBets(): Promise<BetEntry[]> {
    return (await this.getAllBets()).filter((bet) => !bet.archived)
  }

  async getAllArchiveBets(): Promise<BetEntry[]> {
    return (await this.getAllBets()).filter((bet) => bet.archived)
  }

  async archiveBet(id: string | number, archive = true): Promise<void> {
    const bets = await this.getAllBets()
    const index = bets.findIndex((b: BetEntry) => b.id === id)
    bets[index].archived = archive
    this.saveAllBets(bets)
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

  async getAllBetIdeas(): Promise<BetIdea[]> {
    const data = JSON.parse(
      localStorage.getItem(BetLocalStorageService.STORAGE_KEY_IDEAS) || '[]'
    )
    return data.map((bet: BetIdea) => BetIdea.fromObject(bet))
  }

  async addNewBetIdea(betIdea: BetIdea): Promise<void> {
    const bets = await this.getAllBetIdeas()
    const lastId = bets[bets.length - 1]?.id as number
    betIdea.id = (+lastId || 0) + 1
    bets.push(betIdea)
    this.saveAllBetIdeas(bets)
  }

  private saveAllBetIdeas(betIdeas: BetIdea[]) {
    localStorage.setItem(
      BetLocalStorageService.STORAGE_KEY_IDEAS,
      JSON.stringify(betIdeas)
    )
  }
}
