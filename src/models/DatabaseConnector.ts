//TODO: File to be removed
export type DatabaseType = 'local' | 'server' | 'firebase'

export interface DatabaseConnector {
  type: DatabaseType
  config: DatabaseConfig
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatabaseConfig {}

export interface ServerConfig extends DatabaseConfig {
  serverUrl: string
}

export interface FirebaseConfig extends DatabaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}
