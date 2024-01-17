import React, { useEffect, useRef, useState } from 'react'

import { FirebaseConfig } from '../../../models/DatabaseConnector'
import Button from '../../../layout/button/Button'

import { SettingsProps } from '../settings.interface'
import FirebaseImportDialog from './FirebaseImportDialog'

function SettingsFirebase({ initialConfig, save }: SettingsProps) {
  const [isDialogVisible, setDialogVisible] = useState<boolean>(false)
  const handleSave = () => {
    save(getValues())
  }

  useEffect(() => {
    if (initialConfig && Object.hasOwn(initialConfig, 'apiKey'))
      setValues(initialConfig as FirebaseConfig)
  }, [])

  const getValues = (): FirebaseConfig => {
    return {
      apiKey: apiKeyRef.current?.value || '',
      authDomain: authDomainRef.current?.value || '',
      projectId: projectIdRef.current?.value || '',
      storageBucket: storageBucketRef.current?.value || '',
      messagingSenderId: messagingSenderIdRef.current?.value || '',
      appId: appIdRef.current?.value || '',
    }
  }

  const setValues = (data: FirebaseConfig) => {
    if (!apiKeyRef.current) return
    apiKeyRef.current.value = data.apiKey

    if (!authDomainRef.current) return
    authDomainRef.current.value = data.authDomain

    if (!projectIdRef.current) return
    projectIdRef.current.value = data.projectId

    if (!storageBucketRef.current) return
    storageBucketRef.current.value = data.storageBucket

    if (!messagingSenderIdRef.current) return
    messagingSenderIdRef.current.value = data.messagingSenderId

    if (!appIdRef.current) return
    appIdRef.current.value = data.appId
  }

  const handleImport = (data: FirebaseConfig | undefined) => {
    setDialogVisible(false)
    if (data) setValues(data)
  }

  const apiKeyRef = useRef<HTMLInputElement>(null)
  const authDomainRef = useRef<HTMLInputElement>(null)
  const projectIdRef = useRef<HTMLInputElement>(null)
  const storageBucketRef = useRef<HTMLInputElement>(null)
  const messagingSenderIdRef = useRef<HTMLInputElement>(null)
  const appIdRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <div className="my-4">
        <div className="flex justify-end">
          <FirebaseImportDialog open={isDialogVisible} onClose={handleImport} />
          <Button onClick={() => setDialogVisible(true)}>Import from json</Button>
        </div>
        <div className="flex flex-col">
          <label htmlFor="apiKey">API Key</label>
          <input id="apiKey" ref={apiKeyRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="authDomain">Authentication Domain</label>
          <input id="authDomain" ref={authDomainRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="projectId">Project ID</label>
          <input id="projectId" ref={projectIdRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="storageBucket">Storage Bucket</label>
          <input id="storageBucket" ref={storageBucketRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="messagingSenderId">Messaging Sender ID</label>
          <input id="messagingSenderId" ref={messagingSenderIdRef} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="appId">Application ID</label>
          <input id="appId" ref={appIdRef} />
        </div>
      </div>

      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}

export default SettingsFirebase
