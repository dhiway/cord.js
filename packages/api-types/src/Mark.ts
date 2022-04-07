/**
 * @packageDocumentation
 * @module IMark
 */

import type { IStreamDetails, CompressedStreamDetails } from './Stream.js'
import type { IMarkContent, CompressedMarkContent } from './MarkContent.js'

export interface IMark {
  content: IStreamDetails
  request: IMarkContent
}

export type CompressedMark = [CompressedMarkContent, CompressedStreamDetails]
