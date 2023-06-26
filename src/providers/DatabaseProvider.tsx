/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useEffect, useState } from 'react'
import {
  DatabaseConfig,
  DatabaseConnector,
  DatabaseType,
  ServerConfig,
  FirebaseConfig,
} from '../models/DatabaseConnector'
import BetFirebaseService from '../services/BetFirebaseService'
import BetLocalStorageService from '../services/BetLocalStorageService'
import BetServerService from '../services/BetServerService'
import { loadDatabaseConncecotr, saveDatabaseConnector } from '../utils/LocalStorageUtils'
import { BetDataService } from './BetDataProvider'
import { NotificationContext } from './NotificationProvider'

export interface DatabaseService {
  database: DatabaseConnector
  service: BetDataService
  setConnection: (connector: DatabaseConnector) => void
}

const defautlConnector: DatabaseConnector = {
  type: 'local',
  config: {},
}

export const defaultConnection: DatabaseService = {
  database: defautlConnector,
  service: new BetLocalStorageService(),
  setConnection: () => {},
}

export const DatabaseContext = React.createContext<DatabaseService>(defaultConnection)

interface Props {
  children: React.ReactNode
}
export const DatabaseProvider: React.FC<Props> = ({ children }) => {
  const [connector, setConnector] = useState<DatabaseConnector>(loadDatabaseConncecotr())
  const [betDataProvider, setBetDataProvider] = useState<BetDataService>(
    new BetLocalStorageService()
  )
  const { showNotification } = useContext(NotificationContext)

  const initDatabaseConnector = (config: DatabaseConfig, dbType: DatabaseType) => {
    let service
    let message: string
    try {
      switch (dbType) {
        case 'server':
          service = new BetServerService(config as ServerConfig)
          message = 'Connected to NodeServer'
          break
        case 'firebase':
          service = new BetFirebaseService(config as FirebaseConfig)
          message = 'Connected to Firebase'
          break
        default:
          service = new BetLocalStorageService()
          message = 'Using localStorage'
      }
      setBetDataProvider(service)
      showNotification('Successfully connected!', message, 'success')
    } catch (e: unknown) {
      console.error(e)
      if (e instanceof Error) {
        showNotification(e.name, e.message, 'error')
      }
    }
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
