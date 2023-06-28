import * as Cord from '@cord.network/sdk'
import fetch from 'node-fetch'
import type { SubmittableExtrinsic } from '@cord.network/types'

export async function cord_api_query(
  modules: any,
  section: any,
  identifier: any
) {
  const url = Cord.ConfigService.get('apiUrl')
  const token = Cord.ConfigService.get('token')

  const cordApiUrl = `${url}/query/${modules}/${section}/${identifier}`

  if (url) {
    try {
      const resp = await fetch(cordApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
  const url = Cord.ConfigService.get('apiUrl')
  const token = Cord.ConfigService.get('token')

  const cordApiUrl = `${url}/${modules}/extrinsic`

  if (url) {
    try {
      const submit = await fetch(cordApiUrl, {
        body: JSON.stringify({
          extrinsic: tx.toHex(),
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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