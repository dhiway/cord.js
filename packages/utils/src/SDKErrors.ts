/**
 * SDKErrors are CORD-specific errors, with associated codes and descriptions.
 *
 * @packageDocumentation
 * @module SDKErrors
 */

/* eslint-disable max-classes-per-file */

export class SDKError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    // this line is the only reason for using SDKError
    this.name = this.constructor.name
  }
}

export class UnauthorizedError extends SDKError {}

export class UnsupportedKeyError extends SDKError {
  constructor(keyType: string) {
    super(`The provided key type "${keyType}" is currently not supported`)
  }
}

export class BlockchainApiMissingError extends SDKError {
  constructor(options?: ErrorOptions) {
    super(
      'The Chain API is not set. Did you forget to call `Cord.connect(…)` or `Cord.init(…)`?',
      options
    )
  }
}
export class InputContentsMalformedError extends SDKError {}
export class NestedContentUnverifiableError extends SDKError {}
export class ContentHashMissingError extends SDKError {}
export class ContentNonceMapMissingError extends SDKError {}
export class ContentMissingError extends SDKError {}
export class ContentTypeMissingError extends SDKError {}
export class ContentUnverifiableError extends SDKError {}
export class ContentNonceMapMalformedError extends SDKError {
  constructor(statement?: string) {
    if (statement) {
      super(`Nonce map malformed or incomplete for statement "${statement}"`)
    } else {
      super(`Nonce map malformed or incomplete`)
    }
  }
}
// Schema Errors
export class SchemaError extends SDKError {}
export class SchemaUnknownPropertiesError extends SDKError {}
export class SchemaMismatchError extends SDKError {}
export class SchemaMissingError extends SDKError {}
export class SchemaIdentifierMissingError extends SDKError {}
export class SchemaIdMismatchError extends SDKError {
  constructor(fromSchema: string, provided: string) {
    super(
      `Provided $id "${provided}" does not match schema $id "${fromSchema}"`
    )
  }
}

// ChainSPace Errors
export class ChainSpaceMismatchError extends SDKError {}

// Statement Errors
export class StatementRevokedError extends SDKError {}
export class StatementCreatorMismatchError extends SDKError {}

// Identifier Errors
export class IdentifierMissingError extends SDKError {}
export class InvalidIdentifierError extends SDKError {}
export class InvalidURIError extends SDKError {}
export class InvalidInputError extends SDKError {}

// Score Errors
export class RatingContentError extends SDKError {}
export class RatingPropertiesError extends SDKError {}
export class InvalidRatingType extends SDKError {}

// export class ScoreCollectorMissingError extends SDKError {}
// export class ScoreEntityMissingError extends SDKError {}
// export class ScoreTidMissingError extends SDKError {}
// export class ScoreRatingEntryTypeMissingError extends SDKError {}
// export class ScoreCountMissingError extends SDKError {}
// export class ScoreRatingMissingError extends SDKError {}
// export class ScoreRatingTypeMissingError extends SDKError {}
// export class ScoreRatingEntryTypeMissMatchError extends SDKError {}
// export class RatingInputTypeMissMatchError extends SDKError {}
// export class ScoreRatingTypeMissMatchError extends SDKError {}
// export class RatingExceedsMaxValueError extends SDKError {}
// export class ScoreCollectorTypeMissMatchError extends SDKError {}
// export class ScoreEntityTypeMissMatchError extends SDKError {}
// export class ScoreTidTypeMissMatchError extends SDKError {}
// export class ScoreCountTypeMissMatchError extends SDKError {}
// export class ScoreEntryAlreadyPresentError extends SDKError {}

export class EncryptionError extends SDKError {}

export class DidError extends SDKError {}

export class DidExporterError extends SDKError {}

export class DidBatchError extends SDKError {}

export class DidNotFoundError extends SDKError {}

export class DidResolveUpgradedDidError extends SDKError {}

export class DidDeactivatedError extends SDKError {}

export class AddressTypeError extends SDKError {}

export class SignatureMalformedError extends SDKError {}

