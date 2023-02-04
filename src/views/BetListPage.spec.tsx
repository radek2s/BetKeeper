/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'

import BetPage from './BetListPage'
import { BetDataContext, BetDataService } from '../providers/BetDataProvider'
;(global as any).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement | null = null
describe('initialization', () => {
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  test('Should render 2 bets with [Example Bet, Example Second Bet] titles', async () => {
    //Arrange
    const MockDataService = jest.fn<BetDataService, any>(() => ({
      getAllBets: jest.fn(),
      getBetById: jest.fn(),
      addNewBet: jest.fn(),
      getAllActiveBets: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: 'Example Bet',
          description: 'Additional info who wins',
          option1: 'user 1 says',
          option2: 'user 2 says',
          isFinished: false,
          winner: false,
        },
        {
          id: 2,
          title: 'Example Second Bet',
          description: 'More additional info',
          option1: 'user 1 again says',
          option2: 'user 2 again says',
          isFinished: true,
          winner: false,
        },
      ]),
      getAllArchiveBets: jest.fn(),
      archiveBet: jest.fn(),
      updateBet: jest.fn(),
      deleteBet: jest.fn(),
    }))
    const dataServiceMock = new MockDataService()
    let data: RenderResult

    //Act
    await act(async () => {
      if (!container) throw new Error('Not found')
      const root = createRoot(container)
      root.render(
        <BetDataContext.Provider value={dataServiceMock}>
          <BetPage />
        </BetDataContext.Provider>
      )
    })

    //Assert
    expect(dataServiceMock.getAllActiveBets).toBeCalledTimes(1) //move to previous one
    expect(container!.getElementsByClassName('bet-card')).toHaveLength(2) //has two rendered bet-cards
    expect(container!.innerHTML).toContain('Example Bet')
    expect(container!.innerHTML).toContain('Example Second Bet')
  })
})
