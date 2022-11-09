import { DefaultButton, Stack, TextField } from '@fluentui/react'
import React, { useEffect } from 'react'
import { ServerConfig } from '../models/DatabaseConnector'
import { loadDatabaseConfig, saveDatabaseConfig } from '../utils/LocalStorageUtils'

const initialConfig: ServerConfig = {
  serverUrl: 'http://localhost:8000',
}

interface Props {
  save: (config: ServerConfig) => void
}
export const SettingsServer: React.FC<Props> = ({ save }) => {
  const [config, setConfig] = React.useState<ServerConfig>(initialConfig)

  useEffect(() => {
    const conf = loadDatabaseConfig('server')
    if ('serverUrl' in conf) {
      setConfig(conf as ServerConfig)
    }
  }, [])

  const handleChange = (value: string | undefined, key: keyof ServerConfig) => {
    const updateValue = { [key]: value || '' }
    setConfig((conf) => ({
      ...conf,
      ...updateValue,
    }))
  }

  const handleApply = () => {
    saveDatabaseConfig(config, 'server')
    save(config)
  }
  return (
    <>
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          label="Server URL"
          value={config.serverUrl}
          onChange={(_, e) => handleChange(e, 'serverUrl')}
        />
        <DefaultButton text="Save" onClick={handleApply} />
      </Stack>
    </>
  )
}
