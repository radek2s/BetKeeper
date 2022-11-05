import {
  DatabaseConfig,
  DatabaseConnector,
  DatabaseType,
} from '../models/DatabaseConnector'

export function saveDatabaseConfig(config: DatabaseConfig, dbType: DatabaseType) {
  localStorage.setItem(`conf-${dbType}`, JSON.stringify(config))
}

export function saveDatabaseConnector(connector: DatabaseConnector) {
  localStorage.setItem(`conf-active`, JSON.stringify(connector))
}

export function loadDatabaseConfig(dbType: DatabaseType): DatabaseConfig {
  return JSON.parse(localStorage.getItem(`conf-${dbType}`) || '{}') as DatabaseConfig
}

export function loadDatabaseConncecotr(): DatabaseConnector {
  return JSON.parse(localStorage.getItem(`conf-active`) || '{}') as DatabaseConnector
}
