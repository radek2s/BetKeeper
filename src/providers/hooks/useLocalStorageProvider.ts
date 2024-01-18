import { useEffect, useReducer } from 'react'

import { mapFromRequestData } from '../../models/BetMapper'
import { BetService } from '../BetService.interface'
import betReducer from './betReducer'

const STORAGE_KEY = 'bets'
function useLocalStorageProvider(): BetService {
  const [bets, dispatch] = useReducer(betReducer, [])

  useEffect(() => {
    loadBetsFromLocalStorage()
  }, [])

  const loadBetsFromLocalStorage = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      dispatch({ type: 'fetch', data: data.map(mapFromRequestData) })
    } catch (e) {
      console.error('Failed to load data from localStorage', e)
    }
  }

  return {
    getAll: () => bets,
  }
}

export default useLocalStorageProvider
