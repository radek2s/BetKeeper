import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { BetProvider } from './AbstractBetProvider'

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
  setDatasource: Dispatch<SetStateAction<DataSource>>
}

const DataSourceContext = createContext<DataSourceService | null>(null)

interface DataSourceProviderProps {
  children: ReactNode
}
export function DataSourceProvider({ children }: DataSourceProviderProps) {
  const [datasource, setDatasource] = useState<DataSource>({ type: 'local' })

  return (
    <DataSourceContext.Provider value={{ datasource, setDatasource }}>
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
