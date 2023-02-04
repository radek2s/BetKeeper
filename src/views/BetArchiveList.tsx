/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useEffect, useState } from 'react'
import BetElement from '../components/BetElement'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'

const BetArchive: React.FC = () => {
  const [archivedBets, setArchivedBets] = useState<BetEntry[]>([])
  const betConsumer = useContext(BetDataContext)

  useEffect(() => {
    betConsumer.getAllArchiveBets().then((bets) => setArchivedBets(bets))
  }, [])

  async function deleteBet(id: number | string) {
    await betConsumer.deleteBet(id)
    betConsumer.getAllArchiveBets().then((r) => setArchivedBets(r))
  }

  async function unArchiveBet(id: number | string) {
    await betConsumer.archiveBet(id, false)
    betConsumer.getAllArchiveBets().then((r) => setArchivedBets(r))
  }

  return (
    <div>
      <h1>Archived bets</h1>
      <ul className="wrap">
        {archivedBets.map((bet: BetEntry) => (
          <BetElement
            bet={bet}
            key={bet.id}
            betDelete={deleteBet}
            betArchive={unArchiveBet}
            betUpdate={() => {}}
          />
        ))}
      </ul>
    </div>
  )
}

export default BetArchive
