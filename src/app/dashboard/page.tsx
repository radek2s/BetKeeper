'use client'
import { PasskeyList } from '@corbado/react'
import axios from 'axios'


const username = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID || ''
const password = process.env.NEXT_PUBLIC_CORBADO_TOKEN || ''

export default function Dashboard() {

  async function fetchUsers() {
    try {
      console.log(username, password)
      const pass = btoa(`${username}:${password}`)
      console.log(pass)
      //https://apireference.cloud.corbado.io/backendapi-v2/
      const result = await axios.get(`https://backendapi.cloud.corbado.io/v2/users`, {
        auth: { username, password },
      })
      // const data = await fetch(``,
      //   {
      //     headers: {
      //       'Authorization': `Basic ${pass}`,
      //       'Accept': 'application/json'
      //     },
      //     mode: 'no-cors'
      //   })
      // console.log(data.json())
      console.log(result)
    } catch (e) {
      console.error(e)
    }

  }

  fetchUsers()

  return <div>
    <h1>Hello user</h1>
    <PasskeyList />
  </div>
}
