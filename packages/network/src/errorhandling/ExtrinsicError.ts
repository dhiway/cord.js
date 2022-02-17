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
  Schema: {
    ERROR_SCHEMA_ALREADY_EXISTS: {
      code: 41000,
      message: 'Schema already exist',
    },
    ERROR_SCHEMA_NOT_FOUND: { code: 41001, message: 'Schema not found' },
    ERROR_SCHEMA_REVOKED: { code: 41002, message: 'Schema marked inactive' },
    ERROR_INVALID_CID_ENCODING: {
      code: 41003,
      message: 'Invalid CID encoding',
    },
    ERROR_CID_VERSION: { code: 41004, message: 'Invalid CID Version' },
    ERROR_STATUS_CHANGE_NOT_REQUIRED: {
      code: 41005,
      message: 'Schema status change not required',
    },
    ERROR_UNAUTHORISED_OPERATION: {
      code: 41006,
      message: 'Schema usage not authorised',
    },
    ERROR_TOO_MANY_SCHEMA_DELEGATES: {
      code: 41007,
      message: 'Schema delegates exceed max limit',
    },
    ERROR_SCHEMA_NOT_PERMISSIONED: {
      code: 41008,
      message: 'Schema type is not permissioned',
    },
    ERROR_SCHEMA_PERMISSION_CHANGE_NOT_REQUIRED: {
      code: 41009,
      message: 'Schema permission change not required',
    },
    ERROR_SCHEMA_VERSION: {
      code: 41010,
      message: 'Invalid schema version',
    },
    ERROR_SCHEMA_GENESIS: {
      code: 41011,
      message: 'Invalid schema genesis version',
    },
    ERROR_SCHEMA_AUTHORISATION: {
      code: 41012,
      message: 'Identity not authorised to delegate this schema',
    },
    UNKNOWN_SCHEMA_ERROR: {
      code: 41013,
      message: 'An unknown schema pallet error occured',
    },
  },
  Stream: {
    ERROR_STREAM_ALREADY_EXISTS: {
      code: 42000,
      message: 'Stream already exist',
    },
    ERROR_STREAM_NOT_FOUND: { code: 42001, message: 'Stream not found' },
    ERROR_STREAM_REVOKED: { code: 42002, message: 'Stream revoked' },
    ERROR_STREAM_STATUS_CHANGE_NOT_REQUIRED: {
      code: 42003,
      message: 'Stream status change not required',
    },
    ERROR_STREAM_OPERATION_NOT_PERMITTED: {
      code: 42004,
      message: 'Stream operation not permitted',
    },
    ERROR_STREAM_LINK_NOT_FOUND: {
      code: 42005,
      message: 'Stream link not found',
    },
    ERROR_STREAM_LINK_REVOKED: {
      code: 42006,
      message: 'Stream link revoked',
    },
    UNKNOWN_STREAM_ERROR: {
      code: 42007,
      message: 'An unknown stream pallet error occured',
    },
  },
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
  UNKNOWN_ERROR: { code: -1, message: 'an unknown extrinsic error ocurred' },
}

export enum PalletIndex {
  DID = 31,
  Entity = 32,
  Schema = 41,
  Stream = 42,
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
  [PalletIndex.Schema]: {
    0: ExtrinsicErrors.Schema.ERROR_SCHEMA_ALREADY_EXISTS,
    1: ExtrinsicErrors.Schema.ERROR_SCHEMA_NOT_FOUND,
    2: ExtrinsicErrors.Schema.ERROR_SCHEMA_REVOKED,
    3: ExtrinsicErrors.Schema.ERROR_INVALID_CID_ENCODING,
    4: ExtrinsicErrors.Schema.ERROR_CID_VERSION,
    5: ExtrinsicErrors.Schema.ERROR_STATUS_CHANGE_NOT_REQUIRED,
    6: ExtrinsicErrors.Schema.ERROR_UNAUTHORISED_OPERATION,
    7: ExtrinsicErrors.Schema.ERROR_TOO_MANY_SCHEMA_DELEGATES,
    8: ExtrinsicErrors.Schema.ERROR_SCHEMA_NOT_PERMISSIONED,
    9: ExtrinsicErrors.Schema.ERROR_SCHEMA_PERMISSION_CHANGE_NOT_REQUIRED,
    10: ExtrinsicErrors.Schema.ERROR_SCHEMA_VERSION,
    11: ExtrinsicErrors.Schema.ERROR_SCHEMA_GENESIS,
    12: ExtrinsicErrors.Schema.ERROR_SCHEMA_AUTHORISATION,
    [-1]: ExtrinsicErrors.Schema.UNKNOWN_SCHEMA_ERROR,
  },
  [PalletIndex.Stream]: {
    0: ExtrinsicErrors.Stream.ERROR_STREAM_ALREADY_EXISTS,
    1: ExtrinsicErrors.Stream.ERROR_STREAM_NOT_FOUND,
    2: ExtrinsicErrors.Stream.ERROR_STREAM_REVOKED,
    3: ExtrinsicErrors.Stream.ERROR_STREAM_STATUS_CHANGE_NOT_REQUIRED,
    4: ExtrinsicErrors.Stream.ERROR_STREAM_OPERATION_NOT_PERMITTED,
    5: ExtrinsicErrors.Stream.ERROR_STREAM_LINK_NOT_FOUND,
    6: ExtrinsicErrors.Stream.ERROR_STREAM_LINK_REVOKED,
    [-1]: ExtrinsicErrors.Stream.UNKNOWN_STREAM_ERROR,
  },
  [PalletIndex.Entity]: {
    0: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_NOT_FOUND,
    1: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_ALREADY_EXISTS,
    2: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_ALREADY_REVOKED,
    3: ExtrinsicErrors.Entity.ERROR_NOT_PERMITTED_TO_REVOKE,
    4: ExtrinsicErrors.Entity.ERROR_VERIFIER_ACCOUNT_REVOKED,
    5: ExtrinsicErrors.Entity.ERROR_NO_STATUS_CHANGE_REQUIRED,
    [-1]: ExtrinsicErrors.Entity.UNKNOWN_VERIFIER_ERROR,
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
