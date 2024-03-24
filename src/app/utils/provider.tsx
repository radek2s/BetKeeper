'use client'

import { CorbadoProvider } from '@corbado/react'
import en from './translations'

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <CorbadoProvider
      projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID}
      darkMode="off"
      setShortSessionCookie={true}
      customTranslations={{ en }}>
      {children}
    </CorbadoProvider>
  )
}
