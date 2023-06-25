import { Dialog, DialogType, FontIcon, IconButton } from '@fluentui/react'
import React, { useContext, useEffect, useState } from 'react'
import BetCreatorForm from '../components/BetCreatorForm'
import BetElement from '../components/BetElement'
import BetEntry from '../models/BetEntry'
import { BetDataContext } from '../providers/BetDataProvider'
import { ToastContext } from '../services/ToastService'

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

  const ToastProvider = useContext(ToastContext)

  useEffect(() => {
    betConsumer
      .getAllActiveBets()
      .then((res) => setBets(res))
      .catch((e: unknown) => {
        ToastProvider.show((e as Error).message)
      }) // Using betConsumer we can load all bets into this component like before
  }, [])

  const updateBet = async (bet: BetEntry) => {
    await betConsumer.updateBet(bet)
  }

  const archiveBet = async (id: number | string) => {
    await betConsumer.archiveBet(id, true)
    setBets(await betConsumer.getAllActiveBets())
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
