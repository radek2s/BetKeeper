import { DatabaseConfig } from '../../models/DatabaseConnector'

export interface SettingsProps {
  initialConfig?: DatabaseConfig
  save: (config: DatabaseConfig) => void
}
