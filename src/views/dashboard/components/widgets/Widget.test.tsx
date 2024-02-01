import React from 'react'
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import BetProviderMock from '@test/components/BetContextMock'
import { CreationBetMock } from '@test/mocks/BetMock'

import { BetService } from '@/providers/BetService.interface'
import { Bet } from '@/models/Bet'
import MonthlySummary from './MonthlySummary'
import OverallSummary from './OverallSummary'
import DashboardCreateBetCard from './DashboardCreateBetCard'
import userEvent from '@testing-library/user-event'

describe('Monthly summary tests', () => {
  it('Should render pending and resolved values', () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(
        () =>
          [
            {
              ...CreationBetMock,
              id: 'TEST_ID_01',
              betResolve: 'person1',
            },
            {
              ...CreationBetMock,
              id: 'TEST_ID_02',
            },
            {
              ...CreationBetMock,
              id: 'TEST_ID_03',
            },
            {
              ...CreationBetMock,
              id: 'TEST_ID_04',
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
        <MonthlySummary />
      </BetProviderMock>
    )

    const pendingBox = screen.getByRole('note', { name: 'Pending' })
    expect(pendingBox).toHaveTextContent('3pending')

    const resolvedBox = screen.getByRole('note', { name: 'Resolved' })
    expect(resolvedBox).toHaveTextContent('1resolved')
  })
})

describe('Overall summary tests', () => {
  it('Should render pending and resolved percentage values', () => {
    const betServiceMock = vi.fn<BetService[], BetService>().mockReturnValue({
      getAll: vi.fn().mockImplementation(
        () =>
          [
            {
              ...CreationBetMock,
              id: 'TEST_ID_01',
              betResolve: 'person1',
            },
            {
              ...CreationBetMock,
              id: 'TEST_ID_02',
            },
            {
              ...CreationBetMock,
              id: 'TEST_ID_03',
            },
            {
              ...CreationBetMock,
              id: 'TEST_ID_04',
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
        <OverallSummary />
      </BetProviderMock>
    )

    const pendingBox = screen.getByRole('note', { name: 'Pending overall' })
    expect(pendingBox).toHaveTextContent('75%pending')

    const resolvedBox = screen.getByRole('note', { name: 'Resolved overall' })
    expect(resolvedBox).toHaveTextContent('25%resolved')
  })
})

describe('Create Bet Card Tests', () => {
  it('Should show dialog when user click and create bet', async () => {
    const onCreateMock = vi.fn()

    render(<DashboardCreateBetCard onCreate={onCreateMock} />)

    const newBetCard = screen.getByRole('button', { name: 'Create new bet card' })
    await userEvent.click(newBetCard)

    expect(screen.getByRole('dialog')).toHaveTextContent('Create bet')

    const acceptBtn = screen.getByRole('button', { name: 'Create' })
    await userEvent.click(acceptBtn)

    expect(onCreateMock).toHaveBeenCalledTimes(1)
  })
})
