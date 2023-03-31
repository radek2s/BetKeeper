import React from 'react'
import BetIdea from '../../models/BetIdea'
import './betIdeaCard.css'

interface Props {
  betIdea: BetIdea
}
export const BetIdeaCard: React.FC<Props> = ({ betIdea: { title, option } }) => {
  return (
    <div className="bet-idea-card">
      <header className="bet-idea-card--header">
        <h3>{title}</h3>
      </header>
      <div className="bet-idea-card--content">
        <div className="bet-idea">
          <span className="bet-idea--label">What sb shoud do?</span>
          <span className="bet-idea--value">{option}</span>
        </div>
      </div>
    </div>
  )
}

export default BetIdeaCard
