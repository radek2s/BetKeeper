/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react'
import { render } from '@testing-library/react';
import BetPage from './BetListPage';
import BetApi from '../features/BetApi';
import { act } from 'react-dom/test-utils';

describe('initialization', () => {
    test('Should get all bets once', async () => {
        //Arrange
        const Mock = jest.fn<BetApi, any>(() => ({
            getAllBets: jest.fn().mockResolvedValue([]),
            getBetById: jest.fn(),
            addNewBet: jest.fn(),
            updateBetById: jest.fn(),
            deleteBetById: jest.fn()
        }));
        //In future replace with ReactContextMock instead of providing serviceApi

        const mock = new Mock();

        //Act
        await act(async () => {render(<BetPage serviceApi={mock}/>)})

        //Assert
        expect(mock.getAllBets).toHaveBeenCalledTimes(1)
    })
})