import { DefaultButton, Stack } from '@fluentui/react'
import React from 'react'
import { DatabaseConfig } from '../models/DatabaseConnector'
import { saveDatabaseConfig } from '../utils/LocalStorageUtils'

interface Props {
  save: (config: DatabaseConfig) => void
}
// eslint-disable-next-line react/prop-types
export const SettingsLocal: React.FC<Props> = ({ save }) => {
  const handleApply = () => {
    saveDatabaseConfig({}, 'local')
    save({})
  }
  return (
    <>
      <Stack tokens={{ childrenGap: 10 }}>
        <DefaultButton text="Save" onClick={handleApply} />
      </Stack>
    </>
  )
}
