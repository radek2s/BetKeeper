import { Bet, BetResolveType } from '../../models/Bet'

type BetActions =
  | BetActionFetch
  | BetActionAdd
  | BetActionRemove
  | BetActionResolve
  | BetActionUpdate
  | BetActionArchive

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

type BetActionResolve = {
  type: 'resolve'
  betId: string | number
  resolve: BetResolveType
}

type BetActionUpdate = {
  type: 'update'
  bet: Bet
}

type BetActionArchive = {
  type: 'archive'
  betId: string | number
  archive: boolean
}

function betReducer(state: Bet[], action: BetActions) {
  switch (action.type) {
    case 'fetch':
      return action.data
    case 'add':
      return [...state, action.bet]
    case 'remove':
      return state.filter(({ id }) => id !== action.betId)
    case 'resolve': {
      const index = state.findIndex(({ id }) => id === action.betId)
      if (index < 0) throw new Error(`Unable to find Bet with id:${action.betId}`)
      state[index].betResolve = action.resolve
      return [...state]
    }
    case 'update': {
      const index = state.findIndex(({ id }) => id === action.bet.id)
      if (index < 0) throw new Error(`Unable to find Bet with id:${action.bet.id}`)
      state[index] = action.bet
      return [...state]
    }
    case 'archive': {
      const index = state.findIndex(({ id }) => id === action.betId)
      if (index < 0) throw new Error(`Unable to find Bet with id:${action.betId}`)
      state[index].archived = action.archive
      return [...state]
    }
  }
}

export default betReducer
