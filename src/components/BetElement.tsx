import BetEntry from '../models/BetEntry'
import React from 'react'
interface IBetElement {
  bet: BetEntry
  betDelete: (id: number) => void
  betUpdate: (bet: BetEntry) => void
}

const BetElement: React.FC<IBetElement> = ({ bet, betDelete, betUpdate }) => {
  const [request, setRequest] = React.useState<BetEntry>({ ...bet })

  const updateBet = (isFinished: boolean, winner: boolean) => {
    setRequest({ ...request, isFinished, winner })
    betUpdate({ ...request, isFinished, winner }) //TODO: możliwość zaznaczania i odznaczania obu zakładów
  }

  return (
    <div className="bet-card">
      <header className="flex align-center space-between">
        <h2>
          <input
            onChange={(e) => setRequest({ ...request, title: e.target.value })}
            value={request.title}
          />
        </h2>
        <div className="">
          <button
            className="accept"
            onClick={(e) => {
              betUpdate(request)
            }}>
            ✅
          </button>
          <button
            className="delete"
            onClick={(e) => {
              betDelete(bet.id)
            }}>
            ❌
          </button>
        </div>
      </header>
      <div className="options flex space-between">
        <div className="flex space-between align-center">
          <input
            className={bet.isFinished == false ? 'notFinished' : ''}
            onChange={(e) =>
              setRequest({ ...request, option1: e.target.value, isFinished: true })
            }
            value={request.option1}
          />
          <input
            checked={request.isFinished && !request.winner}
            type="checkbox"
            className="checkbox"
            onChange={() => updateBet(true, false)}
          />
        </div>
        <div className="flex space-between align-center">
          <input
            type="textarea"
            className={bet.isFinished == false ? 'notFinished' : ''}
            onChange={(e) =>
              setRequest({ ...request, option2: e.target.value, isFinished: true })
            }
            value={request.option2}
          />
          <input
            type="checkbox"
            checked={request.isFinished && request.winner}
            className="checkbox"
            onChange={() => updateBet(true, true)}
          />
        </div>
      </div>
    </div>
  )
}

export default BetElement
