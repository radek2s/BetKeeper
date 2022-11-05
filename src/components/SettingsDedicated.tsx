import React from 'react'
import { DedicatedConfig } from '../models/DatabaseConnector'

interface Props {
  save: (config: DedicatedConfig) => void
}
export const SettingsDedicated: React.FC<Props> = ({ save }) => {
  const handleClick = () => {
    save({
      serverUrl: (document.getElementById('cnf-server-url') as HTMLInputElement).value,
    })
  }
  return (
    <>
      <h2>Dedicated server connector settings</h2>
      <div>
        <input id="cnf-server-url" placeholder="Server url" />
      </div>
      <button onClick={handleClick}>Save</button>
    </>
  )
}
