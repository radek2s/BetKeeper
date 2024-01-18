import { Bet } from '../../models/Bet'

type BetActions = BetActionFetch

type BetActionFetch = {
  type: 'fetch'
  data: Bet[]
}

//TODO: Add other methods 'add' | 'delete' etc.

function betReducer(state: Bet[], action: BetActions) {
  switch (action.type) {
    case 'fetch':
      return action.data
  }
}

export default betReducer
