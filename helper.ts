import fetch from 'node-fetch'
import type { SubmittableExtrinsic } from '@cord.network/types'
import { API_URL } from './packages/network/src/chain/Chain'

const { CORD_WSS_URL, CORD_API_URL, CORD_API_TOKEN } = process.env

export async function cord_api_query(
  modules: any,
  section: any,
  identifier: any
) {
  const url = Cord.ConfigService.get('apiUrl')
  const token = Cord.ConfigService.get('token')

  if (url && token) {
    const cordApiUrl = `${url}/query/${modules}/${section}/${identifier}`

    try {
      const resp = await fetch(cordApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CORD_API_TOKEN}`,
        },
      })
      const data = resp.json()
      return data
    } catch (error) {
      return error
    }
  } else {
    console.log('URL or Token not found')
    return null
  }
}

export async function cordApiTx(tx: SubmittableExtrinsic, modules: any) {
  const url = Cord.ConfigService.get('apiUrl')
  const token = Cord.ConfigService.get('token')

  if (url && token) {
    const cordApiUrl = `${url}/${modules}/extrinsic`

    try {
      const submit = await fetch(cordApiUrl, {
        body: JSON.stringify({
          extrinsic: tx.toHex(),
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CORD_API_TOKEN}`,
        },
      })
      const data = submit.json()
      return data
    } catch (error) {
      return error
    }
  } else {
    console.log('URL or Token not found')
    return null
  }
}
