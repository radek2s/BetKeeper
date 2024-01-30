import React from 'react'
import { useBetContext } from '@/providers/BetProvider'
import BetItemMock from './BetItemMock'

function BetListMock() {
  const { getAll } = useBetContext()

  return (
    <div role="list">
      {getAll().map((bet) => (
        <BetItemMock key={bet.id} bet={bet} />
      ))}
    </div>
  )
}

export default BetListMock
