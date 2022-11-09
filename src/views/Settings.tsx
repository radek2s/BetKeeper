/* eslint-disable @typescript-eslint/no-empty-function */
import { Dropdown, Icon, IDropdownOption, PrimaryButton, Stack } from '@fluentui/react'
import React from 'react'
import { SettingsServer } from '../components/SettingsServer'
import { SettingsFirebase } from '../components/SettingsFirebase'
import { SettingsLocal } from '../components/SettingsLocal'
import { DatabaseConfig, DatabaseType } from '../models/DatabaseConnector'
import { DatabaseContext } from '../providers/DatabaseProvider'

const databaseOptions: IDropdownOption[] = [
  {
    key: 'local',
    text: 'Local Storage',
  },
  {
    key: 'dedicated',
    text: 'Node server',
  },
  {
    key: 'firebase',
    text: 'Firebase',
  },
]

export const SettingsPage: React.FC = () => {
  const dbConsumer = React.useContext(DatabaseContext)
  const [configType, setConfigType] = React.useState<DatabaseType>(
    dbConsumer.database.type
  )

  const [preConfig, setPreConfig] = React.useState<DatabaseConfig | null>()
  const [selectedDatabase, setSelectedDatabase] = React.useState<
    IDropdownOption | undefined
  >(findActiveDatabaseOption())

  function findActiveDatabaseOption(): IDropdownOption | undefined {
    return databaseOptions.find((option) => option.key === dbConsumer.database.type)
  }

  const onChange = (e: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    setPreConfig(null)
    setSelectedDatabase(item)
  }

  const handleSave = (config: DatabaseConfig) => {
    setPreConfig(config)
    if ('apiKey' in config) {
      setConfigType('firebase')
    } else if ('serverUrl' in config) {
      setConfigType('server')
    } else {
      setConfigType('local')
    }
  }

  const handleConnect = () => {
    if (!preConfig) return
    dbConsumer.setConnection({ type: configType, config: preConfig })
    setPreConfig(null)
  }

  const getIconName = (): string => {
    switch (dbConsumer.database.type) {
      case 'firebase':
        return 'firebase-svg'
      case 'server':
        return 'database-svg'
      default:
        return 'local-svg'
    }
  }
  const getServiceName = (): string => {
    switch (dbConsumer.database.type) {
      case 'firebase':
        return 'Firebase'
      case 'server':
        return 'Node server'
      default:
        return 'Local storage'
    }
  }

  const renderSettings = (option: string | number | undefined): JSX.Element => {
    switch (option) {
      case 'dedicated':
        return <SettingsServer save={handleSave} />
      case 'firebase':
        return <SettingsFirebase save={handleSave} />
      default:
        return <SettingsLocal save={handleSave} />
    }
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <header className="flex flex-space-between">
        <h2>Database source</h2>
        <div className="connection-status">
          <p className="label">Active connection</p>
          <div className="type">
            <span>{getServiceName()}</span>
            <Icon iconName={getIconName()} />
          </div>
        </div>
      </header>

      <Stack tokens={{ childrenGap: 20 }}>
        <Dropdown
          placeholder="Select"
          label="Database connection"
          selectedKey={selectedDatabase ? selectedDatabase.key : undefined}
          onChange={onChange}
          options={databaseOptions}
        />
        {renderSettings(selectedDatabase?.key)}
        <PrimaryButton text="Connect" disabled={!preConfig} onClick={handleConnect} />
      </Stack>
    </div>
  )
}

export default SettingsPage
