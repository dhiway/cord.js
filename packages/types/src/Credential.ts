/**
 * @packageDocumentation
 * @module ICredential
 */

import type { IStream, CompressedStream } from './Stream'
import type { IContentStream, CompressedContentStream } from './ContentStream'

export interface ICredential {
  content: IStream
  request: IContentStream
}

export type CompressedCredential = [CompressedContentStream, CompressedStream]
