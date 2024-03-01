import React from 'react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'

import { Bet } from '@/models/Bet'

import BetListMock from '@test/components/BetListMock'
import { BasicBetMock } from '@test/mocks/BetMock'
import DataSourcePresentationMock from '@test/components/DataSourcePresentationMock'
import DataSourceProviderMock from '@test/components/DataSourceProviderMock'
import { DataSource, DataSourceProvider } from './DataSourceProvider'

describe('Bet Provider Test', () => {
  beforeAll(() => {
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

    vi.mock('@/providers/NotificationProvider', () => ({
      useNotification: vi.fn().mockReturnValue(() => ({
        showNotification: vi.fn(),
      })),
    }))

    window.localStorage.setItem(
      'bet-datasource',
      JSON.stringify({
        type: 'local',
      })
    )
  })

  it('Should render bets from local storage', () => {
    const betsMemory: Bet[] = [
      {
        ...BasicBetMock,
        id: 'ABC001',
        betResolve: 'pending',
      },
      {
        ...BasicBetMock,
        title: 'Example title 2',
        id: 'ABC002',
        betResolve: 'person1',
      },
    ]

    window.localStorage.setItem('bets', JSON.stringify(betsMemory))

    render(
      <DataSourceProvider>
        <BetListMock />
      </DataSourceProvider>
    )

    const betList = screen.getByRole('list')
    expect(betList.children).toHaveLength(2)

    const betItem = screen.getByTestId('ABC002')
    expect(betItem).toHaveTextContent('Example title 2')
  })

  it('Should remove bet from local storage provider', async () => {
    const betsMemory: Bet[] = [
      {
        ...BasicBetMock,
        id: 'ABC001',
        betResolve: 'pending',
      },
    ]

    window.localStorage.setItem('bets', JSON.stringify(betsMemory))

    render(
      <DataSourceProvider>
        <BetListMock />
      </DataSourceProvider>
    )

    const deleteBtn = screen.getByRole('button', { name: 'Delete' })

    await act(async () => {
      await userEvent.click(deleteBtn)
    })

    const betList = screen.getByRole('list')
    expect(betList.children).toHaveLength(0)
  })

  it('Should not render bets from local storage when firebase datasource', () => {
    const betsMemory: Bet[] = [
      {
        ...BasicBetMock,
        id: 'ABC001',
        betResolve: 'pending',
      },
      {
        ...BasicBetMock,
        title: 'Example title 2',
        id: 'ABC002',
        betResolve: 'person1',
      },
    ]

    window.localStorage.setItem(
      'bet-datasource',
      JSON.stringify({
        type: 'firebase',
        apiKey: 'string',
        authDomain: 'string',
        projectId: 'string',
        storageBucket: 'string',
        messagingSenderId: 'string',
        appId: 'string',
      })
    )

    window.localStorage.setItem('bets', JSON.stringify(betsMemory))

    render(
      <DataSourceProvider>
        <BetListMock />
      </DataSourceProvider>
    )

    const betList = screen.getByRole('list')
    expect(betList.children).toHaveLength(0)
  })
})

describe('DataSource Provider Tests', () => {
  beforeAll(() => {
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

    vi.mock('@/providers/NotificationProvider', () => ({
      useNotification: vi.fn().mockImplementation(() => ({
        showNotification: vi.fn(),
      })),
    }))

    window.localStorage.setItem(
      'bet-datasource',
      JSON.stringify({
        type: 'local',
      })
    )
  })

  it('Should use LocalStorageProvider as default', () => {
    render(
      <DataSourceProvider>
        <DataSourcePresentationMock />
      </DataSourceProvider>
    )

    const datasourceHeading = screen.getByRole('heading', { name: 'Active: local' })
    expect(datasourceHeading).toBeInTheDocument()
  })

  it('Should change datasource', async () => {
    const datasourceMock = vi.fn() as unknown as DataSource
    const changeDataSourceMock = vi.fn()
    render(
      <DataSourceProviderMock
        datasource={datasourceMock}
        setDatasource={changeDataSourceMock}>
        <DataSourcePresentationMock />
      </DataSourceProviderMock>
    )

    const localStorageBtn = screen.getByRole('button', { name: 'Local' })
    const firebaseStorageBtn = screen.getByRole('button', { name: 'Firebase' })

    await userEvent.click(firebaseStorageBtn)

    expect(changeDataSourceMock).toHaveBeenCalledTimes(1)

    await userEvent.click(localStorageBtn)

    expect(changeDataSourceMock).toHaveBeenCalledTimes(2)
  })

  it('Should load FirebaseStorageProvider when defined', async () => {
    window.localStorage.setItem(
      'bet-datasource',
      JSON.stringify({
        type: 'firebase',
        apiKey: 'string',
        authDomain: 'string',
        projectId: 'string',
        storageBucket: 'string',
        messagingSenderId: 'string',
        appId: 'string',
      })
    )

    render(
      <DataSourceProvider>
        <DataSourcePresentationMock />
      </DataSourceProvider>
    )

    const datasourceHeading = screen.getByRole('heading', { name: 'Active: firebase' })
    expect(datasourceHeading).toBeInTheDocument()
  })
})
