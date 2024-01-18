/* eslint-disable no-magic-numbers */
import { Bet, BetResolveType } from './Bet'

export function mapToRequestData(bet: Bet) {
  const betResolveMapper = {
    person1: 0,
    person2: 1,
    draw: 2,
    pending: 3,
  }
  return {
    ...bet,
    betResolve: betResolveMapper[bet.betResolve],
  }
}

export function mapFromRequestData(data: any): Bet {
  const betResolveMapper = new Map<number, BetResolveType>()
  betResolveMapper.set(0, 'person1')
  betResolveMapper.set(1, 'person2')
  betResolveMapper.set(2, 'draw')
  betResolveMapper.set(3, 'pending')

  return {
    ...data,
    betResolve: betResolveMapper.get(data.betResolve),
  }
}
