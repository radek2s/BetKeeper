import { Bet } from '../../models/Bet'

export function filterPendingBets(bets: Bet[]): Bet[] {
  return bets.filter(({ betResolve }) => betResolve === 'pending')
}

export function filterResolvedBets(bets: Bet[]): Bet[] {
  return bets.filter(({ betResolve }) => betResolve !== 'pending')
}

export function filterPendingNotArchivedBets(bets: Bet[]): Bet[] {
  return bets.filter(({ betResolve, archived }) => betResolve === 'pending' && !archived)
}

export function filterResolvedNotArchivedBets(bets: Bet[]): Bet[] {
  return bets.filter(({ betResolve, archived }) => betResolve !== 'pending' && !archived)
}

export function filterArchivedBets(bets: Bet[]): Bet[] {
  return bets.filter(({ archived }) => archived)
}
