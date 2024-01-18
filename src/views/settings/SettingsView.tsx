import React, { ChangeEvent, useState } from 'react'
import Settings from './type/SettingsFactory'
import { DatabaseConfig, DatabaseType } from '../../models/DatabaseConnector'
import { FirebaseConfig, useDataSourceContext } from '../../providers/DataSourceProvider'

function SettingsView() {
  const { datasource, setDatasource } = useDataSourceContext()
  const [type, setType] = useState<DatabaseType>(datasource.type)

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as DatabaseType)
  }

  const handleSave = (config: DatabaseConfig) => {
    switch (type) {
      case 'local':
        setDatasource({ type: 'local' })
        break
      case 'firebase':
        setDatasource({ type: 'firebase', ...(config as FirebaseConfig) })
        break
      default:
        console.error(`Type=${type} not recoginized`)
    }
  }

  return (
    <div>
      <h1>Settings</h1>
      <div className="my-4">
        <div className="flex flex-col">
          <label>Database connection</label>
          <select onChange={handleChange} value={type}>
            <option value="local">Local Storage</option>
            <option value="firebase">Firebase</option>
          </select>
        </div>
        <Settings type={type} save={handleSave} initialConfig={datasource} />
      </div>
    </div>
  )
}

export default SettingsView
