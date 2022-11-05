/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react'
import {
  DatabaseConnector,
  DedicatedConfig,
  FirebaseConfig,
} from '../models/DatabaseConnector'
import BetFirebaseService from '../services/BetFirebaseService'
import BetServerService from '../services/BetServerService'
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
  const [connector, setConnector] = useState<DatabaseConnector>(defautlConnector)
  const [betDataProvider, setBetDataProvider] = useState<BetDataService>(
    new BetServerService()
  )

  useEffect(() => {
    let service
    switch (connector.type) {
      case 'dedicated':
        service = new BetServerService(connector.config as DedicatedConfig)
        break
      case 'firebase':
        service = new BetFirebaseService(connector.config as FirebaseConfig)
        break
      default:
        throw 'Not recognized!'
    }
    setBetDataProvider(service)
  }, [connector])

  const handleChange = (config: DatabaseConnector) => {
    setConnector(config)

    console.log('Hi', config)
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
