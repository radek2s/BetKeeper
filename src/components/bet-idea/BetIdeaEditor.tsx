import React, { useState } from 'react'
import { DefaultButton, TextField } from '@fluentui/react'
import BetIdea from '../../models/BetIdea'

const EMPTY_BET_IDEA: BetIdea = new BetIdea('', '', '')

interface Props {
  betIdea?: BetIdea
  onSave: (betIdea: BetIdea) => void
}
export const BetIdeaEditor: React.FC<Props> = ({ betIdea, onSave }) => {
  const [bet, setBet] = useState<BetIdea>(betIdea || EMPTY_BET_IDEA)

  const handleChange = (value: string | undefined, key: keyof BetIdea) => {
    if (!value) return
    const prop = { [key]: value }
    setBet((bet) => {
      return { ...bet, ...prop }
    })
  }

  const handleSave = () => {
    onSave && onSave(bet)
  }

  const isDisabled = () => !bet || !bet.option || !bet.title

  return (
    <div>
      <TextField
        label="Add your idea"
        value={bet?.title}
        onChange={(_, v) => {
          handleChange(v, 'title')
        }}
      />
      <TextField
        label="Option for some person"
        value={bet?.option}
        onChange={(_, v) => {
          handleChange(v, 'option')
        }}
      />
      <DefaultButton primary onClick={handleSave} disabled={isDisabled()}>
        Add idea
      </DefaultButton>
    </div>
  )
}

export default BetIdeaEditor
