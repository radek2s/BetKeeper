export interface SettingsProps {
  initialConfig?: DatabaseConfig
  save: (config: DatabaseConfig) => void
}

export type DatabaseType = 'local' | 'server' | 'firebase'

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
