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
    <div className="form flex space-between">
      <textarea
        placeholder="Enter a bet title"
        id="bet-title"
        onChange={(e) => setRequest({ ...request, title: e.target.value })}></textarea>
      <textarea
        placeholder="Enter a bet description"
        id="bet-title"
        onChange={(e) =>
          setRequest({ ...request, description: e.target.value })
        }></textarea>
      <textarea
        placeholder="Enter Radek's demand"
        id="bet-option"
        onChange={(e) => setRequest({ ...request, option1: e.target.value })}></textarea>
      <textarea
        placeholder="Enter Gosia's demand"
        id="bet-option"
        onChange={(e) => setRequest({ ...request, option2: e.target.value })}></textarea>
      <button onClick={addBet}>Add a bet</button>
    </div>
  )
}
export default BetCreatorForm
