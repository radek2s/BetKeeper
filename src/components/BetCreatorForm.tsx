/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultButton, TextField } from '@fluentui/react'
import React from 'react'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'

const newId = -1
interface Props {
  onBetAdded: (bet: BetEntry) => void
}
const BetCreatorForm: React.FC<Props> = ({ onBetAdded }) => {
  const [request, setRequest] = React.useState<BetEntry>(
    new BetEntry(newId, '', '', '', '')
  )
  const betConsumer = React.useContext(BetDataContext)

  const addBet = async () => {
    try {
      const response = await betConsumer.addNewBet(request)
      onBetAdded(response)
    } catch (e: any) {
      console.error('failed')
    }
  }
  return (
    <div className="form flex justify-center wrap">
      <TextField
        placeholder="Enter a bet title"
        id="bet-title"
        onChange={(_, e) => setRequest({ ...request, title: e || '' })}></TextField>
      <TextField
        placeholder="Enter a bet description"
        id="bet-title"
        onChange={(_, e) => setRequest({ ...request, description: e || '' })}></TextField>
      <TextField
        placeholder="Enter first person demand"
        id="bet-option"
        onChange={(_, e) => setRequest({ ...request, option1: e || '' })}></TextField>
      <TextField
        placeholder="Enter second person demand"
        id="bet-option"
        onChange={(_, e) => setRequest({ ...request, option2: e || '' })}></TextField>
      <DefaultButton primary onClick={addBet}>
        Add a bet
      </DefaultButton>
    </div>
  )
}
export default BetCreatorForm
