import React, { ChangeEvent, useState } from 'react'
import Settings from './type/SettingsFactory'
import { DatabaseConfig, DatabaseType } from '../../models/DatabaseConnector'
import { DatabaseContext } from '../../providers/DatabaseProvider'

function SettingsView() {
  const { database, setConnection } = React.useContext(DatabaseContext) //TODO: Improve useContext
  const [type, setType] = useState<DatabaseType>(database.type)
  //TODO: Handle service provider change
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as DatabaseType)
  }

  const handleSave = (config: DatabaseConfig) => {
    setConnection({ type, config })
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
        <Settings type={type} save={handleSave} initialConfig={database.config} />
      </div>
    </div>
  )
}

export default SettingsView
