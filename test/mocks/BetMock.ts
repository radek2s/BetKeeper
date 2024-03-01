import { Bet } from '@/models/Bet'

export const BasicBetMock = {
  id: '123456',
  title: 'Basic Bet',
  description: 'Short bet description',
  archived: false,
  option1: 'Something for person 1',
  option2: 'Something for person 2',
  betResolve: 3,
}

export const CreationBetMock = {
  id: '',
  title: 'Create Bet Mock',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices porta justo, in vehicula metus ornare et. In nec eros sollicitudin',
  archived: false,
  option1: 'Option first',
  option2: 'Option second',
  betResolve: 'pending',
} as Bet
