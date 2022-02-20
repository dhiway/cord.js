/**
 * @packageDocumentation
 * @module ICredential
 */

import type { IStream, CompressedStream } from './Stream.js'
import type { IMarkContent, CompressedMarkContent } from './MarkContent.js'

export interface ICredential {
  content: IStream
  request: IMarkContent
}

export type CompressedCredential = [CompressedMarkContent, CompressedStream]
