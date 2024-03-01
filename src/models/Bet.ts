export type BetResolveType = 'pending' | 'person1' | 'person2' | 'draw'
export interface Bet {
  id: string | number
  title: string
  description: string
  archived: boolean
  option1: string
  option2: string
  betResolve: BetResolveType
}
