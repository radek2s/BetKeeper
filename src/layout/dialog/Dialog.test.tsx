import React from 'react'
import { render, renderHook, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dialog from './Dialog'
import { vi } from 'vitest'
import useDialog from './useDialog'

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

describe('useDialog Test', () => {
  it('Should change visible state', () => {
    const { result } = renderHook(() => useDialog())

    expect(result.current.visible).toBe(false)

    act(() => {
      result.current.show()
    })

    expect(result.current.visible).toBe(true)
  })

  it('Should hide change to visible false', () => {
    const { result } = renderHook(() => useDialog(true))

    expect(result.current.visible).toBe(true)

    act(() => {
      result.current.hide()
    })

    expect(result.current.visible).toBe(false)
  })
})
