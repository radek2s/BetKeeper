import React from 'react'
import Button from '../../../layout/button/Button'
import { SettingsProps } from '../settings.interface'

function SettingsLocal({ save }: SettingsProps) {
  const handleSave = () => {
    save({})
  }

  return (
    <div className="my-4" data-testid="settings-local">
      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}

export default SettingsLocal
