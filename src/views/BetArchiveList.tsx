//TODO: To be removed
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useEffect, useState } from 'react'
import BetElement from '../components/BetElement'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'
import { NotificationContext } from '../providers/NotificationProvider'

const BetArchive: React.FC = () => {
  const [archivedBets, setArchivedBets] = useState<BetEntry[]>([])
  const betConsumer = useContext(BetDataContext)
  const { showNotification } = useContext(NotificationContext)

  useEffect(() => {
    betConsumer.getAllArchiveBets().then((bets) => setArchivedBets(bets))
  }, [])

  async function deleteBet(id: number | string) {
    try {
      await betConsumer.deleteBet(id)
      setArchivedBets(await betConsumer.getAllArchiveBets())
      showNotification('Bet removed successfully')
    } catch (e: unknown) {
      console.error(e)
      if (e instanceof Error) {
        showNotification(e.name, e.message, 'error')
      }
    }
  }

  async function unArchiveBet(id: number | string) {
    try {
      await betConsumer.archiveBet(id, false)
      setArchivedBets(await betConsumer.getAllArchiveBets())
      showNotification('Bet restored successfully')
    } catch (e: unknown) {
      console.error(e)
      if (e instanceof Error) {
        showNotification(e.name, e.message, 'error')
      }
    }
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
