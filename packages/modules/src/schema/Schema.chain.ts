import type { Bytes, Option } from '@polkadot/types'
import type { BlockNumber } from '@polkadot/types/interfaces'

import type { PalletSchemaSchemaEntry } from '@cord.network/augment-api'
import {
  SchemaHash,
  DidUri,
  ISchema,
  SchemaId,
  SCHEMA_PREFIX,
} from '@cord.network/types'

import { ConfigService } from '@cord.network/config'
import * as Did from '@cord.network/did'
import { SDKErrors, Identifier, cord_api_query } from '@cord.network/utils'

import { serializeForHash, verifyDataStructure } from './Schema.js'

/**
 * Encodes the provided Schema for use in `api.tx.schema.add()`.
 *
 * @param schema The Schema to write on the blockchain.
 * @returns Encoded Schema.
 */
export function toChain(schema: ISchema): string {
  return serializeForHash(schema)
}

/**
 * Encodes the provided Schema['$id'] for use in `api.query.schema.schemas()`.
 *
 * @param schemaId The Schema id to translate for the blockchain.
 * @returns Encoded Schema id.
 */
export function idToChain(schemaId: ISchema['$id']): SchemaId {
  return Identifier.uriToIdentifier(schemaId)
}

// Transform a blockchain-formatted Schema input (represented as Bytes) into the original [[ISchema]].
// It throws if what was written on the chain was garbage.
function schemaInputFromChain(input: Bytes, schemaId: ISchema['$id']): ISchema {
  try {
    // Throws on invalid JSON input. Schema is expected to be a valid JSON document.
    const reconstructedObject = JSON.parse(input.toUtf8())
    const reconstructedSchemaId = `${SCHEMA_PREFIX}${schemaId}`

    const reconstructedSchema: ISchema = {
      ...reconstructedObject,
      $id: reconstructedSchemaId,
    }
    // If throws if the input was a valid JSON but not a valid Schema.
    verifyDataStructure(reconstructedSchema)
    return reconstructedSchema
  } catch (cause) {
    throw new SDKErrors.SchemaError(
      `The provided payload cannot be parsed as a Schema: ${input.toHuman()}`,
      { cause }
    )
  }
}

/**
 * The details of a Schema that are stored on chain.
 */
export interface SchemaChainDetails {
  /**
   * The Schema.
   */
  schema: ISchema
  /**
   * The Schema digest/hash.
   */
  schemaHash: SchemaHash
  /**
   * The DID of the Schema's creator.
   */
  creator: DidUri
  /**
   * The block number in which the Schema was created.
   */
  createdAt: BlockNumber
}

export type ISchemaDetails = SchemaChainDetails

/**
 * Decodes the Schema details returned by `api.query.schema.schemas()`.
 *
 * @param encoded The data from the blockchain.
 * @returns An object with on-chain Schema details.
 */

// eslint-disable-next-line jsdoc/require-jsdoc
export function fromChain(
  encodedEntry: Option<PalletSchemaSchemaEntry>,
  schemaId: ISchema['$id']
): SchemaChainDetails | null {
  if (encodedEntry.isSome) {
    const unwrapped = encodedEntry.unwrap()
    const { schema, digest, creator, createdAt } = unwrapped
    return {
      schema: schemaInputFromChain(schema, schemaId),
      schemaHash: digest.toHex() as SchemaHash,
      creator: Did.fromChain(creator),
      createdAt: createdAt,
    }
  }
  return null
}

/**
 * Resolves a Schema identifier to the Schema definition by fetching data from the block containing the transaction that registered the Schema on chain.
 *
 * @param schemaId Schema ID to use for the query. It is required to complement the information stored on the blockchain in a [[PalletSchemaSchemaEntry]].
 *
 * @returns The [[ISchemaDetails]].
 */
export async function fetchFromChain(
  schemaId: ISchema['$id']
): Promise<ISchemaDetails | null> {
  const api = ConfigService.get('api')
  let schemaEntry: any

  const cordSchemaId = Identifier.uriToIdentifier(schemaId)
  schemaEntry = await cord_api_query('schema', 'schemas', cordSchemaId)

  if (!schemaEntry) {
    schemaEntry = await api.query.schema.schemas(cordSchemaId)
  }

  const decodedSchema = fromChain(schemaEntry, schemaId)
  if (decodedSchema === null) {
    throw new SDKErrors.SchemaError(
      `There is not a Schema with the provided ID "${schemaId}" on chain.`
    )
  }

  return decodedSchema
}
