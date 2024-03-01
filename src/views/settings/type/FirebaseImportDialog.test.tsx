import React from 'react'
import { vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FirebaseImportDialog from './FirebaseImportDialog'

describe('Firebase Import Dialog Tests', () => {
  it('Should get config from input', async () => {
    const onCloseMock = vi.fn()
    render(<FirebaseImportDialog open={true} onClose={onCloseMock} />)

    const configTextField = screen.getByLabelText('Firebase config json')

    await fireEvent.change(configTextField, {
      target: {
        value: `{"apiKey":"API_KEY","authDomain":"AUTH_DOMAIN","projectId":"BetKeeperFirebaseTest","storageBucket":"STORAGE_BUCKET","messagingSenderId":"000000000001","appId":"1:000000000001:web:0000000000000000000001"}`,
      },
    })

    const importBtn = screen.getByRole('button', { name: 'Import' })

    await userEvent.click(importBtn)

    expect(onCloseMock).toHaveBeenCalledWith({
      apiKey: 'API_KEY',
      appId: '1:000000000001:web:0000000000000000000001',
      authDomain: 'AUTH_DOMAIN',
      messagingSenderId: '000000000001',
      projectId: 'BetKeeperFirebaseTest',
      storageBucket: 'STORAGE_BUCKET',
    })
  })

  it('Should throw error if missing prop', async () => {
    const onCloseMock = vi.fn()
    render(<FirebaseImportDialog open={true} onClose={onCloseMock} />)

    const configTextField = screen.getByLabelText('Firebase config json')

    await fireEvent.change(configTextField, {
      target: {
        value: `{"authDomain":"AUTH_DOMAIN","projectId":"BetKeeperFirebaseTest","storageBucket":"STORAGE_BUCKET","messagingSenderId":"000000000001","appId":"1:000000000001:web:0000000000000000000001"}`,
      },
    })

    const importBtn = screen.getByRole('button', { name: 'Import' })

    await userEvent.click(importBtn)

    expect(onCloseMock).not.toHaveBeenCalled()

    expect(screen.getByText('apiKey property is missing!')).toBeVisible()
  })

  it('Should throw error when invalid config', async () => {
    const onCloseMock = vi.fn()
    render(<FirebaseImportDialog open={true} onClose={onCloseMock} />)

    const configTextField = screen.getByLabelText('Firebase config json')

    await fireEvent.change(configTextField, {
      target: {
        value: `"authDomain:"AUTH_DOMAIN","projectId":"BetKeeperFirebaseTest","storageBucket":"STORAGE_BUCKET","messagingSenderId":"000000000001","appId":"1:000000000001:web:0000000000000000000001"}`,
      },
    })

    const importBtn = screen.getByRole('button', { name: 'Import' })

    await userEvent.click(importBtn)

    expect(onCloseMock).not.toHaveBeenCalled()

    expect(screen.getByText('Unable to parse config!')).toBeVisible()
  })
})
