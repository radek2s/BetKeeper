import { Dialog, DialogType, FontIcon, IconButton } from '@fluentui/react'
import React, { useContext, useEffect, useState } from 'react'
import BetCreatorForm from '../components/BetCreatorForm'
import BetElement from '../components/BetElement'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'
import { NotificationContext } from '../providers/NotificationProvider'

const BetPage: React.FC = () => {
  const [bets, setBets] = React.useState<BetEntry[]>([]) //zmienna do wszystkich betów
  const betConsumer = React.useContext(BetDataContext) // Get betConsumer -> Service that handle logic that provide data into component
  const [hideDialog, toggleHideDialog] = useState(true)
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Add Bet',
  }
  const modalProps = {
    isBlocking: true,
  }

  const { showNotification } = useContext(NotificationContext)

  useEffect(() => {
    betConsumer
      .getAllActiveBets()
      .then((res) => setBets(res))
      .catch((e: Error) => {
        showNotification(e.name, e.message, 'error')
      }) // Using betConsumer we can load all bets into this component like before
  }, [])

  const updateBet = async (bet: BetEntry) => {
    try {
      await betConsumer.updateBet(bet)
      showNotification('Bet updated successfully', undefined, 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        showNotification(e.name, e.message, 'error')
      }
    }
  }

  const archiveBet = async (id: number | string) => {
    try {
      await betConsumer.archiveBet(id, true)
      setBets(await betConsumer.getAllActiveBets())
      showNotification('Bet archived successfully')
    } catch (e: unknown) {
      if (e instanceof Error) {
        showNotification(e.name, e.message, 'error')
      }
    }
  }

  return (
    <div>
      <IconButton
        id="add-bet-button"
        onClick={() => {
          toggleHideDialog(false)
        }}>
        <FontIcon iconName="Add" />
      </IconButton>
      <header className="bet-list-page flex">
        <h1>All Bets</h1>
      </header>
      <ul className="wrap">
        {bets.map((bet: BetEntry) => {
          return (
            <BetElement
              bet={bet}
              key={bet.id}
              betArchive={archiveBet}
              betUpdate={updateBet}
            />
          )
        })}
      </ul>
      <Dialog
        hidden={hideDialog}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDismiss={() => {
          toggleHideDialog(true)
        }}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}>
        <BetCreatorForm
          onBetAdded={(bet: BetEntry) => {
            setBets((currentBets) => [...currentBets, bet])
            toggleHideDialog(true)
          }}
        />
      </Dialog>
    </div>
  )
}

export default BetPage
