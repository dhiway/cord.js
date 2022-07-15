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

export class ERROR_UNAUTHORIZED extends SDKError {}

export class ERROR_ID_MALFORMED extends SDKError {
  constructor() {
    super('Identifier invalid or malformed')
  }
}

export class ERROR_CONTROLLER_MISMATCH extends SDKError {
  constructor() {
    super('Contoller details invalid or malformed')
  }
}

export class ERROR_SPACE_ID_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Space identifier missing')
  }
}
export class ERROR_SPACE_HASH_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Space hash missing')
  }
}

export class ERROR_SPACE_OWNER_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Space Owner missing')
  }
}

export class ERROR_SCHEMA_IDENTIFIER_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Schema identifier missing')
  }
}

export class ERROR_SCHEMA_ID_NOT_MATCHING extends SDKError {
  constructor(fromSchema: string, provided: string) {
    super(
      `Provided $id "${provided}" and schema $id "${fromSchema}" are not matching`
    )
  }
}

export class ERROR_SCHEMA_PROPERTIES_NOT_MATCHING extends SDKError {
  constructor() {
    super('Required properties do not match Schema properties')
  }
}

export class ERROR_UNSUPPORTED_KEY extends SDKError {
  constructor(keyType: string) {
    super(
      `The provided key tyERROR_HASH_TYPEpe "${keyType}" is currently not supported.`
    )
  }
}

export class ERROR_CONTENT_HASH_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Content hash missing')
  }
}

export class ERROR_STREAM_ID_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Stream identifier missing')
  }
}
export class ERROR_STREAM_HASH_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Stream hash missing')
  }
}

export class ERROR_STREAM_OWNER_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Owner missing')
  }
}

export class ERROR_STREAM_SCHEMA_ID_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Stream schema identifier missing')
  }
}
export class ERROR_REVOCATION_BIT_MISSING extends SDKError {
  constructor() {
    super('Revoked identifier missing')
  }
}

export class ERROR_OWNER_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Owner missing')
  }
}

export class ERROR_STREAM_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Stream missing')
  }
}

export class ERROR_MC_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Credential content missing')
  }
}

export class ERROR_EVIDENCE_ID_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Evidence ID missing')
  }
}

export class ERROR_CONTENT_NONCE_MAP_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Hashtree in Content missing')
  }
}

export class ERROR_CONTENT_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Content missing')
  }
}

export class ERROR_CONTENT_STREAM_NOT_PROVIDED extends SDKError {
  constructor() {
    super('Content stream missing')
  }
}

export class ERROR_ADDRESS_TYPE extends SDKError {
  constructor() {
    super('Address of wrong type')
  }
}

export class ERROR_HASH_TYPE extends SDKError {
  constructor() {
    super('Hash of wrong type')
  }
}

export class ERROR_IDENTIFIER_TYPE extends SDKError {
  constructor() {
    super('Identifier of wrong type')
  }
}
export class ERROR_HASH_MALFORMED extends SDKError {
  constructor(hash?: string, type?: string) {
    let message = ''
    if (hash && type) {
      message = `Provided ${type} hash invalid or malformed \nHash: ${hash}`
    } else if (hash) {
      message = `Provided hash invalid or malformed \nHash: ${hash}`
    } else {
      message = 'Provided hash invalid or malformed'
    }
    super(message)
  }
}

export class ERROR_CONTENT_PROPERTIES_MALFORMED extends SDKError {
  constructor() {
    super('Content stream malformed')
  }
}

export class ERROR_OBJECT_MALFORMED extends SDKError {
  constructor() {
    super('Object form is not verifiable')
  }
}

export class ERROR_SCHEMA_OWNER_TYPE extends SDKError {
  constructor() {
    super('Schema owner of wrong type')
  }
}

export class ERROR_CONTENT_NONCE_MAP_MALFORMED extends SDKError {
  constructor(statement?: string) {
    let message = ''
    if (statement) {
      message = `Nonce map malformed or incomplete: no nonce for statement "${statement}"`
    } else {
      message = `Nonce map malformed or incomplete`
    }
    super(message)
  }
}

export class ERROR_MESSAGE_BODY_MALFORMED extends SDKError {
  constructor() {
    super('Message body is malformed or wrong type')
  }
}

export class ERROR_SIGNATURE_DATA_TYPE extends SDKError {
  constructor() {
    super('Signature malformed')
  }
}

