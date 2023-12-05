import fetch from 'node-fetch'
import * as ConfigService from './ConfigService'
import type { SubmittableExtrinsic } from '@cord.network/types'

export async function cord_api_query(
  modules: any,
  section: any,
  identifier: any
) {
  const url = ConfigService.get('apiUrl')
  const token = ConfigService.get('token')

  if (!url || !token) {
    throw Error('Missing token')
  }

  try {
    const cordApiUrl = `${url}/api/v1/query/${modules}/${section}/${identifier}`

    const resp = await fetch(cordApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (resp.status === 403) {
      throw Error('Invalid token')
    }
    // if (resp.status !== 200) {
    //   throw Error('missing resp')
    // }

    const data = await resp.json()
    return data
  } catch (error) {
    throw Error('Invalid response ')
  }
}

export async function cordApiTx(tx: SubmittableExtrinsic, modules: any) {
  const url = ConfigService.get('apiUrl')
  const token = ConfigService.get('token')

  if (!url || !token) {
    throw Error('Missing token')
  }

  try {
    const cordApiUrl = `${url}/api/v1/${modules}/extrinsic`

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

    if (submit.status === 403) {
      throw Error('Invalid token')
    }
    // if (submit.status !== 200) {
    //   throw Error('missing resp')
    // }

    const data = await submit.json()
    return data
  } catch (error) {
    throw Error('Invalid response ')
  }
}
