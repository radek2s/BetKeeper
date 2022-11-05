import React from 'react'
import { FirebaseConfig } from '../models/DatabaseConnector'

interface Props {
  save: (config: FirebaseConfig) => void
}
export const SettingsFirebase: React.FC<Props> = ({ save }) => {
  const handleClick = () => {
    save({
      apiKey: (document.getElementById('cnf-firebase-apikey') as HTMLInputElement).value,
      authDomain: (document.getElementById('cnf-firebase-auth') as HTMLInputElement)
        .value,
      projectId: (document.getElementById('cnf-firebase-project-id') as HTMLInputElement)
        .value,
      storageBucket: (document.getElementById('cnf-firebase-storage') as HTMLInputElement)
        .value,
      messagingSenderId: (
        document.getElementById('cnf-firebase-message') as HTMLInputElement
      ).value,
      appId: (document.getElementById('cnf-firebase-app-id') as HTMLInputElement).value,
    })
  }
  return (
    <>
      <h2>Firebase connector settings</h2>
      <div>
        <input id="cnf-firebase-apikey" placeholder="Api key" />
        <input id="cnf-firebase-auth" placeholder="authDomain" />
        <input id="cnf-firebase-project-id" placeholder="projectId" />
        <input id="cnf-firebase-storage" placeholder="storageBucket" />
        <input id="cnf-firebase-message" placeholder="messagingSenderId" />
        <input id="cnf-firebase-app-id" placeholder="appId" />
      </div>
      <button onClick={handleClick}>Save</button>
    </>
  )
}
