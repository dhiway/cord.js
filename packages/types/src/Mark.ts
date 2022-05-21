/**
 * @packageDocumentation
 * @module IMark
 */

import type { IStream, CompressedStream } from './Stream.js'
import type {
  IContentStream,
  CompressedContentStream,
} from './ContentStream.js'

export interface IMark {
  content: IStream
  request: IContentStream
}

export type CompressedMark = [CompressedContentStream, CompressedStream]
