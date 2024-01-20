import { Bet } from '../../models/Bet'

type BetActions = BetActionFetch | BetActionAdd | BetActionRemove

type BetActionFetch = {
  type: 'fetch'
  data: Bet[]
}

type BetActionAdd = {
  type: 'add'
  bet: Bet
}

type BetActionRemove = {
  type: 'remove'
  betId: string | number
}

//TODO: Add other methods 'add' | 'delete' etc.

function betReducer(state: Bet[], action: BetActions) {
  switch (action.type) {
    case 'fetch':
      return action.data
    case 'add':
      return [...state, action.bet]
    case 'remove':
      return state.filter(({ id }) => id !== action.betId)
  }
}

export default betReducer
