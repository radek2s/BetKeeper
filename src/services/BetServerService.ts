import axios from 'axios'
import BetEntry from '../models/BetEntry'
import { DedicatedConfig } from '../models/DatabaseConnector'
import { BetDataService } from '../providers/BetDataProvider'

/**
 * Bet BackendServer Service
 *
 * Fetch and upload data into dedicated local backend service.
 */
export default class BetServerService implements BetDataService {
  private path: string

  constructor(config?: DedicatedConfig) {
    this.path = config?.serverUrl || 'http://localhost:8000'
  }

  async getAllBets(): Promise<BetEntry[]> {
    const { data } = await axios.get(`${this.path}/api/bet`)
    return data.map((bet: BetEntry) => BetEntry.fromObject(bet))
  }

  async getBetById(id: number): Promise<BetEntry> {
    return await axios.get(`${this.path}/api/bet/${id}`)
  }

  async addNewBet(bet: BetEntry): Promise<BetEntry> {
    const { data } = await axios.post(`${this.path}/api/bet`, bet)
    return new BetEntry(data.id, data.title, '', data.option1, data.option2)
  }

  updateBet(bet: BetEntry): Promise<BetEntry> {
    return axios.put(`${this.path}/api/bet/${bet.id}`, bet)
  }

  deleteBet(id: number): Promise<void> {
    return axios.delete(`${this.path}/api/bet/${id}`)
  }
}
