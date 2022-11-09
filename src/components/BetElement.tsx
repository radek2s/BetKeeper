import BetEntry, { Winner } from '../models/BetEntry'
import React from 'react'
interface IBetElement {
  bet: BetEntry
  betDelete: (id: number) => void
  betUpdate: (bet: BetEntry) => void
}

const BetElement: React.FC<IBetElement> = ({ bet, betDelete, betUpdate }) => {
  const [request, setRequest] = React.useState<BetEntry>({ ...bet })

  const updateBet = (winner: Winner) => {
    setRequest({ ...request, winner })
    betUpdate({ ...request, winner })
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
              betDelete(+bet.id)
            }}>
            ❌
          </button>
        </div>
      </header>
      <div className="options flex space-between">
        <div className="flex space-between align-center">
          <input
            className={bet.winner == Winner.None ? 'notFinished' : ''}
            onChange={(e) => setRequest({ ...request, option1: e.target.value })}
            value={request.option1}
          />
          <input
            checked={request.winner == Winner.Person1 || request.winner == Winner.Draw}
            type="checkbox"
            className="checkbox"
            onChange={() => {
              switch (request.winner) {
                case Winner.None:
                  updateBet(Winner.Person1)
                  break
                case Winner.Person1:
                  updateBet(Winner.None)
                  break
                case Winner.Person2:
                  updateBet(Winner.Draw)
                  break
                case Winner.Draw:
                  updateBet(Winner.Person2)
                  break
              }
            }}
          />
        </div>
        <div className="flex space-between align-center">
          <input
            type="textarea"
            className={bet.winner == Winner.None ? 'notFinished' : ''}
            onChange={(e) => setRequest({ ...request, option2: e.target.value })}
            value={request.option2}
          />
          <input
            type="checkbox"
            checked={request.winner == Winner.Person2 || request.winner == Winner.Draw}
            className="checkbox"
            onChange={() => {
              switch (request.winner) {
                case Winner.None:
                  updateBet(Winner.Person2)
                  break
                case Winner.Person1:
                  updateBet(Winner.Draw)
                  break
                case Winner.Person2:
                  updateBet(Winner.None)
                  break
                case Winner.Draw:
                  updateBet(Winner.Person1)
                  break
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default BetElement
