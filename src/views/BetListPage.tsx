import React, { useEffect } from 'react'
import BetCreatorForm from '../components/BetCreatorForm'
import BetElement from '../components/BetElement'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'

const BetPage: React.FC = () => {
  const [bets, setBets] = React.useState<BetEntry[]>([]) //zmienna do wszystkich betów
  const betConsumer = React.useContext(BetDataContext) // Get betConsumer -> Service that handle logic that provide data into component

  useEffect(() => {
    betConsumer.getAllBets().then((res) => setBets(res)) // Using betConsumer we can load all bets into this component like before
  }, [])

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
      <BetCreatorForm
        onBetAdded={(bet: BetEntry) => {
          setBets((currentBets) => [...currentBets, bet])
        }}
      />
    </div>
  )
}

export default BetPage
