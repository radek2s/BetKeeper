import React from 'react'
import { render, screen } from '@testing-library/react'
import BetItem from '.'
import { BasicBetMock } from '@test/mocks/BetMock'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Bet Item Tests', () => {
  describe('Bet Props Rendering', () => {
    describe('Render bet data', () => {
      it('Should render title', () => {
        render(
          <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
        )
        expect(
          screen.getByRole('heading', { name: BasicBetMock.title })
        ).toBeInTheDocument()
      })
      it('Should render description', () => {
        render(
          <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
        )
        expect(screen.getByRole('contentinfo')).toHaveTextContent(
          BasicBetMock.description
        )
      })
      it('Should render resolve button', () => {
        render(
          <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
        )
        expect(screen.getByRole('button', { name: 'Resolve' })).toBeInTheDocument()
      })
      it('Should not render menu button', () => {
        render(
          <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
        )
        expect(
          screen.queryByRole('button', { name: 'Bet Menu Button' })
        ).not.toBeInTheDocument()
      })
      it('Should not be expanded', () => {
        render(
          <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
        )
        expect(screen.queryAllByRole('option')).toHaveLength(0)
      })
    })
    describe('Render bet actions', () => {
      it('Should render and click edit menu option', async () => {
        const actionMock = vi.fn()
        render(
          <BetItem
            bet={{ ...BasicBetMock, betResolve: 'pending' }}
            onResolve={vi.fn()}
            onEdit={actionMock}
          />
        )
        const menuOption = screen.getByRole('menuitem', { name: 'Edit' })

        expect(menuOption).toBeInTheDocument()

        await userEvent.click(menuOption)

        expect(actionMock).toHaveBeenCalledTimes(1)
      })

      it('Should render and click archive menu option', async () => {
        const actionMock = vi.fn()
        render(
          <BetItem
            bet={{ ...BasicBetMock, betResolve: 'pending' }}
            onResolve={vi.fn()}
            onArchive={actionMock}
          />
        )
        const menuOption = screen.getByRole('menuitem', { name: 'Archive' })

        expect(menuOption).toBeInTheDocument()

        await userEvent.click(menuOption)

        expect(actionMock).toHaveBeenCalledTimes(1)
      })

      it('Should render and click restore menu option', async () => {
        const actionMock = vi.fn()
        render(
          <BetItem
            bet={{ ...BasicBetMock, betResolve: 'pending' }}
            onResolve={vi.fn()}
            onRestore={actionMock}
          />
        )
        const menuOption = screen.getByRole('menuitem', { name: 'Restore' })

        expect(menuOption).toBeInTheDocument()

        await userEvent.click(menuOption)

        expect(actionMock).toHaveBeenCalledTimes(1)
      })

      it('Should render and click delete menu option', async () => {
        const actionMock = vi.fn()
        render(
          <BetItem
            bet={{ ...BasicBetMock, betResolve: 'pending' }}
            onResolve={vi.fn()}
            onDelete={actionMock}
          />
        )
        const menuOption = screen.getByRole('menuitem', { name: 'Delete' })

        expect(menuOption).toBeInTheDocument()

        await userEvent.click(menuOption)

        expect(actionMock).toHaveBeenCalledTimes(1)
      })

      it('Should not render resolve button when readonly mode', () => {
        render(
          <BetItem
            bet={{ ...BasicBetMock, betResolve: 'pending' }}
            onResolve={vi.fn()}
            readonly
          />
        )
        expect(screen.queryByRole('button', { name: 'Resolve' })).not.toBeInTheDocument()
      })
    })
  })

  describe('Bet actins', () => {
    it('Should expand and show options', async () => {
      render(
        <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
      )
      const expandBtn = screen.getByRole('button', { name: 'expand-button' })
      await userEvent.click(expandBtn)

      const options = screen.queryAllByRole('option')
      expect(options).toHaveLength(2)
      expect(options.at(0)).toHaveTextContent(BasicBetMock.option1)
      expect(options.at(1)).toHaveTextContent(BasicBetMock.option2)
    })

    it('Should resolve action open dialog', async () => {
      render(
        <BetItem bet={{ ...BasicBetMock, betResolve: 'pending' }} onResolve={vi.fn()} />
      )
      const resolveBtn = screen.getByRole('button', { name: 'Resolve' })
      await userEvent.click(resolveBtn)

      expect(screen.getByRole('dialog')).toHaveTextContent('Resolve Bet')
    })
  })
})
