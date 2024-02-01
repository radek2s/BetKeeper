import React from 'react'
import { render, screen } from '@testing-library/react'
import ManageBetDialog from './ManageBetDialog'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BasicBetMock, CreationBetMock } from '@test/mocks/BetMock'

describe('Manage Bet Dialog Tests', () => {
  describe('Renderer', () => {
    it('Should not render dialog when visible=false', () => {
      render(<ManageBetDialog visible={false} onClose={vi.fn()} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    it('Should render default create dialog when visible=true', () => {
      render(<ManageBetDialog visible={true} onClose={vi.fn()} />)
      expect(screen.getByRole('heading')).toHaveTextContent('Create bet')
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
    })
    it('Should render edit dialog', () => {
      render(<ManageBetDialog visible={true} onClose={vi.fn()} variant="edit" />)
      expect(screen.getByRole('heading')).toHaveTextContent('Edit bet')
      expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
    })
  })

  it('Should close dialog', async () => {
    const onCloseMock = vi.fn()
    render(<ManageBetDialog visible={true} onClose={onCloseMock} />)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  describe('Creation', () => {
    it('Should create bet', async () => {
      const onCloseMock = vi.fn()
      render(<ManageBetDialog visible={true} onClose={onCloseMock} />)
      await userEvent.type(
        screen.getByRole('textbox', { name: 'Title' }),
        CreationBetMock.title
      )
      await userEvent.type(
        screen.getByRole('textbox', { name: 'Description' }),
        CreationBetMock.description
      )
      await userEvent.type(
        screen.getByRole('textbox', { name: 'Resolve 1' }),
        CreationBetMock.option1
      )
      await userEvent.type(
        screen.getByRole('textbox', { name: 'Resolve 2' }),
        CreationBetMock.option2
      )
      await userEvent.click(screen.getByRole('button', { name: 'Create' }))

      expect(onCloseMock).toHaveBeenCalledWith(CreationBetMock)
    })
  })

  describe('Update', () => {
    it('Should load initial data to from', () => {
      render(
        <ManageBetDialog
          initialData={{ ...BasicBetMock, betResolve: 'pending' }}
          visible={true}
          onClose={vi.fn()}
          variant="edit"
        />
      )
      expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue(
        BasicBetMock.title
      )
      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
        BasicBetMock.description
      )
      expect(screen.getByRole('textbox', { name: 'Resolve 1' })).toHaveValue(
        BasicBetMock.option1
      )
      expect(screen.getByRole('textbox', { name: 'Resolve 2' })).toHaveValue(
        BasicBetMock.option2
      )
    })

    it('Should update bet data', async () => {
      const onCloseMock = vi.fn()
      render(
        <ManageBetDialog
          initialData={{ ...BasicBetMock, betResolve: 'pending' }}
          visible={true}
          onClose={onCloseMock}
          variant="edit"
        />
      )
      const titleField = screen.getByRole('textbox', { name: 'Title' })
      await userEvent.clear(titleField)
      await userEvent.type(titleField, CreationBetMock.title)
      await userEvent.click(screen.getByRole('button', { name: 'Update' }))

      expect(onCloseMock).toHaveBeenCalledWith({
        ...BasicBetMock,
        title: CreationBetMock.title,
        betResolve: 'pending',
      })
    })
  })
})
