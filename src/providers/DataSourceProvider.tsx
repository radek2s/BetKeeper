'use client'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { BetProvider } from './BetProvider'
import { useNotification } from './NotificationProvider'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataSourceConfig {}

export interface ServerConfig extends DataSourceConfig {
  serverUrl: string
}

export interface FirebaseConfig extends DataSourceConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export const isFirebaseConfig = (
  config: DataSource
): config is { type: 'firebase' } & FirebaseConfig => {
  return config.type === 'firebase'
}

export type DataSource = { type: 'local' } | ({ type: 'firebase' } & FirebaseConfig)
export type DataSourceService = {
  datasource: DataSource
  setDatasource: (datasource: DataSource) => void
}

export const DataSourceContext = createContext<DataSourceService | null>(null)
const DATASOURCE_KEY = 'bet-datasource'

const datasourceString = {
  local: 'Local Browser Memory',
  firebase: 'Google Firebase Database',
}

interface DataSourceProviderProps {
  children: ReactNode
}
export function DataSourceProvider({ children }: DataSourceProviderProps) {
  const [datasource, setDatasource] = useState<DataSource>({ type: 'local' })
  const { showNotification } = useNotification()

  useEffect(() => {
    loadDataSourceSettings()
  }, [])

  function handleDatasourceChange(datasource: DataSource) {
    setDatasource(datasource)
    saveDataSourceSettings(datasource)
    showNotification(
      'Changed datasource',
      `Successfully changed to ${datasourceString[datasource.type]}`
    )
  }

  function loadDataSourceSettings() {
    const settings = JSON.parse(
      localStorage.getItem(DATASOURCE_KEY) || '{ "type": "local" }'
    )
    setDatasource(settings as DataSource)
  }

  function saveDataSourceSettings(datasource: DataSource) {
    localStorage.setItem(DATASOURCE_KEY, JSON.stringify(datasource))
  }

  return (
    <DataSourceContext.Provider
      value={{ datasource, setDatasource: handleDatasourceChange }}>
      <div key={datasource.type}>
        <BetProvider datasource={datasource}>{children}</BetProvider>
      </div>
    </DataSourceContext.Provider>
  )
}

export function useDataSourceContext() {
  const context = useContext(DataSourceContext)

  if (context == null) throw new Error('DataSourceProivder must be in the scope')

  return context
}
