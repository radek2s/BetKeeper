import React, { useContext, useEffect, useState } from 'react'
import { BetDataContext } from '../providers/BetDataProvider'
import BetIdea from '../models/BetIdea'
import { Dialog, DialogType, FontIcon, IconButton } from '@fluentui/react'
import BetIdeaEditor from '../components/bet-idea/BetIdeaEditor'
import BetIdeaCard from '../components/bet-idea/BetIdeaCard'

const dialogContentProps = {
  type: DialogType.normal,
  title: 'Add Bet Idea',
}
const modalProps = {
  isBlocking: true,
}

const BetIdeaList: React.FC = () => {
  const provider = useContext(BetDataContext)
  const [betIdeas, setBetIdeas] = useState<BetIdea[]>([])
  const [hideDialog, toggleHideDialog] = useState(true)

  useEffect(() => {
    fetchAllBetIdeas()
  }, [])

  const fetchAllBetIdeas = async () => {
    try {
      setBetIdeas(await provider.getAllBetIdeas())
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddBetIdea = async (bet: BetIdea) => {
    try {
      await provider.addNewBetIdea(bet)
      fetchAllBetIdeas()
    } catch (e) {
      console.error(e)
    } finally {
      toggleHideDialog(true)
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
      <header>
        <h1>All bet ideas</h1>
      </header>
      <div className="bet-ideas">
        {betIdeas.map((idea) => (
          <BetIdeaCard key={idea.id} betIdea={idea} />
        ))}
      </div>

      <Dialog
        hidden={hideDialog}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDismiss={() => {
          toggleHideDialog(true)
        }}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}>
        <BetIdeaEditor onSave={handleAddBetIdea} />
      </Dialog>
    </div>
  )
}

export default BetIdeaList
