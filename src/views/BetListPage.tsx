import React, { useEffect } from 'react'
import BetElement from '../components/BetElement'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'
const newId = -1

const BetPage: React.FC = () => {
  const [bets, setBets] = React.useState<BetEntry[]>([]) //zmienna do wszystkich betów

  const [request, setRequest] = React.useState<BetEntry>(
    new BetEntry(newId, '', '', '', '')
  )

  const betConsumer = React.useContext(BetDataContext) // Get betConsumer -> Service that handle logic that provide data into component

  useEffect(() => {
    betConsumer.getAllBets().then((res) => setBets(res)) // Using betConsumer we can load all bets into this component like before
  }, [])

  const saveBet = () => {
    betConsumer.addNewBet(request).then((bet) => setBets([...bets, bet]))
  }
  const deleteBet = async (bet: BetEntry) => {
    await betConsumer.deleteBet(bet.id)
    betConsumer.getAllBets().then((r) => setBets(r))
  }
  const updateBet = async (bet: BetEntry) => {
    await betConsumer.updateBet(bet)
  }

  return (
    <div>
      <h1>All Bets</h1>
      <ul>
        {bets.map((bet: BetEntry) => {
          return (
            <BetElement
              bet={bet}
              key={bet.id}
              betDelete={() => deleteBet(bet)}
              betUpdate={updateBet}
            />
          )
        })}
      </ul>

      {/* TODO: wydzielić do osobnego komponentu BetCreatorForm */}
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
          onChange={(e) =>
            setRequest({ ...request, option1: e.target.value })
          }></textarea>
        <textarea
          placeholder="Enter Gosia's demand"
          id="bet-option"
          onChange={(e) =>
            setRequest({ ...request, option2: e.target.value })
          }></textarea>
        <button onClick={saveBet}>Add a bet</button>
      </div>
    </div>
  )
}

export default BetPage