export class ERROR_ADDRESS_INVALID extends SDKError {
  constructor(address?: string, type?: string) {
    let message = ''
    if (address && type) {
      message = `Provided ${type} address invalid \n\n    Address: ${address}`
    } else if (address) {
      message = `Provided address invalid \n\n    Address: ${address}`
    } else {
      message = `Provided address invalid`
    }
    super(message)
  }
}

export class ERROR_EVIDENCE_ID_UNVERIFIABLE extends SDKError {
  constructor() {
    super('Evidence ID could not be verified')
  }
}
export class ERROR_SIGNATURE_UNVERIFIABLE extends SDKError {
  constructor() {
    super('Signature could not be verified')
  }
}
export class ERROR_CREDENTIAL_UNVERIFIABLE extends SDKError {
  constructor() {
    super('Credential could not be verified')
  }
}
export class ERROR_CONTENT_UNVERIFIABLE extends SDKError {
  constructor() {
    super('Content could not be verified')
  }
}
export class ERROR_NESTED_CONTENT_UNVERIFIABLE extends SDKError {
  constructor() {
    super('Nested stream data does not validate against Schema')
  }
}
export class ERROR_IDENTITY_MISMATCH extends SDKError {
  constructor(context?: string, type?: string) {
    let message = ''
    if (type && context) {
      message = `${type} is not owner of the ${context}`
    } else if (context) {
      message = `Identity is not owner of the ${context}`
    } else {
      message = 'Addresses expected to be equal mismatched'
    }
    super(message)
  }
}

export class ERROR_WS_ADDRESS_NOT_SET extends SDKError {
  constructor() {
    super('Node address to connect to not configured!')
  }
}

export class ERROR_ROOT_HASH_UNVERIFIABLE extends SDKError {
  constructor() {
    super('RootHash could not be verified')
  }
}
export class ERROR_DECOMPRESSION_ARRAY extends SDKError {
  constructor(type?: string) {
    let message = ''
    if (type) {
      message = `Provided compressed ${type} not an Array or not of defined length`
    } else {
      message =
        'Provided compressed object not an Array or not of defined length'
    }
    super(message)
  }
}

export class ERROR_COMPRESS_OBJECT extends SDKError {
  constructor(object?: Record<string, any>, type?: string) {
    let message = ''
    if (object && type) {
      message = `Property Not Provided while compressing ${type}:\n${JSON.stringify(
        object,
        null,
        2
      )}`
    } else if (object) {
      message = `Property Not Provided while compressing object:\n${JSON.stringify(
        object,
        null,
        2
      )}`
    } else {
      message = `Property Not Provided while compressing object`
    }

    super(message)
  }
}

export class ERROR_DECODING_MESSAGE extends SDKError {
  constructor() {
    super('Error decoding message')
  }
}
export class ERROR_PARSING_MESSAGE extends SDKError {
  constructor() {
    super('Error parsing message body')
  }
}

export class ERROR_UNKNOWN extends SDKError {
  constructor() {
    super('An unknown error ocurred')
  }
}

export class ERROR_TIMEOUT extends SDKError {
  constructor() {
    super('Operation timed out')
  }
}

export class ERROR_INVALID_PROOF_FOR_STATEMENT extends SDKError {
  constructor(statement: string) {
    super(`Proof could not be verified for statement\n${statement}`)
  }
}

export class ERROR_NO_PROOF_FOR_STATEMENT extends SDKError {
  constructor(statement: string) {
    super(`No matching proof found for statement\n${statement}`)
  }
}

export class ERROR_MNEMONIC_PHRASE_MALFORMED extends SDKError {
  constructor() {
    super('Mnemonic phrase malformed or too short')
  }
}

export class ERROR_MNEMONIC_PHRASE_INVALID extends SDKError {
  constructor() {
    super('Mnemonic phrase invalid')
  }
}

export class ERROR_INVALID_DID_PREFIX extends SDKError {
  constructor(identifier: string) {
    super(`Not a Cord DID\n${identifier}`)
  }
}

export class ERROR_DID_IDENTIFIER_MISMATCH extends SDKError {
  constructor(identifier: string, id: string) {
    super(
      `This identifier ${identifier} does not match the DID Document identifier ${id}`
    )
  }
}

export class ERROR_INVALID_ID_PREFIX extends SDKError {
  constructor(identifier: string) {
    super(`Not a Cord ID\n${identifier}`)
  }
}

export class ERROR_MESSAGE_TYPE extends SDKError {
  constructor(message: string, expected: string) {
    super(`Unexpected message type. Received ${message}, expected ${expected}`)
  }
}
