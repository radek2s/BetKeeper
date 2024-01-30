import React from 'react'
import { render, screen } from '@testing-library/react'
import Settings from './SettingsFactory'
import { vi } from 'vitest'
import SettingsFirebase from './SettingsFirebase'
import userEvent from '@testing-library/user-event'

describe('Settings Factory Test', () => {
  it('Should render local settings', () => {
    const saveMock = vi.fn()

    render(<Settings type="local" save={saveMock} />)

    expect(screen.getByTestId('settings-local')).toBeInTheDocument()
  })

  it('Should render firebase settings', () => {
    const saveMock = vi.fn()

    render(<Settings type="firebase" save={saveMock} />)

    expect(screen.getByTestId('settings-firebase')).toBeInTheDocument()
  })
})

describe('Settings Firebase Tests', () => {
  describe('Load initial config', () => {
    beforeEach(() => {
      const saveMock = vi.fn()
      const initialConfig = {
        apiKey: 'API_KEY',
        appId: '1:000000000001:web:0000000000000000000001',
        authDomain: 'AUTH_DOMAIN',
        messagingSenderId: '000000000001',
        projectId: 'BetKeeperFirebaseTest',
        storageBucket: 'STORAGE_BUCKET',
      }
      render(<SettingsFirebase save={saveMock} initialConfig={initialConfig} />)
    })

    it('Should have apiKey value', () => {
      const input = screen.getByRole('textbox', { name: 'API Key' })
      expect(input).toHaveValue('API_KEY')
    })
    it('Should have Authentication Domain value', () => {
      const input = screen.getByRole('textbox', { name: 'Authentication Domain' })
      expect(input).toHaveValue('AUTH_DOMAIN')
    })
    it('Should have Project ID value', () => {
      const input = screen.getByRole('textbox', { name: 'Project ID' })
      expect(input).toHaveValue('BetKeeperFirebaseTest')
    })
    it('Should have Storage Bucket value', () => {
      const input = screen.getByRole('textbox', { name: 'Storage Bucket' })
      expect(input).toHaveValue('STORAGE_BUCKET')
    })
    it('Should have Messaging Sender ID value', () => {
      const input = screen.getByRole('textbox', { name: 'Messaging Sender ID' })
      expect(input).toHaveValue('000000000001')
    })
    it('Should have Application ID value', () => {
      const input = screen.getByRole('textbox', { name: 'Application ID' })
      expect(input).toHaveValue('1:000000000001:web:0000000000000000000001')
    })
  })

  it('Should save settings', async () => {
    const saveMock = vi.fn()
    const initialConfig = {
      apiKey: 'API_KEY',
      appId: '1:000000000001:web:0000000000000000000001',
      authDomain: 'AUTH_DOMAIN',
      messagingSenderId: '000000000001',
      projectId: 'BetKeeperFirebaseTest',
      storageBucket: 'STORAGE_BUCKET',
    }
    render(<SettingsFirebase save={saveMock} initialConfig={initialConfig} />)

    const input = screen.getByRole('textbox', { name: 'Project ID' })

    await userEvent.type(input, 'Modified')

    const actionBtn = screen.getByRole('button', { name: 'Save' })

    await userEvent.click(actionBtn)

    expect(saveMock).toHaveBeenCalledWith({
      apiKey: 'API_KEY',
      appId: '1:000000000001:web:0000000000000000000001',
      authDomain: 'AUTH_DOMAIN',
      messagingSenderId: '000000000001',
      projectId: 'BetKeeperFirebaseTestModified',
      storageBucket: 'STORAGE_BUCKET',
    })
  })
})
