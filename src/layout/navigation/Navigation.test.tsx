import React from 'react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import BetProviderMock from '@test/components/BetContextMock'
import { BetService } from '@/providers/BetService.interface'
import Navigation from './Navigation'

describe('Navigation Tests', () => {
  it('Should render navigation link to dashboard', () => {
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
      <MemoryRouter>
        <BetProviderMock betService={service}>
          <Navigation />
        </BetProviderMock>
      </MemoryRouter>
    )
    const navigationEl = screen.getByRole('navigation')
    expect(navigationEl).toHaveTextContent('Dashboard')
  })
  it('Should render navigation link to settings', () => {
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
      <MemoryRouter>
        <BetProviderMock betService={service}>
          <Navigation />
        </BetProviderMock>
      </MemoryRouter>
    )
    const navigationEl = screen.getByRole('navigation')
    expect(navigationEl).toHaveTextContent('Settings')
  })
})
