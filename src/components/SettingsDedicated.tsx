import { DefaultButton, Stack, TextField } from '@fluentui/react'
import React, { useEffect } from 'react'
import { DedicatedConfig } from '../models/DatabaseConnector'
import { loadDatabaseConfig, saveDatabaseConfig } from '../utils/LocalStorageUtils'

const initialConfig: DedicatedConfig = {
  serverUrl: 'http://localhost:8000',
}

interface Props {
  save: (config: DedicatedConfig) => void
}
export const SettingsDedicated: React.FC<Props> = ({ save }) => {
  const [config, setConfig] = React.useState<DedicatedConfig>(initialConfig)

  useEffect(() => {
    const conf = loadDatabaseConfig('dedicated')
    if ('serverUrl' in conf) {
      setConfig(conf as DedicatedConfig)
    }
  }, [])

  const handleChange = (value: string | undefined, key: keyof DedicatedConfig) => {
    const updateValue = { [key]: value || '' }
    setConfig((conf) => ({
      ...conf,
      ...updateValue,
    }))
  }

  const handleApply = () => {
    saveDatabaseConfig(config, 'dedicated')
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
