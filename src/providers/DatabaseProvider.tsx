/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react'
import {
  DatabaseConfig,
  DatabaseConnector,
  DatabaseType,
  DedicatedConfig,
  FirebaseConfig,
} from '../models/DatabaseConnector'
import BetFirebaseService from '../services/BetFirebaseService'
import BetServerService from '../services/BetServerService'
import { loadDatabaseConncecotr, saveDatabaseConnector } from '../utils/LocalStorageUtils'
import { BetDataService } from './BetDataProvider'

export interface DatabaseService {
  database: DatabaseConnector
  service: BetDataService
  setConnection: (connector: DatabaseConnector) => void
}

const defautlConnector: DatabaseConnector = {
  type: 'dedicated',
  config: { serverUrl: 'http://localhost:8000' },
}

export const defaultConnection: DatabaseService = {
  database: defautlConnector,
  service: new BetServerService(),
  setConnection: () => {},
}

export const DatabaseContext = React.createContext<DatabaseService>(defaultConnection)

interface Props {
  children: React.ReactNode
}
export const DatabaseProvider: React.FC<Props> = ({ children }) => {
  const [connector, setConnector] = useState<DatabaseConnector>(loadDatabaseConncecotr())
  const [betDataProvider, setBetDataProvider] = useState<BetDataService>(
    new BetServerService()
  )

  const initDatabaseConnector = (config: DatabaseConfig, dbType: DatabaseType) => {
    let service
    switch (dbType) {
      case 'dedicated':
        service = new BetServerService(config as DedicatedConfig)
        break
      case 'firebase':
        service = new BetFirebaseService(config as FirebaseConfig)
        break
      default:
        throw 'Not recognized!'
    }
    setBetDataProvider(service)
  }

  useEffect(() => {
    const config = loadDatabaseConncecotr()
    initDatabaseConnector(config.config, config.type)
  }, [])

  useEffect(() => {
    initDatabaseConnector(connector.config, connector.type)
  }, [connector])

  const handleChange = (config: DatabaseConnector) => {
    setConnector(config)
    saveDatabaseConnector(config)
  }

  return (
    <DatabaseContext.Provider
      value={{
        database: connector,
        service: betDataProvider,
        setConnection: handleChange,
      }}>
      {children}
    </DatabaseContext.Provider>
  )
}
