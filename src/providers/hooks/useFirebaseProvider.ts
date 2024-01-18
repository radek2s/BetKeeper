import { useEffect, useReducer, useRef } from 'react'
import { Firestore, collection, getDocs, getFirestore } from 'firebase/firestore/lite'
import { initializeApp } from 'firebase/app'

import { Bet } from '../../models/Bet'
import { mapFromRequestData } from '../../models/BetMapper'
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

  const getBets = async () => {
    if (!firestoreRef.current) return
    const docs = await getDocs(collection(firestoreRef.current, BET_COLLECTION_NAME))

    const data: Bet[] = []
    docs.forEach((doc) => {
      data.push(mapFromRequestData(doc.data()))
    })

    dispatch({ type: 'fetch', data })
  }

  return {
    getAll: () => bets,
  }
}

export default useFirebaseProvider
