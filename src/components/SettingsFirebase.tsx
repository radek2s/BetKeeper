import { DefaultButton, Stack, TextField } from '@fluentui/react'
import React, { useEffect } from 'react'
import { FirebaseConfig } from '../models/DatabaseConnector'
import { loadDatabaseConfig, saveDatabaseConfig } from '../utils/LocalStorageUtils'

const initialConfig: FirebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

interface Props {
  save: (config: FirebaseConfig) => void
}
export const SettingsFirebase: React.FC<Props> = ({ save }) => {
  const [config, setConfig] = React.useState<FirebaseConfig>(initialConfig)

  useEffect(() => {
    const conf = loadDatabaseConfig('firebase')
    if ('apiKey' in conf) {
      setConfig(conf as FirebaseConfig)
    }
  }, [])

  const handleChange = (value: string | undefined, key: keyof FirebaseConfig) => {
    const updateValue = { [key]: value || '' }
    setConfig((conf) => ({
      ...conf,
      ...updateValue,
    }))
  }

  const handleApply = () => {
    saveDatabaseConfig(config, 'firebase')
    save(config)
  }

  return (
    <>
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          label="API Key"
          value={config.apiKey}
          onChange={(_, e) => handleChange(e, 'apiKey')}
        />
        <TextField
          label="Authentication Domain"
          value={config.authDomain}
          onChange={(_, e) => handleChange(e, 'authDomain')}
        />
        <TextField
          label="Project ID"
          value={config.projectId}
          onChange={(_, e) => handleChange(e, 'projectId')}
        />
        <TextField
          label="Storage Bucket"
          value={config.storageBucket}
          onChange={(_, e) => handleChange(e, 'storageBucket')}
        />
        <TextField
          label="Messaging Sender ID"
          value={config.messagingSenderId}
          onChange={(_, e) => handleChange(e, 'messagingSenderId')}
        />
        <TextField
          label="Application ID"
          value={config.appId}
          onChange={(_, e) => handleChange(e, 'appId')}
        />
        <DefaultButton text="Save" onClick={handleApply} />
      </Stack>
    </>
  )
}
