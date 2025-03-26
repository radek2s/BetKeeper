// import ProviderWrapper from './utils/provider'
// import '../index.scss'
// import AuthGuard from '@/components/AuthGuard'
// import { NotificationProvider } from '@/providers/NotificationProvider'
// import { DataSourceProvider } from '@/providers/DataSourceProvider'
// import Navigation from '@/layout/navigation/Navigation'

import AuthGuard from "@/components/AuthGuard"
import AuthProvider from "@/components/AuthProvider"

export const metadata = {
  title: 'Bet Keeper',
  description: 'Simple application to store your bets',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
      {/* <ProviderWrapper>
        <body className="bet-keeper-theme">
          <NotificationProvider>
            <DataSourceProvider>
              <AuthGuard>
                <div className="root">
                  <div className="root__navigation">
                    <h1 className="page-logo">Bet Keeper</h1>
                    <Navigation />
                  </div>
                  <main className="root__outlet">{children}</main>
                </div>
              </AuthGuard>
            </DataSourceProvider>
          </NotificationProvider>
        </body>
      </ProviderWrapper> */}
    </html>
  )
}
