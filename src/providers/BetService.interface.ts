import { Bet, BetResolveType } from '../models/Bet'

export interface BetService {
  getAll: () => Bet[]

  add: (bet: Bet) => void

  remove: (betId: string | number) => void

  resolve: (betId: string | number, resolve: BetResolveType) => void

  update: (bet: Bet) => void

  archive: (betId: string | number, archive: boolean) => void
}
