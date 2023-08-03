import fetch from 'node-fetch'
import * as ConfigService from './ConfigService';
import type { SubmittableExtrinsic } from '@cord.network/types'

export async function cord_api_query(
  modules: any,
  section: any,
  identifier: any
) {
  const url = ConfigService.get('apiUrl')
  const token = ConfigService.get('token')

  if (!url || !token) {
    return null
  }

  try {
    const cordApiUrl = `${url}/query/${modules}/${section}/${identifier}`

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
}

export async function cordApiTx(tx: SubmittableExtrinsic, modules: any) {
  const url = ConfigService.get('apiUrl')
  const token = ConfigService.get('token')

  if (!url || !token) {
    return null
  }

  try {
    const cordApiUrl = `${url}/${modules}/extrinsic`

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
}
