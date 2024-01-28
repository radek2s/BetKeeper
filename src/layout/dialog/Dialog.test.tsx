import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dialog from './Dialog'
import { vi } from 'vitest'

describe('Dialog Component Test', () => {
  it('Should be visible when open=true', () => {
    render(
      <Dialog open={true}>
        <div role="banner">Example test content</div>
      </Dialog>
    )

    const dialog = screen.getByRole('banner')

    expect(dialog).toBeVisible()
  })

  it('Should not be rendered when open=false', async () => {
    render(
      <Dialog open={false}>
        <div role="banner">Example test content</div>
      </Dialog>
    )

    const dialog = await screen.queryByRole('banner')

    expect(dialog).not.toBeInTheDocument()
  })

  it('Should close on outer click', async () => {
    const onCloseMock = vi.fn()
    const renderResult = await render(
      <Dialog open={true} onClose={onCloseMock}>
        <div role="banner">Example test content</div>
      </Dialog>
    )

    const backdropEl =
      renderResult.baseElement.getElementsByClassName('dialog__backdrop')[0]

    expect(backdropEl.classList.contains('dialog__backdrop')).toBe(true)

    await userEvent.click(backdropEl)

    expect(onCloseMock).toBeCalledTimes(1)
  })
})
