import React from 'react'
import { useDataSourceContext } from '@/providers/DataSourceProvider'

function DataSourcePresentationMock() {
  const { datasource, setDatasource } = useDataSourceContext()

  const setFirebaseDatasource = () => {
    setDatasource({
      type: 'firebase',
      apiKey: 'string',
      authDomain: 'string',
      projectId: 'string',
      storageBucket: 'string',
      messagingSenderId: 'string',
      appId: 'string',
    })
  }

  return (
    <div>
      <h2 role="heading">Active: {datasource.type}</h2>
      <button onClick={() => setDatasource({ type: 'local' })}>Local</button>
      <button onClick={setFirebaseDatasource}>Firebase</button>
    </div>
  )
}
export default DataSourcePresentationMock
