import { act, renderHook } from '@testing-library/react'
import useLocalStorageProvider from './useLocalStorageProvider'
import { beforeAll } from 'vitest'
import { BasicBetMock } from '@test/mocks/BetMock'
import { Bet } from '@/models/Bet'

const localStorageMock = (function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any = {}

  return {
    getItem: function (key: string) {
      return store[key] || null
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString()
    },
    removeItem: function (key: string) {
      delete store[key]
    },
    clear: function () {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useLocalStorageProvider Tests', () => {
  beforeAll(() => {
    localStorage.setItem('bets', JSON.stringify([BasicBetMock]))
  })

  it('Should load bets from localsotrage', () => {
    const { result } = renderHook(() => useLocalStorageProvider())

    const bets = result.current.getAll()

    expect(bets).toHaveLength(1)

    expect(bets.at(0)?.title).toBe('Basic Bet')
  })

  it('Should add bet', () => {
    const { result } = renderHook(() => useLocalStorageProvider())

    const newBet = {
      ...BasicBetMock,
      id: 'ABCDEF',
      title: 'Modified',
      betResolve: 'pending',
    } as Bet

    act(() => {
      result.current.add(newBet)
    })

    const bets = result.current.getAll()

    expect(bets).toHaveLength(2)

    expect(bets.at(-1)?.title).toBe('Modified')
  })

  it('Should update bet', () => {
    const { result } = renderHook(() => useLocalStorageProvider())

    const updatedBet = {
      ...BasicBetMock,
      title: 'Updated Bet',
      betResolve: 'pending',
    } as Bet

    act(() => {
      result.current.update(updatedBet)
    })

    const bets = result.current.getAll()

    expect(bets).toHaveLength(2)

    expect(bets.at(0)?.title).toBe('Updated Bet')
  })

  it('Should resolve bet', () => {
    const { result } = renderHook(() => useLocalStorageProvider())

    act(() => {
      result.current.resolve(BasicBetMock.id, 'person1')
    })

    const bets = result.current.getAll()

    expect(bets.at(0)?.betResolve).toBe('person1')
  })

  it('Should archive bet', () => {
    const { result } = renderHook(() => useLocalStorageProvider())

    act(() => {
      result.current.archive(BasicBetMock.id, true)
    })

    const bets = result.current.getAll()

    expect(bets.at(0)?.archived).toBe(true)
  })

  it('Should resolve bet', () => {
    const { result } = renderHook(() => useLocalStorageProvider())

    act(() => {
      result.current.remove('123456')
    })

    const bets = result.current.getAll()

    expect(bets).toHaveLength(1)

    expect(bets.at(-1)?.title).toBe('Modified')
  })
})
