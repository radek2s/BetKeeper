'use server'
const API_URL = 'https://backendapi.corbado.io'
const username = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID
const password = process.env.NEXT_PUBLIC_CORBADO_TOKEN

export default async function getUsers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = { 'Content-Type': 'application/json' }
  headers['Authorization'] = `Basic ${Buffer.from(username + ':' + password).toString(
    'base64'
  )}`

  const res = await fetch(`${API_URL}/v1/users`, {
    headers,
    method: 'GET',
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  console.log(json)
  return json.data
}
