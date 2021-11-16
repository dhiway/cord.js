/**
 * ExtrinsicErrors are CORD-specific errors, with associated codes and descriptions.
 *
 * @packageDocumentation
 * @module ErrorHandler
 */

import type { ModuleError } from './ErrorHandler'

export class ExtrinsicError extends Error {
  public errorCode: number

  public constructor(errorCode: number, message: string) {
    super(message)
    this.errorCode = errorCode
  }
}

export const ExtrinsicErrors = {
  Entity: {
    ERROR_VERIFIER_ACCOUNT_NOT_FOUND: {
      code: 32000,
      message: 'Entity verifier not found',
    },
    ERROR_VERIFIER_ACCOUNT_ALREADY_EXISTS: {
      code: 32001,
      message: 'Entity verifier already exists',
    },
    ERROR_VERIFIER_ACCOUNT_ALREADY_REVOKED: {
      code: 32002,
      message: 'Entity verifier account already revoked',
    },
    ERROR_NOT_PERMITTED_TO_REVOKE: {
      code: 32003,
      message: 'Entity verifier account not permitted to revoke',
    },
    ERROR_VERIFIER_ACCOUNT_REVOKED: {
      code: 32004,
      message: 'Entity verifier account revoked',
    },
    ERROR_NO_STATUS_CHANGE_REQUIRED: {
      code: 32005,
      message: 'Entity verifier - No status change required',
    },
    UNKNOWN_VERIFIER_ERROR: {
      code: 32100,
      message: 'an unknown entity pallet error occured',
    },
  },
  Schema: {
    ERROR_INVALID_REQUEST: {
      code: 33000,
      message: 'Schema request is not valid',
    },
    ERROR_SAME_SCHEMA_ID_AND_HASH: {
      code: 33001,
      message: 'Schema ID and hash are the same',
    },
    ERROR_SCHEMA_ALREADY_EXISTS: {
      code: 33002,
      message: 'Schema already exist',
    },
    ERROR_SCHEMA_HASH_ALREADY_EXISTS: {
      code: 33003,
      message: 'Schema hash already exist',
    },
    ERROR_SCHEMA_NOT_FOUND: { code: 33004, message: 'Schema not found' },
    ERROR_SCHEMA_DELEGATE_NOT_FOUND: {
      code: 33005,
      message: 'Schema delegate not found',
    },
    ERROR_SCHEMA_REVOKED: { code: 33006, message: 'Schema revoked' },
    ERROR_INVALID_CID_ENCODING: {
      code: 33007,
      message: 'Invalid CID encoding',
    },
    ERROR_CID_ALREADY_ANCHORED: { code: 33008, message: 'CID already mapped' },
    ERROR_SCHEMA_STATUS_CHANGE_NOT_REQUIRED: {
      code: 33009,
      message: 'Schema status change not required',
    },
    ERROR_SCHEMA_OPERATION_NOT_PERMITTED: {
      code: 33010,
      message: 'Schema operation not permitted',
    },
    ERROR_TOO_MANY_SCHEMA_DELEGATES: {
      code: 33011,
      message: 'Schema delegates exceed max limit',
    },
    ERROR_SCHEMA_NOT_PERMISSIONED: {
      code: 33012,
      message: 'Schema not permissioned type',
    },
    ERROR_SCHEMA_PERMISSION_CHANGE_NOT_REQUIRED: {
      code: 33013,
      message: 'Schema permission change not required',
    },
    UNKNOWN_SCHEMA_ERROR: {
      code: 33014,
      message: 'An unknown schema pallet error occured',
    },
  },
  Stream: {
    ERROR_INVALID_REQUEST: {
      code: 34000,
      message: 'Stream request is not valid',
    },
    ERROR_SAME_STREAM_ID_AND_HASH: {
      code: 34001,
      message: 'Strea identifier and hash are the same',
    },
    ERROR_STREAM_ALREADY_EXISTS: {
      code: 34002,
      message: 'Stream already exist',
    },
    ERROR_STREAM_NOT_FOUND: { code: 34003, message: 'Stream not found' },
    ERROR_STREAM_REVOKED: { code: 34004, message: 'Stream revoked' },
    ERROR_CID_ALREADY_ANCHORED: {
      code: 34005,
      message: 'CID already anchored',
    },
    ERROR_STREAM_STATUS_CHANGE_NOT_REQUIRED: {
      code: 34006,
      message: 'Stream status change not required',
    },
    ERROR_STREAM_OPERATION_NOT_PERMITTED: {
      code: 34007,
      message: 'Stream operation not permitted',
    },
    ERROR_STREAM_LINK_NOT_FOUND: {
      code: 34008,
      message: 'Stream link not found',
    },
    ERROR_STREAM_LINK_REVOKED: {
      code: 34009,
      message: 'Stream link revoked',
    },
    UNKNOWN_STREAM_ERROR: {
      code: 34010,
      message: 'An unknown stream pallet error occured',
    },
  },
  UNKNOWN_ERROR: { code: -1, message: 'an unknown extrinsic error ocurred' },
}

