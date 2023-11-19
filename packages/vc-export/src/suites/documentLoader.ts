import type { RemoteDocument, Url } from 'jsonld/jsonld-spec'
import { validationContexts } from './context/index.js'

function isValidContextUrl(url: Url): url is keyof typeof validationContexts {
  return url in validationContexts
}

/**
 * @param url
 */
export async function documentLoader(url: Url): Promise<RemoteDocument> {
  if (isValidContextUrl(url)) {
    const context = validationContexts[url]
    return { contextUrl: undefined, documentUrl: url, document: context }
  }
  const vcjs = await import('@digitalbazaar/vc')
  return vcjs.defaultDocumentLoader(url)
}
