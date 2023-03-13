import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const config = {}

const messaging = getMessaging(initializeApp(config))
export const getTokens = () => {
  getToken(messaging, { vapidKey: '' })
    .then((token) => {
      if (token) {
        console.log('Token', token)
      } else {
        console.log('no reg token available')
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received', payload)
      resolve(payload)
    })
  })
