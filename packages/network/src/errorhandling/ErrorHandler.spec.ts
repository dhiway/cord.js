/**
 * @group unit/errorhandling
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ISubmittableResult } from '@cord.network/types'
import type { EventRecord } from '@polkadot/types/interfaces'
import { ErrorHandler } from './index'

describe('ErrorHandler', () => {
  it('test extrinsic failed', () => {
    const evtRecord = {
      event: {
        section: 'system',
        method: 'ExtrinsicFailed',
      },
    }
    const submittableResult = {
      events: [evtRecord] as unknown as EventRecord[],
    } as ISubmittableResult

    expect(ErrorHandler.extrinsicFailed(submittableResult)).toBe(true)
  })

  it('test extrinsic succeeded', () => {
    const evtRecord = {
      event: {
        section: 'system',
        method: 'ExtrinsicSuccess',
      },
    }
    const submittableResult = {
      events: [evtRecord] as unknown as EventRecord[],
    } as ISubmittableResult

    expect(ErrorHandler.extrinsicFailed(submittableResult)).toBe(false)
  })
})