export class SignatureUnverifiableError extends SDKError {}

export class ObjectUnverifiableError extends SDKError {}

export class StatementError extends SDKError {}
export class ChainSpaceMissingError extends SDKError {}
export class AuthorizationMissingError extends SDKError {}
export class DocumentContentMalformed extends SDKError {}
export class CordDispatchError extends SDKError {}
export class CordFetchError extends SDKError {}
export class CordQueryError extends SDKError {}
export class InvalidPermissionError extends SDKError {}

export class RootHashUnverifiableError extends SDKError {}
export class RevokedTypeError extends SDKError {}

export class HolderMissingError extends SDKError {}

export class IssuerMismatchError extends SDKError {}
export class SubjectMissingError extends SDKError {}

export class EvidenceMissingError extends SDKError {}

export class HashTypeError extends SDKError {}

export class StatementHashMissingError extends SDKError {}

export class IssuerMissingError extends SDKError {}

export class CredentialUnverifiableError extends SDKError {}

export class CreatorMissingError extends SDKError {}
export class RegistryInputMalformedError extends SDKError {}
export class DelegateMissingError extends SDKError {}
export class AuthorizationIdMissingError extends SDKError {}

export class DataStructureError extends SDKError {}

export class IdentityMismatchError extends SDKError {
  constructor(context?: string, type?: string) {
    if (type && context) {
      super(`${type} is not owner of the ${context}`)
    } else if (context) {
      super(`Identity is not owner of the ${context}`)
    } else {
      super('Addresses expected to be equal mismatched')
    }
  }
}
export class UnknownMessageBodyTypeError extends SDKError {}

export class InvalidDidFormatError extends SDKError {
  constructor(did: string, options?: ErrorOptions) {
    super(`Not a valid CORD DID "${did}"`, options)
  }
}

export class DidSubjectMismatchError extends SDKError {
  constructor(actual: string, expected: string) {
    super(
      `The DID "${actual}" doesn't match the DID Document's URI "${expected}"`
    )
  }
}

export class AddressInvalidError extends SDKError {
  constructor(id?: string, type?: string) {
    if (id && type) {
      super(`Provided ${type} identifier "${id}" is invalid`)
    } else if (id) {
      super(`Provided identifier "${id}" is invalid`)
    } else {
      super(`Provided identifier invalid`)
    }
  }
}
export class IdentifierInvalidError extends SDKError {
  constructor(address?: string, type?: string) {
    if (address && type) {
      super(`Provided ${type} address "${address}" is invalid`)
    } else if (address) {
      super(`Provided address "${address}" is invalid`)
    } else {
      super(`Provided address invalid`)
    }
  }
}

export class HashMalformedError extends SDKError {
  constructor(hash?: string, type?: string) {
    if (hash && type) {
      super(`Provided ${type} hash "${hash}" is invalid or malformed`)
    } else if (hash) {
      super(`Provided hash "${hash}" is invalid or malformed`)
    } else {
      super('Provided hash invalid or malformed')
    }
  }
}

export class InvalidProofForStatementError extends SDKError {
  constructor(statement: string) {
    super(`Proof could not be verified for statement:\n${statement}`)
  }
}
export class NoProofForStatementError extends SDKError {
  constructor(statement: string) {
    super(`No matching proof found for statement:\n${statement}`)
  }
}

export class SubscriptionsNotSupportedError extends SDKError {
  constructor(options?: ErrorOptions) {
    super(
      'This function is not available if the blockchain API does not support state or event subscriptions, use `WsProvider` to enable the complete feature set',
      options
    )
  }
}

export class DecodingMessageError extends SDKError {}

export class TimeoutError extends SDKError {}

export class CodecMismatchError extends SDKError {}

export class AssetIssuerMismatch extends SDKError {}

export class AssetInstanceNotFound extends SDKError {}

export class AssetNotFound extends SDKError {}

export class AssetStatusError extends SDKError {}

export class InvalidAssetType extends SDKError {}

export class InvalidAssetStatus extends SDKError {}

export class DuplicateStatementError extends SDKError {}
