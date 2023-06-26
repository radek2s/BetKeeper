/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useEffect, useState } from 'react'
import { FirebaseConfig } from '../models/DatabaseConnector'
import { PushNotificationService } from '../services/PushNotificationService'
import { NotificationContext } from './NotificationProvider'

type NotificationMessage = {
  notification: {
    title: string
    body: string
  }
}

export type PushNotificationContextType = {
  setup: (config?: FirebaseConfig) => void
  getToken: () => string
}

export const PushNotificationContext = React.createContext<PushNotificationContextType>({
  setup: () => {},
  getToken: () => '',
})

interface Props {
  children: React.ReactNode
}
export const PushNotificationProvider: React.FC<Props> = ({ children }) => {
  const [, setPushService] = useState<PushNotificationService | null>(null)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const { showNotification } = useContext(NotificationContext)

  const setup = async (config?: FirebaseConfig) => {
    const configuration: FirebaseConfig = config || loadConfig()
    const service = new PushNotificationService(configuration)
    setFcmToken(await service.getFCMToken())
    onMessage((await service.onMessageListener()) as NotificationMessage)
    setPushService(service)
  }

  const loadConfig = (): FirebaseConfig => {
    console.warn(
      'PushNotification: No config provided! Trying to load from LocalStorage.'
    )
    const data = JSON.parse(localStorage.getItem('conf-firebase') || '{}')
    if ('apiKey' in data) {
      return data as FirebaseConfig
    }
    throw new Error('Unable to load data')
  }

  const onMessage = (payload: NotificationMessage) => {
    showNotification(payload.notification.title, payload.notification.body)
  }

  const getToken = () => {
    return fcmToken || ''
  }

  useEffect(() => {
    setup()
  }, [])

  return (
    <PushNotificationContext.Provider value={{ setup, getToken }}>
      {children}
    </PushNotificationContext.Provider>
  )
}
