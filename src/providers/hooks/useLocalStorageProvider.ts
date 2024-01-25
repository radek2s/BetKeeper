import { useEffect, useReducer } from 'react'
import { nanoid } from 'nanoid'

import { mapFromRequestData, mapToRequestData } from '../../models/BetMapper'
import { BetService } from '../BetService.interface'
import betReducer from './betReducer'
import { Bet, BetResolveType } from '../../models/Bet'

const STORAGE_KEY = 'bets'
function useLocalStorageProvider(): BetService {
  const [bets, dispatch] = useReducer(betReducer, [])

  useEffect(() => {
    loadBetsFromLocalStorage()
  }, [])

  useEffect(() => {
    if (bets.length > 0) saveBetsToLocalStorage()
  }, [bets])

  function loadBetsFromLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      dispatch({ type: 'fetch', data: data.map(mapFromRequestData) })
    } catch (e) {
      console.error('Failed to load data from localStorage', e)
    }
  }

  function saveBetsToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bets.map(mapToRequestData)))
  }

  function handleAddBet(bet: Bet) {
    bet.id = nanoid()
    dispatch({ type: 'add', bet })
  }

  function removeBet(betId: string | number) {
    dispatch({ type: 'remove', betId })
  }

  function resolveBet(betId: string | number, resolve: BetResolveType) {
    dispatch({ type: 'resolve', betId, resolve })
  }

  function updateBet(bet: Bet) {
    dispatch({ type: 'update', bet })
  }

  function archiveBet(betId: string | number, archive: boolean) {
    dispatch({ type: 'archive', betId, archive })
  }

  return {
    getAll: () => bets,
    add: handleAddBet,
    remove: removeBet,
    resolve: resolveBet,
    update: updateBet,
    archive: archiveBet,
  }
}

export default useLocalStorageProvider
