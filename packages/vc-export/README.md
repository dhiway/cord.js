Data sovereignty and interoperability

# Verifiable Credentials Compatibility Package

This package helps you to translate CORD credentials to the popular [Verifiable Credential](https://www.w3.org/TR/vc-data-model/) format and structure.
It provides you with tools to export your existing CORD credentials to the widely understood Verifiable Credential, produce Verifiable Presentations from a Verifiable Credential, and to verify the associated proofs.

## Contents

- exporting
  - `fromMarkedStream()`: translates `MarkedStream` to `VerifiableCredential`
- presentation utils
  - `makePresentation()`: creates `VerifiablePresentation` ()
  - `removeProperties()`: derives a new `VerifiableCredential` from an existing one with a reduced set of disclosed attributes
- verification utils
  - functions that verify three proof types:
    - holder's self-signed proof over the credential digest
    - credential digest proof that assures the integrity of disclosed attributes, holder identity, evidenceIds and delegations
    - credential proof that assures the credential is attested by the identity disclosed as the `issuer` and not revoked
  - a function to validate the disclosed stream properties against the schema of a CORD MType, which is a prescriptive schema detailing fields and their data types.
- vc-js suites: tooling to integrate CORD VCs with `vc-js` and `jsonld-signatures^5.0.0`
  - `suites`: contains suites to verify the three CORD proof types that secure a CORD VC.
    - `CordIntegritySuite`: provides integrity protection for essential components of the credential while allowing for blinding of streams relating to the `credentialSubject`.
    - `CordSignatureSuite`: verifies the signature over the root hash of a CORD credential.
    - `CordAttestedSuite`: provides lookup functionality to the CORD blockchain to check whether a credential is attested and still valid.
  - `context`: contains a json-ld `@context` definitions for CORD VCs.
  - `documentLoader`: an implementation of the DocumentLoader required to use `vc-js` / `jsonld-signatures` which allows to serve essential `@context` definitions to the json-ld processor, including the `context` included here.

## Examples

### Presenting a CORD `MarkedStream` as a `VerifiableCredential`

Given we are in possession of an attested CORD stream and the associated CORD identity:

```typescript
import Cord from '@cordnetwork/sdk'
import type { MarkedStream, Identity } from '@cordnetwork/sdk'
import VCUtils from '@cordnetwork/vc-export'

let credential: MarkedStream
let identity: Identity

// turn the CORD credential into a VerifiableCredential
const VC = VCUtils.fromMarkedStream(credential)

// produce a reduced copy of the VC where only selected attributes are disclosed
const nameOnly = VCUtils.presentation.removeProperties(VC, ['name'])
// or directly produce a VerifiablePresentation, which implicitly performs the step above
const presentation = VCUtils.presentation.makePresentation(VC, ['name'])
```

A verifier can now check the proofs attached to the VerifiableCredential but can only see the disclosed attributes:

```typescript
// Here's an example for verifying the credential proof
let result
presentation.verifiableCredential.proof.foreach((proof) => {
  if (proof.type === VCUtils.types.CORD_ANCHORED_PROOF_TYPE)
    VCUtils.verification.verifyStreamProof(proof)
})

if (result && result.verified) {
  console.log(
    `Name of the crook: ${presentation.verifiableCredential.credentialSubject.name}`
  ) // prints 'Billy The Kid'
  console.log(
    `Reward: ${presentation.verifiableCredential.credentialSubject.reward}`
  ) // undefined
}
```

### Verifying a CORD VC with `vc-js`

Assuming we have a CORD credential expressed as a VC (`credential`), for example as produced by the example above.

```typescript
import cord from '@cordnetwork/sdk'
import { vcjsSuites } from '@cordnetwork/vc-export'
import vcjs from 'vc-js'
import jsigs from 'jsonld-signatures'

// 1. set up suites
const { CordIntegritySuite, CordSignatureSuite, CordAttestedSuite } =
  vcjsSuites.suites
const signatureSuite = new CordSignatureSuite()
const integritySuite = new CordIntegritySuite()
// the CordAttestedSuite requires a connection object that allows access to the CORD blockchain, which we can obtain via the CORD sdk
await cord.init({ address: 'wss://full-nodes.cord.network:443' })
const CordConnection = await cord.connect()
const attestedSuite = new CordAttestedSuite({ CordConnection })

// 2. obtain default cord context loader
const { documentLoader } = vcjsSuites

// 3. obtain the `assertionMethod` proof purpose from `jsonld-signatures`
const purpose = new jsigs.purposes.AssertionProofPurpose()

// 4. call vc-js.verifyCredential with suites and context loader
const result = await vcjs.verifyCredential({
  credential,
  suite: [signatureSuite, integritySuite, attestedSuite],
  purpose,
  documentLoader,
})

// 5. make sure all `results` indicate successful verification
const verified = result.results.every((i) => i.verified === true)
```
