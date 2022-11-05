/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { SettingsDedicated } from '../components/SettingsDedicated'
import { SettingsFirebase } from '../components/SettingsFirebase'
import {
  DatabaseConfig,
  DatabaseType,
  DedicatedConfig,
  FirebaseConfig,
} from '../models/DatabaseConnector'
import { DatabaseContext } from '../providers/DatabaseProvider'

export const SettingsPage: React.FC = () => {
  const dbConsumer = React.useContext(DatabaseContext)
  const [configType, setConfigType] = React.useState<DatabaseType>(
    dbConsumer.database.type
  )

  const handleChange = () => {
    if (dbConsumer.database.type === 'firebase') {
      dbConsumer.setConnection({ type: 'dedicated', config: { serverUrl: 'hans' } })
    } else {
      dbConsumer.setConnection({ type: 'firebase', config: { apiKey: 'testing' } })
    }
  }

  const toggleSettings = () => {
    const nextSection = configType === 'dedicated' ? 'firebase' : 'dedicated'
    setConfigType(nextSection)
  }

  const handleSave = (config: DatabaseConfig) => {
    dbConsumer.setConnection({ type: configType, config })
  }

  return (
    <div>
      <h1>Settings</h1>
      <p>Using type: {dbConsumer.database.type}</p>
      <button onClick={toggleSettings}>Change type</button>
      {configType === 'dedicated' ? (
        <SettingsDedicated save={handleSave} />
      ) : (
        <SettingsFirebase save={handleSave} />
      )}
    </div>
  )
}

export default SettingsPage
