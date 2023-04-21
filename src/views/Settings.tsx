/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react'
import {
  DefaultButton,
  Dialog,
  DialogType,
  Dropdown,
  Icon,
  IconButton,
  IDropdownOption,
  PrimaryButton,
  Stack,
  TextField,
  TooltipHost,
} from '@fluentui/react'
import { SettingsServer } from '../components/SettingsServer'
import { SettingsFirebase } from '../components/SettingsFirebase'
import { SettingsLocal } from '../components/SettingsLocal'
import { DatabaseConfig, DatabaseType } from '../models/DatabaseConnector'
import { DatabaseContext } from '../providers/DatabaseProvider'
import { PushNotificationContext } from '../providers/PushNotificationService'

const databaseOptions: IDropdownOption[] = [
  {
    key: 'local',
    text: 'Local Storage',
  },
  {
    key: 'server',
    text: 'Node server',
  },
  {
    key: 'firebase',
    text: 'Firebase',
  },
]

const dialogContentProps = {
  type: DialogType.normal,
  title: 'Firebase Cloud Messaging Token',
}

export const SettingsPage: React.FC = () => {
  const dbConsumer = React.useContext(DatabaseContext)
  const pushService = React.useContext(PushNotificationContext)
  const [configType, setConfigType] = React.useState<DatabaseType>(
    dbConsumer.database.type
  )

  const [preConfig, setPreConfig] = React.useState<DatabaseConfig | null>()
  const [selectedDatabase, setSelectedDatabase] = React.useState<
    IDropdownOption | undefined
  >(findActiveDatabaseOption())
  const [hideDialog, setHideDialog] = useState<boolean>(true)

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
      case 'server':
        return <SettingsServer save={handleSave} />
      case 'firebase':
        return <SettingsFirebase save={handleSave} />
      default:
        return <SettingsLocal save={handleSave} />
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pushService.getToken())
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

      <header className="flex flex-space-between align-center">
        <h2>Notification provider</h2>
        <div className="notification-btns">
          <DefaultButton
            onClick={() => setHideDialog(false)}
            text="Get FCM Token"
            disabled={pushService.getToken() === ''}
          />
        </div>
      </header>
      <Dialog
        hidden={hideDialog}
        onDismiss={() => setHideDialog(true)}
        dialogContentProps={dialogContentProps}>
        <div className="token-wrapper">
          <Stack horizontal verticalAlign="end">
            <TextField
              label="Token value"
              readOnly
              defaultValue={pushService.getToken()}
            />
            <div className="copy-icon">
              <TooltipHost content="Copy to clipboard" id="copy_tooltip">
                <IconButton
                  iconProps={{ iconName: 'copy' }}
                  aria-label="Copy"
                  onClick={handleCopy}
                />
              </TooltipHost>
            </div>
          </Stack>
        </div>
      </Dialog>
    </div>
  )
}

export default SettingsPage
