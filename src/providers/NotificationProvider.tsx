import React, { useContext, useState } from 'react'
import { MessageBarType } from '@fluentui/react'

/**
 * Supported Notification message levels
 */
export type NotificationType = 'info' | 'error' | 'success'

/**
 * Notification Message structure
 * with title and optional content
 */
export type NotificationMessage = {
  title: string
  content?: string
  level: MessageBarType
}

export interface NotificationService {
  showNotification: (message: string, body?: string, level?: NotificationType) => void
}

const NotificationContext = React.createContext<NotificationService | null>(null)

const NOTIFICATION_TIMEOUT = 3000
interface Props {
  children: React.ReactNode
}
/**
 * Notification Provider
 *
 * Global Notification context provider. That show MessageBar with specific
 * message and type in the top of the screen.
 */
export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationMessage | null>(null)

  const showNotification = (
    message: string,
    body?: string,
    level: NotificationType = 'info'
  ) => {
    let messageBarType: MessageBarType
    switch (level) {
      case 'info':
        messageBarType = MessageBarType.info
        break
      case 'success':
        messageBarType = MessageBarType.success
        break
      case 'error':
        messageBarType = MessageBarType.error
        break
      default:
        throw Error('')
    }

    setNotification({ title: message, content: body, level: messageBarType })
    setTimeout(() => {
      setNotification(null)
    }, NOTIFICATION_TIMEOUT)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {notification && (
        <div className={`notification`}>
          <h4>{notification.title}</h4>
          <p>{notification.content}</p>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === null)
    throw new Error('useNotifiaction must be within NotifiactionProvider')

  return context
}
