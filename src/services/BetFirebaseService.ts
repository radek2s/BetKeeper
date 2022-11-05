import BetEntry from '../models/BetEntry'
import { BetDataService } from '../providers/BetDataProvider'

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  Firestore,
  CollectionReference,
} from 'firebase/firestore/lite'
import { FirebaseConfig } from '../models/DatabaseConnector'

/**
 * Bet Firebase storage Service
 *
 * Keep your bets on your Firebase storage.
 *
 * EXAMPLE OF VALID CLASS DESIGN
 */
export default class BetFirebaseService implements BetDataService {
  private static BET_COLLECTION_NAME = 'bets'

  // private firebaseService = new FirebaseService()

  constructor(config: FirebaseConfig) {
    this.connect(config)
  }

  private firestore?: Firestore

  private connect(config: FirebaseConfig) {
    try {
      this.firestore = getFirestore(initializeApp(config))
    } catch (e: any) {
      console.error(e)
    }
  }

  async getAllBets(): Promise<BetEntry[]> {
    if (!this.firestore) throw 'Firestore not initialized!'
    const results = await getDocs(
      collection(this.firestore, BetFirebaseService.BET_COLLECTION_NAME)
    )
    const bets: BetEntry[] = []
    results.forEach((doc) => {
      const bet = doc.data()
      bets.push(
        new BetEntry(
          doc.id,
          bet.title,
          bet.description,
          bet.option1,
          bet.option2,
          bet.isFinished,
          bet.winner
        )
      )
    })
    return bets
  }
  getBetById(id: string): Promise<BetEntry> {
    throw new Error('Method not implemented.')
  }

  async addNewBet(bet: BetEntry): Promise<BetEntry> {
    if (!this.firestore) throw 'Firestore not initialized!'
    const doc = await addDoc(
      collection(this.firestore, BetFirebaseService.BET_COLLECTION_NAME),
      bet
    )
    bet.id = doc.id
    return bet
  }
  async updateBet(bet: BetEntry): Promise<BetEntry> {
    if (!this.firestore) throw 'Firestore not initialized!'
    // const doc = firestore()
    const betRef = doc(
      collection(this.firestore, BetFirebaseService.BET_COLLECTION_NAME),
      bet.id.toString()
    )
    setDoc(betRef, bet)
      .then(() => {
        console.log('Updated')
      })
      .catch((e: any) => {
        console.error('failed', e)
      })
    return bet
  }
  async deleteBet(id: string): Promise<void> {
    if (!this.firestore) throw 'Firestore not initialized!'
    console.log(id)
    await deleteDoc(
      doc(this.firestore, BetFirebaseService.BET_COLLECTION_NAME, id.toString())
    )
    return
  }
}
