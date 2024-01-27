import React from 'react'

import { DatabaseType, SettingsProps } from '../settings.interface'
import SettingsLocal from './SettingsLocal'
import SettingsFirebase from './SettingsFirebase'

type SettingsFactoryProps = SettingsProps & { type: DatabaseType }

function Settings({ type, save, initialConfig }: SettingsFactoryProps) {
  switch (type) {
    case 'local':
      return <SettingsLocal save={save} />
    case 'firebase':
      return <SettingsFirebase save={save} initialConfig={initialConfig} />
    default:
      throw Error('Unsupported settings!')
  }
}
export default Settings
