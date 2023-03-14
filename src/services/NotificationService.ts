import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, Messaging, onMessage } from 'firebase/messaging'
import { FirebaseConfig } from '../models/DatabaseConnector'

export class PushNotificationService {
  private messaging?: Messaging
  constructor(private config: FirebaseConfig) {}

  private init() {
    this.messaging = getMessaging(initializeApp(this.config))
  }

  private checkNotificationPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!('Notification' in window)) {
        console.error('This browser does not support notifications!')
        reject(false)
      } else if (Notification.permission === 'granted') {
        resolve(true)
      } else if (Notification.permission === 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') resolve(true)
          reject(false)
        })
      }
    })
  }

  async getFCMToken(): Promise<string | null> {
    this.init()
    if (!this.messaging) {
      console.error('Messaging not initialized!')
      return null
    }
    if (!(await this.checkNotificationPermission())) {
      console.error('Notification permission denied!')
    }
    try {
      return await getToken(this.messaging)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  onMessageListener() {
    return new Promise((resolve, reject) => {
      if (!this.messaging) {
        reject(false)
        return
      }
      onMessage(this.messaging, (payload) => {
        resolve(payload)
      })
    })
  }
}
