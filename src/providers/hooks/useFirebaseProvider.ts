import { useEffect, useReducer, useRef } from 'react'
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore/lite'
import { initializeApp } from 'firebase/app'

import { Bet, BetResolveType } from '../../models/Bet'
import { mapFromRequestData, mapToRequestData } from '../../models/BetMapper'
import { BetService } from '../BetService.interface'
import { FirebaseConfig } from '../DataSourceProvider'
import betReducer from './betReducer'

const BET_COLLECTION_NAME = 'bets'

function useFirebaseProvider(datasource: FirebaseConfig | null): BetService {
  const [bets, dispatch] = useReducer(betReducer, [])
  const firestoreRef = useRef<Firestore | null>(null)

  useEffect(() => {
    connect()
    getBets()
  }, [])

  const connect = () => {
    if (!datasource) return
    const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } =
      datasource

    firestoreRef.current = getFirestore(
      initializeApp({
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
      })
    )
  }

  async function getBets() {
    if (!firestoreRef.current) return
    const docs = await getDocs(collection(firestoreRef.current, BET_COLLECTION_NAME))

    const data: Bet[] = []
    docs.forEach((doc) => {
      data.push(mapFromRequestData({ ...doc.data(), id: doc.id }))
    })

    dispatch({ type: 'fetch', data })
  }

  async function handleAddBet(bet: Bet) {
    if (!firestoreRef.current) return
    const doc = await addDoc(collection(firestoreRef.current, BET_COLLECTION_NAME), bet)
    bet.id = doc.id

    dispatch({ type: 'add', bet })
  }

  async function removeBet(betId: string | number) {
    if (!firestoreRef.current) return
    await deleteDoc(doc(firestoreRef.current, BET_COLLECTION_NAME, betId.toString()))
    dispatch({ type: 'remove', betId })
  }

  async function resolveBet(betId: string | number, resolve: BetResolveType) {
    const bet: Bet | undefined = bets?.find(({ id }) => betId === id)
    if (!bet) return
    bet.betResolve = resolve
    await updateBet(bet)
  }

  async function archiveBet(betId: string | number, archive: boolean) {
    const bet: Bet | undefined = bets?.find(({ id }) => betId === id)
    if (!bet) return
    bet.archived = archive
    await updateBet(bet)
  }

  async function updateBet(bet: Bet) {
    if (!firestoreRef.current) return
    try {
      const betRef = doc(
        collection(firestoreRef.current, BET_COLLECTION_NAME),
        bet.id.toString()
      )
      await setDoc(betRef, mapToRequestData(bet))
      dispatch({ type: 'update', bet })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    getAll: () => bets,
    add: handleAddBet,
    remove: removeBet,
    resolve: resolveBet,
    update: updateBet,
    archive: archiveBet,
  }
}

export default useFirebaseProvider
