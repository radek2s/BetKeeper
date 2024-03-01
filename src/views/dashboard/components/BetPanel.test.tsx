import React from 'react'
import BetProviderMock from '@test/components/BetContextMock'
import { render, screen } from '@testing-library/react'
import BetPanel from './BetPanel'
import { vi } from 'vitest'
import { BetService } from '@/providers/BetService.interface'
import { CreationBetMock } from '@test/mocks/BetMock'
import { Bet } from '@/models/Bet'
import userEvent from '@testing-library/user-event'

describe('Bet Panel Tests', () => {
  it('Should render placeholder text', () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(() => []),
      add: vi.fn(),
      archive: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      resolve: vi.fn(),
    })
    const service = new betServiceMock()

    render(
      <BetProviderMock betService={service}>
        <BetPanel />
      </BetProviderMock>
    )

    expect(screen.getByRole('heading', { name: 'List is empty' })).toBeInTheDocument()
  })

  it('Should render bets', () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(() => [
        {
          ...CreationBetMock,
          id: 'TEST_ID_01',
        },
      ]),
      add: vi.fn(),
      archive: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      resolve: vi.fn(),
    })
    const service = new betServiceMock()

    render(
      <BetProviderMock betService={service}>
        <BetPanel />
      </BetProviderMock>
    )

    expect(
      screen.getByRole('heading', { name: CreationBetMock.title })
    ).toBeInTheDocument()
  })

  it('Should change filter to resolved', async () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(
        () =>
          [
            {
              ...CreationBetMock,
              betResolve: 'person1',
              id: 'TEST_ID_01',
            },
          ] as Bet[]
      ),
      add: vi.fn(),
      archive: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      resolve: vi.fn(),
    })
    const service = new betServiceMock()

    render(
      <BetProviderMock betService={service}>
        <BetPanel />
      </BetProviderMock>
    )

    const resolvedTabBtn = screen.getByRole('button', { name: 'Resolved' })

    await userEvent.click(resolvedTabBtn)

    expect(
      screen.getByRole('heading', { name: CreationBetMock.title })
    ).toBeInTheDocument()
  })

  it('Should change filter to archived', async () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(
        () =>
          [
            {
              ...CreationBetMock,
              archived: true,
              betResolve: 'person1',
              id: 'TEST_ID_01',
            },
          ] as Bet[]
      ),
      add: vi.fn(),
      archive: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      resolve: vi.fn(),
    })
    const service = new betServiceMock()

    render(
      <BetProviderMock betService={service}>
        <BetPanel />
      </BetProviderMock>
    )

    const archivedTabBtn = screen.getByRole('button', { name: 'Archived' })

    await userEvent.click(archivedTabBtn)

    expect(
      screen.getByRole('heading', { name: CreationBetMock.title })
    ).toBeInTheDocument()
  })

  it('Should filter visible bets', async () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(
        () =>
          [
            {
              ...CreationBetMock,
              id: 'TEST_ID_01',
            },
            {
              ...CreationBetMock,
              title: 'Value filtered',
              id: 'TEST_ID_02',
            },
          ] as Bet[]
      ),
      add: vi.fn(),
      archive: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      resolve: vi.fn(),
    })
    const service = new betServiceMock()

    render(
      <BetProviderMock betService={service}>
        <BetPanel />
      </BetProviderMock>
    )

    const filterInput = screen.getByRole('textbox', { name: 'Filter Bets' })

    expect(
      screen.getByRole('heading', { name: CreationBetMock.title })
    ).toBeInTheDocument()

    await userEvent.type(filterInput, 'Value fil')

    expect(
      screen.queryByRole('heading', { name: CreationBetMock.title })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Value filtered' })).toBeInTheDocument()
  })

  it('Should show confirmation before delete', async () => {
    const removeMock = vi.fn()
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(
        () =>
          [
            {
              ...CreationBetMock,
              id: 'TEST_ID_01',
            },
          ] as Bet[]
      ),
      add: vi.fn(),
      archive: vi.fn(),
      update: vi.fn(),
      remove: removeMock,
      resolve: vi.fn(),
    })
    const service = new betServiceMock()

    render(
      <BetProviderMock betService={service}>
        <BetPanel />
      </BetProviderMock>
    )

    const menuOption = screen.getByRole('menuitem', { name: 'Delete' })

    await userEvent.click(menuOption)

    expect(screen.getByRole('dialog')).toHaveTextContent('Delete bet')

    const acceptBtn = screen.getByRole('button', { name: 'Ok' })

    await userEvent.click(acceptBtn)

    expect(removeMock).toHaveBeenCalledTimes(1)
  })
})
