import { Bet } from '../models/Bet'

export interface BetService {
  getAll: () => Bet[]

  //TODO: Add other options
}
