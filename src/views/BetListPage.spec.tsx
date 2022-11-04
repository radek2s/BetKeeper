/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import BetPage from './BetListPage'
import BetApi from '../features/BetApi'
import { act } from 'react-dom/test-utils'
import { BetDataContext, BetDataService } from '../providers/BetDataProvider'

describe('initialization', () => {
  test('Should get all bets once', async () => {
    //Arrange
    const Mock = jest.fn<BetApi, any>(() => ({
      getAllBets: jest.fn().mockResolvedValue([]),
      getBetById: jest.fn(),
      addNewBet: jest.fn(),
      updateBetById: jest.fn(),
      deleteBetById: jest.fn(),
    }))
    //In future replace with ReactContextMock instead of providing serviceApi

    const mock = new Mock()

    //Act
    await act(async () => {
      render(<BetPage serviceApi={mock} />)
    })

    //Assert
    expect(mock.getAllBets).toHaveBeenCalledTimes(1)
  })

  test('Should render 2 bets with [Example Bet, Example Second Bet] titles', async () => {
    //Arrange
    const MockDataService = jest.fn<BetDataService, any>(() => ({
      getAllBets: jest.fn().mockResolvedValue([
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
      getBetById: jest.fn(),
      addNewBet: jest.fn(),
      updateBet: jest.fn(),
      deleteBet: jest.fn(),
    }))
    const dataServiceMock = new MockDataService()

    /* TO DELETE it when BetApi.ts will be deleted */
    const Mock = jest.fn<BetApi, any>(() => ({
      getAllBets: jest.fn().mockResolvedValue([]),
      getBetById: jest.fn(),
      addNewBet: jest.fn(),
      updateBetById: jest.fn(),
      deleteBetById: jest.fn(),
    }))
    const mock = new Mock()
    /* ------------------------------------------- */

    let data: RenderResult

    //Act
    await act(async () => {
      data = render(
        <BetDataContext.Provider value={dataServiceMock}>
          <BetPage serviceApi={mock} />
        </BetDataContext.Provider>
      )
    })

    //Assert
    expect(dataServiceMock.getAllBets).toBeCalledTimes(1) //move to previous one
    expect(data!.baseElement.getElementsByClassName('bet-card')).toHaveLength(2) //has two rendered bet-cards
    expect(data!.baseElement.innerHTML).toContain('Example Bet')
    expect(data!.baseElement.innerHTML).toContain('Example Second Bet')
  })
})
