/**
 * @packageDocumentation
 * @module IMark
 */

import type { IStream, CompressedStream } from './Stream.js'
import type { IMarkContent, CompressedMarkContent } from './MarkContent.js'

export interface IMark {
  content: IStream
  request: IMarkContent
}

export type CompressedMark = [CompressedMarkContent, CompressedStream]
