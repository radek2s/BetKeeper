/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react'
import { MessageBar } from '@fluentui/react'
import { FirebaseConfig } from '../models/DatabaseConnector'
import { PushNotificationService } from '../services/NotificationService'

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

const NOTIFICATION_TIME = 8000

interface Props {
  children: React.ReactNode
}
export const PushNotificationProvider: React.FC<Props> = ({ children }) => {
  const [, setPushService] = useState<PushNotificationService | null>(null)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationMessage | null>(null)

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
    //Todo: Allow to multirendering messages
    setNotification(payload)
    setTimeout(() => {
      setNotification(null)
    }, NOTIFICATION_TIME)
  }

  const getToken = () => {
    return fcmToken || ''
  }

  useEffect(() => {
    setup()
  }, [])

  return (
    <PushNotificationContext.Provider value={{ setup, getToken }}>
      {notification && (
        <div className="notification">
          <MessageBar isMultiline={true}>
            <h4>{notification.notification.title}</h4>
            <p>{notification.notification.body}</p>
          </MessageBar>
        </div>
      )}
      {children}
    </PushNotificationContext.Provider>
  )
}
