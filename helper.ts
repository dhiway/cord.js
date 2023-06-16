/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fetch from 'node-fetch'
import { API_URL } from './packages/network/src/chain/Chain'

export async function cord_api_query(
  modules: any,
  section: any,
  identifier: any
) {
  const url = API_URL
  const cordApiUrl = `${url}/query/${modules}/${section}/${identifier}`

  let resp: any

  if (url) {
    resp = await fetch(cordApiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((data) => {
        return data.json()
      })
      .catch((error) => {
        console.error(error)
      })
  } else {
    console.log('URL not found')
  }

  return resp
}
