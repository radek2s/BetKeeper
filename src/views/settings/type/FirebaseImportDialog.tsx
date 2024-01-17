import React, { useRef, useState } from 'react'
import Dialog from '../../../layout/dialog/Dialog'
import Button from '../../../layout/button/Button'
import { FirebaseConfig } from '../../../models/DatabaseConnector'

interface FirebaseImportDialogProps {
  open: boolean
  onClose: (result?: FirebaseConfig) => void
}
function FirebaseImportDialog({ open, onClose }: FirebaseImportDialogProps) {
  const firebaseConfigRef = useRef<HTMLTextAreaElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    onClose()
  }

  const handleSave = () => {
    const input = firebaseConfigRef.current?.value
    if (!input) {
      setError('Config must not be null!')
      return
    }

    try {
      const result = JSON.parse(input)
      validateInput(result)
      onClose(result)
      setError(null)
    } catch (e: unknown) {
      if (e instanceof ValidateError) {
        setError(e.message)
      } else {
        setError('Unable to parse config!')
      }
      return
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateInput = (data: any) => {
    if (!Object.hasOwn(data, 'apiKey')) throw new ValidateError('apiKey')
    if (!Object.hasOwn(data, 'authDomain')) throw new ValidateError('authDomain')
    if (!Object.hasOwn(data, 'projectId')) throw new ValidateError('projectId')
    if (!Object.hasOwn(data, 'storageBucket')) throw new ValidateError('storageBucket')
    if (!Object.hasOwn(data, 'messagingSenderId'))
      throw new ValidateError('messagingSenderId')
    if (!Object.hasOwn(data, 'appId')) throw new ValidateError('appId')
  }

  return (
    <Dialog open={open} className="flex flex-col w-1/2">
      <h2>Import configuration</h2>
      <div className="flex flex-col  my-4">
        <label htmlFor="firebaseRaw">Firebase config json</label>
        <textarea id="firebaseRaw" rows={8} ref={firebaseConfigRef} />
        <span className="py-1 text-center text-[#ff0000]">{error}</span>
      </div>
      <div className="flex gap-1 justify-end">
        <Button onClick={handleSave}>Import</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Dialog>
  )
}

class ValidateError extends Error {
  constructor(property: string) {
    super(`${property} property is missing!`)
  }
}

export default FirebaseImportDialog
