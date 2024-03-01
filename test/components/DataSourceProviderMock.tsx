import React, { ReactNode } from 'react'
import { DataSource, DataSourceContext } from '@/providers/DataSourceProvider'

interface DataSourceProviderMockProps {
  datasource: DataSource
  setDatasource: (datasource: DataSource) => void
  children: ReactNode
}
function DataSourceProviderMock({
  datasource,
  setDatasource,
  children,
}: DataSourceProviderMockProps) {
  return (
    <DataSourceContext.Provider value={{ datasource, setDatasource }}>
      {children}
    </DataSourceContext.Provider>
  )
}

export default DataSourceProviderMock
