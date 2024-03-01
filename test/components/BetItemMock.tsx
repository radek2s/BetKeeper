import React from 'react'
import { Bet } from '@/models/Bet'
import { useBetContext } from '@/providers/BetProvider'

interface BetItemProps {
  bet: Bet
}
function BetItemMock({ bet }: BetItemProps) {
  const { remove } = useBetContext()

  return (
    <div role="listitem" data-testid={bet.id}>
      <h2>{bet.title}</h2>
      <span>{bet.description}</span>

      <div>
        <button onClick={() => remove(bet.id)}>Delete</button>
      </div>
    </div>
  )
}

export default BetItemMock
