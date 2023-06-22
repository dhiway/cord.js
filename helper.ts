import fetch from 'node-fetch'
import type { SubmittableExtrinsic } from '@cord.network/types'
import { API_URL } from './packages/network/src/chain/Chain'

export async function cord_api_query(
  modules: any,
  section: any,
  identifier: any
) {
  const url = API_URL
  const cordApiUrl = `${url}/query/${modules}/${section}/${identifier}`

  if (url) {
    try {
      const resp = await fetch(cordApiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = resp.json()
      return data
    } catch (error) {
      return error
    }
  } else {
    console.log('URL not found')
  }
}

export async function cordApiTx(tx: SubmittableExtrinsic, modules: any) {
  const url = API_URL
  const cordApiUrl = `${url}/${modules}/extrinsic`

  if (url) {
    try {
      const submit = await fetch(cordApiUrl, {
        body: JSON.stringify({
          extrinsic: tx.toHex(),
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = submit.json()
      return data
    } catch (error) {
      return error
    }
  } else {
    console.log('URL not found')
  }
}
