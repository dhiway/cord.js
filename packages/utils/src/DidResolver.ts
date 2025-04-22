/* eslint-disable import/prefer-default-export */
/**
 * @packageDocumentation
 * @module DidResolver
 */

/**
 * DID Resolver for CORD Profiles
 */
import { ApiPromise } from '@polkadot/api';
import { decodeAddress, base58Encode } from '@polkadot/util-crypto';
import { Option } from '@polkadot/types';
import { PalletProfileProfileMetadata } from '@cord.network/augment-api';
import { base58btc } from 'multiformats/bases/base58';
import { encodeAddress } from '@polkadot/util-crypto';

interface ResolveDidResponse {
  doc: string;
}

interface ProfileMetadata {
  latestKey?: string;
}


// Utility function to extract DID identifier and optional latestKey
export function extractIdentifier(did: string): { profileId: string | null; latestKey: string | null } {
  const parts = did.split(':');
  if (parts.length < 3 || parts[1] !== 'cord') {
    return { profileId: null, latestKey: null };
  }

  const identifierParts = parts.slice(2).join(':').split(':');
  const profileId = identifierParts[0];
  const latestKey = identifierParts.length > 1 ? identifierParts[1] : null;

  return { profileId, latestKey };
}


// Utility function to convert SS58 address to public key bytes
export function ss58AddressToPublicKeyBytes(accountId: string): Buffer | null {
  try {
    const publicKey = decodeAddress(accountId);
    return Buffer.from(publicKey);
  } catch {
    return null;
  }
}


// Utility function to determine key type
export function getKeyType(accountId: string): string {
  return 'Ed25519VerificationKey2020';
}


// Define query function using provided api
export async function queryProfiles(profileId: string, api: ApiPromise): Promise<ProfileMetadata | null> {
  const profileData = (await api.query.profile.profiles(profileId)) as Option<PalletProfileProfileMetadata>;
  if (profileData.isNone) {
      console.error(`No profile found for profileId: ${profileId}`);
      return null;
  }

  const metadata = profileData.unwrap();
  return {
      latestKey: metadata.latestKey?.toHuman() || '',
  };
}


// Main function to resolve DID document
export async function resolveDidDoc(did: string, api: ApiPromise): Promise<ResolveDidResponse> {
  if (!did) {
    throw new Error('Missing DID field');
  }

  const { profileId, latestKey: _providedLatestKey } = extractIdentifier(did);
  if (!profileId) {
    throw new Error('Invalid DID format');
  }

  let profileMetadata: ProfileMetadata | null;
  try {
    profileMetadata = await queryProfiles(profileId, api);
  } catch (err) {
    console.error('Error querying Profile Service:', err);
    throw new Error('Failed to fetch profile data');
  }

  if (!profileMetadata || !profileMetadata.latestKey) {
    throw new Error('Profile not found');
  }

  /* Disbale check of key for now, once we have historical keys support in indexer we can have this */
  // if (providedLatestKey && providedLatestKey !== profileMetadata.latestKey) {
  //   throw new Error('Provided latestKey does not match profile metadata');
  // }

  const { latestKey } = profileMetadata;
  const publicKeyBytes = ss58AddressToPublicKeyBytes(latestKey);
  if (!publicKeyBytes) {
    throw new Error('Invalid SS58 address');
  }

  const didDocId = did;
  const controller = `did:cord:${profileId}:${latestKey}`; 
  const publicKeyId = `did:cord:${profileId}#${latestKey}`; 

  const multicodecPrefix = Buffer.from([0xed]);
  const prefixedKey = Buffer.concat([multicodecPrefix, publicKeyBytes]);
  const publicKeyMultibase = `z${base58Encode(prefixedKey)}`;

  const verificationType = getKeyType(latestKey);

  const didDocument: any = {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: didDocId,
    verificationMethod: [
      {
        id: publicKeyId,
        type: verificationType,
        controller: controller,
        publicKeyMultibase: publicKeyMultibase,
      },
    ],
    authentication: [publicKeyId],
    assertionMethod: [publicKeyId],
  };

  const didDocumentString = JSON.stringify(didDocument, null, 2);

  return { doc: didDocumentString };
}


/**
 * Verifies that the given multibase public key matches the provided SS58 address.
 * Returns the raw public key if it matches, or null if invalid.
 */
export async function verifyMultibaseKey(multibaseKey: string, accountAddress: string): Promise<Boolean> {
  try {
    const decoded = base58btc.decode(multibaseKey);

    if (decoded[0] !== 0xed) {
      console.warn('Not an Ed25519 multicodec key');
    }

    const rawPublicKey = decoded.slice(1);

    const derivedAddress = encodeAddress(rawPublicKey, 29); 
    if (derivedAddress !== accountAddress.toString()) {
      console.warn('Public key does not match the account address');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error decoding multibase key:', error);
    return false;
  }
}
