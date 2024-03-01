import { BetContext } from '@/providers/BetProvider'
import { BetService } from '@/providers/BetService.interface'
import React, { ReactNode } from 'react'

interface BetProviderMockProps {
  children: ReactNode
  betService: BetService
}
function BetProviderMock({ children, betService }: BetProviderMockProps) {
  return <BetContext.Provider value={betService}>{children}</BetContext.Provider>
}

export default BetProviderMock
