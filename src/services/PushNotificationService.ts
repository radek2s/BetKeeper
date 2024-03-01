/* eslint-disable no-console */
import { FirebaseConfig } from '@/providers/DataSourceProvider'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, Messaging, onMessage } from 'firebase/messaging'

export class PushNotificationService {
  private messaging?: Messaging
  private sw?: ServiceWorkerRegistration
  constructor(private config: FirebaseConfig) {}

  private async init() {
    await this.initSW()
    this.messaging = getMessaging(initializeApp(this.config))
  }

  private async initSW() {
    this.sw = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js?config=' + JSON.stringify(this.config)
    )
    if (this.sw.installing) {
      console.log('Serwice worker installing...')
    } else if (this.sw.waiting) {
      console.log('Service worker installed')
    } else if (this.sw.active) {
      console.log('Service worker active')
    }
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
    await this.init()
    if (!this.messaging || !this.sw) {
      console.warn({ ms: this.messaging, sw: this.sw })
      console.error('Messaging not initialized!')
      return null
    }
    if (!(await this.checkNotificationPermission())) {
      console.error('Notification permission denied!')
    }
    try {
      return await getToken(this.messaging, { serviceWorkerRegistration: this.sw })
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
