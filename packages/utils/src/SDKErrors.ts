/**
 * SDKErrors are CORD-specific errors, with associated codes and descriptions.
 *
 * @packageDocumentation
 * @module SDKErrors
 */

/* eslint-disable max-classes-per-file */

export class SDKError extends Error {
  constructor(...args: ConstructorParameters<ErrorConstructor>) {
    super(...args)
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

export class SchemaIdMissingError extends SDKError {}

export class SchemaError extends SDKError {}

export class SchemaUnknownPropertiesError extends SDKError {}

export class SchemaIdentifierMissingError extends SDKError {}
export class RegistryIdentifierMissingError extends SDKError {}
export class AuthorizationIdentifierMissingError extends SDKError {}

export class SchemaIdMismatchError extends SDKError {
  constructor(fromSchema: string, provided: string) {
    super(
      `Provided $id "${provided}" does not match schema $id "${fromSchema}"`
    )
  }
}

export class NestedContentUnverifiableError extends SDKError {}

export class RootHashUnverifiableError extends SDKError {}

export class ContentHashMissingError extends SDKError {}

export class RevokedTypeError extends SDKError {}

export class HolderMissingError extends SDKError {}

export class IssuerMismatchError extends SDKError {}

export class SchemaMismatchError extends SDKError {}

export class SubjectMissingError extends SDKError {}

export class EvidenceMissingError extends SDKError {}

export class ContentNonceMapMissingError extends SDKError {}

export class ContentMissingError extends SDKError {}

export class HashTypeError extends SDKError {}

export class IdentifierMissingError extends SDKError {}

export class StreamHashMissingError extends SDKError {}

export class IssuerMissingError extends SDKError {}

export class CredentialUnverifiableError extends SDKError {}

export class ContentNonceMapMalformedError extends SDKError {
  constructor(statement?: string) {
    if (statement) {
      super(`Nonce map malformed or incomplete for statement "${statement}"`)
    } else {
      super(`Nonce map malformed or incomplete`)
    }
  }
}
export class CreatorMissingError extends SDKError {}
export class RegistryInputMalformedError extends SDKError {}
export class DelegateMissingError extends SDKError {}
export class SchemaMissingError extends SDKError {}
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

export class ContentUnverifiableError extends SDKError {}

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

export class ScoreMissingError extends SDKError {}
