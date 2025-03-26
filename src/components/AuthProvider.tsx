'use client'

import en from "@/i18n/en"
import { CorbadoProvider } from "@corbado/react"
import { PropsWithChildren } from "react"

const PROJECT_ID = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID

export default function AuthProvider({ children }: PropsWithChildren) {
    if (!PROJECT_ID) throw new Error("NEXT_PUBLIC_CORBADO_PROJECT_ID is not provided!")

    return <CorbadoProvider projectId={PROJECT_ID} customTranslations={{ en }}>
        {children}
    </CorbadoProvider>
}