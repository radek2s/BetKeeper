import { Bet, BetResolveType } from '../models/Bet'

export interface BetService {
  getAll: () => Bet[]

  add: (bet: Bet) => void

  remove: (betId: string | number) => void

  resolve: (betId: string | number, resolve: BetResolveType) => void

  //TODO: Add other options
}