export enum PalletIndex {
  DID = 31,
  Entity = 32,
  Schema = 33,
  Stream = 34,
  Nix = 35,
}

export interface IPalletToExtrinsicErrors {
  [key: number]: {
    [key: number]: {
      code: number
      message: string
    }
  }
}

export const PalletToExtrinsicErrors: IPalletToExtrinsicErrors = {
  [PalletIndex.Entity]: {
    0: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_NOT_FOUND,
    1: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_ALREADY_EXISTS,
    2: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_ALREADY_REVOKED,
    3: ExtrinsicErrors.Entity.ERROR_NOT_PERMITTED_TO_REVOKE,
    4: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_REVOKED,
    5: ExtrinsicErrors.Entity.ERROR_NO_STATUS_CHANGE_REQUIRED,
    [-1]: ExtrinsicErrors.Entity.UNKNOWN_VERIFIER_ERROR,
  },
  [PalletIndex.Schema]: {
    0: ExtrinsicErrors.Schema.ERROR_INVALID_REQUEST,
    1: ExtrinsicErrors.Schema.ERROR_SAME_SCHEMA_ID_AND_HASH,
    2: ExtrinsicErrors.Schema.ERROR_SCHEMA_ALREADY_EXISTS,
    3: ExtrinsicErrors.Schema.ERROR_SCHEMA_HASH_ALREADY_EXISTS,
    4: ExtrinsicErrors.Schema.ERROR_SCHEMA_NOT_FOUND,
    5: ExtrinsicErrors.Schema.ERROR_SCHEMA_DELEGATE_NOT_FOUND,
    6: ExtrinsicErrors.Schema.ERROR_SCHEMA_REVOKED,
    7: ExtrinsicErrors.Schema.ERROR_INVALID_CID_ENCODING,
    8: ExtrinsicErrors.Schema.ERROR_CID_ALREADY_ANCHORED,
    9: ExtrinsicErrors.Schema.ERROR_SCHEMA_STATUS_CHANGE_NOT_REQUIRED,
    10: ExtrinsicErrors.Schema.ERROR_SCHEMA_OPERATION_NOT_PERMITTED,
    11: ExtrinsicErrors.Schema.ERROR_TOO_MANY_SCHEMA_DELEGATES,
    12: ExtrinsicErrors.Schema.ERROR_SCHEMA_NOT_PERMISSIONED,
    13: ExtrinsicErrors.Schema.ERROR_SCHEMA_PERMISSION_CHANGE_NOT_REQUIRED,
    [-1]: ExtrinsicErrors.Schema.UNKNOWN_SCHEMA_ERROR,
  },
  [PalletIndex.Stream]: {
    0: ExtrinsicErrors.Stream.ERROR_INVALID_REQUEST,
    1: ExtrinsicErrors.Stream.ERROR_SAME_STREAM_ID_AND_HASH,
    2: ExtrinsicErrors.Stream.ERROR_STREAM_ALREADY_EXISTS,
    3: ExtrinsicErrors.Stream.ERROR_STREAM_NOT_FOUND,
    4: ExtrinsicErrors.Stream.ERROR_STREAM_REVOKED,
    5: ExtrinsicErrors.Stream.ERROR_CID_ALREADY_ANCHORED,
    6: ExtrinsicErrors.Stream.ERROR_STREAM_STATUS_CHANGE_NOT_REQUIRED,
    7: ExtrinsicErrors.Stream.ERROR_STREAM_OPERATION_NOT_PERMITTED,
    8: ExtrinsicErrors.Stream.ERROR_STREAM_LINK_NOT_FOUND,
    9: ExtrinsicErrors.Stream.ERROR_STREAM_LINK_REVOKED,
    [-1]: ExtrinsicErrors.Stream.UNKNOWN_STREAM_ERROR,
  },
}

/**
 * Returns a descriptive Substrate error given the pallet index and the error code.
 *
 * @param details The error details.
 * @param details.index The index of the CORD pallet as specified in the runtime.
 * @param details.error The index of the error definition inside the pallet.
 * @returns A new corresponding [[ExtrinsicError]].
 */
export function errorForPallet({
  index: moduleIndex,
  error: errorCode,
}: ModuleError['Module']): ExtrinsicError {
  if (!PalletToExtrinsicErrors[moduleIndex]) {
    return new ExtrinsicError(
      ExtrinsicErrors.UNKNOWN_ERROR.code,
      ExtrinsicErrors.UNKNOWN_ERROR.message
    )
  }
  if (!PalletToExtrinsicErrors[moduleIndex][errorCode]) {
    return new ExtrinsicError(
      PalletToExtrinsicErrors[moduleIndex][-1].code,
      PalletToExtrinsicErrors[moduleIndex][-1].message
    )
  }

  return new ExtrinsicError(
    PalletToExtrinsicErrors[moduleIndex][errorCode].code,
    PalletToExtrinsicErrors[moduleIndex][errorCode].message
  )
}
