/* eslint-disable @typescript-eslint/no-explicit-any */
import BetLocalStorageService from './BetLocalStorageService'
import BetEntry, { Winner } from '../models/BetEntry'

type Store = any
class LocalStorageMock {
  store: Store
  length: number

  constructor() {
    this.store = {}
    this.length = 0
  }

  clear() {
    this.store = {}
  }

  getItem(key: string): Store | null {
    return this.store[key] || null
  }

  setItem(key: string, value: any) {
    this.store[key] = String(value)
  }

  removeItem(key: string) {
    delete this.store[key]
  }

  /**
   * Get element from LocalStorage mock by its key order
   * @param n key position
   * @returns Store entry
   */
  key(n: number): any {
    if (typeof n === 'undefined') {
      throw new Error(
        "Uncaught TypeError: Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present."
      )
    }

    if (n >= Object.keys(this.store).length) {
      return null
    }

    return Object.keys(this.store)[n]
  }
}

describe('Storage Service', () => {
  describe('Local Storage', () => {
    let service: BetLocalStorageService
    beforeAll(() => {
      //Arrange
      service = new BetLocalStorageService()
      global.localStorage = new LocalStorageMock()
    })

    test('Should localStoage be empty', async () => {
      //Act
      const result = await service.getAllBets()

      //Assert
      expect(result).toStrictEqual([])
    })

    test('Should add new bet with ID=1', async () => {
      //Arrange
      const bet: BetEntry = new BetEntry(
        '',
        'LocalBet',
        'Additional description',
        'Option 1',
        'Option 2',
        Winner.None
      )

      //Act
      const result = await service.addNewBet(bet)

      //Assert
      expect(result.id).toBe(1)
    })

    test('Should increment and add new bet with ID=2', async () => {
      //Arrange
      const bet: BetEntry = new BetEntry(
        '',
        'SecondBet',
        'Additional description',
        'Option I',
        'Option II',
        Winner.None
      )

      //Act
      const result = await service.addNewBet(bet)

      //Assert
      expect(result.id).toBe(2)
    })

    test('Should update update bet with ID=1', async () => {
      //Arrange
      const bets = await service.getAllBets()
      const bet = bets.find((b: BetEntry) => b.id === 1)

      //Act
      if (bet) {
        bet.winner = Winner.Person1
        const result = await service.updateBet(bet)

        //Assert
        expect(result.winner).toBe(Winner.Person1)
      } else {
        fail
      }
    })

    test('Should remove bet with ID=2 from storage', async () => {
      //Act
      await service.deleteBet(2)
      const result = await service.getAllBets()

      //Assert
      expect(result).toHaveLength(1)
    })
  })
})
