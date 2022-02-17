/**
 * @packageDocumentation
 * @module ICredential
 */

import type { IStream, CompressedStream } from './Stream.js'
import type {
  IContentStream,
  CompressedContentStream,
} from './ContentStream.js'

export interface ICredential {
  content: IStream
  request: IContentStream
}

export type CompressedCredential = [CompressedContentStream, CompressedStream]
