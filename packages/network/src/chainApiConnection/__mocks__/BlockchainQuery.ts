import { Option, U8aFixed, U64, Vec, U8 } from '@polkadot/types'
import type { Codec } from '@polkadot/types/types'
import type { Constructor } from '@polkadot/util/types'
import { TYPE_REGISTRY } from '../TypeRegistry'

const chainProperties = TYPE_REGISTRY.createType('ChainProperties', {
  ss58Format: 29,
})
TYPE_REGISTRY.setChainProperties(chainProperties)

const AccountId = TYPE_REGISTRY.getOrThrow('AccountId')

type ChainQueryTypes = {
  mark: 'marks' | 'delegatedMarks'
  schema: 'Schemas'
  delegation: 'root' | 'delegations' | 'children'
  did: 'dIDs'
  // portablegabi: 'accumulatorList' | 'accumulatorCount' | 'accountState'
}

/**
 * Legend:
 * - ? === Option
 * - (...) === Tuple
 * - [...] === Vec
 */
const chainQueryReturnTuples: {
  [K in keyof ChainQueryTypes]: {
    [T in ChainQueryTypes[K]]: Constructor
  }
} = {
  schema: {
    // MTYPEs: mtype-hash -> account-id?
    Schemas: AccountId,
  },
  delegation: {
    // Root-Delegation: root-id -> (mtype-hash, account, revoked)
    root: TYPE_REGISTRY.getOrUnknown('DelegationRoot'),
    // Delegations: delegation-id -> (root-id, parent-id?, account, permissions, revoked)?
    delegations: TYPE_REGISTRY.getOrUnknown('DelegationNode'),
    // Children: root-or-delegation-id -> [delegation-id]
    children: TYPE_REGISTRY.getOrUnknown('DelegationNodeIdOf'),
  },
  mark: {
    // Marks: stream-hash -> (mtype-hash, issuer-account, delegation-id?, revoked)?
    marks: TYPE_REGISTRY.getOrUnknown('MarkDetails'),
    // DelegatedMarks: delegation-id -> [stream-hash]
    delegatedMarks: TYPE_REGISTRY.getOrUnknown('Hash'),
  },
  did: {
    // DID: account-id -> (public-signing-key, public-encryption-key, did-reference?)?
    dIDs: TYPE_REGISTRY.getOrUnknown('DidDetails'),
  },
  // portablegabi: {
  //   // AccumulatorList: account-id -> [accumulators]?
  //   accumulatorList: ('Vec<u8>' as unknown) as Constructor,
  //   // AccumulatorCount: account-id -> counter
  //   accumulatorCount: U64,
  //   // AccountState: account-id -> state
  //   accountState: U64,
  // },
}

/**
 * This function should be used to mock values of chain queries.
 * It sets the correct encoding types and mocks the chain query return value.
 *
 * @param outerQuery The name of the module which you want to query.
 * @param innerQuery The name of the storage item of the module which you want to query.
 * @param mockValue The value which the mock should return.
 * @returns The mockvalue wrapped into either a vector or an option.
 */
export function mockChainQueryReturn<T extends keyof ChainQueryTypes>(
  outerQuery: T,
  innerQuery: ChainQueryTypes[T],
  mockValue?:
    | Constructor
    | U64
    | string
    | Array<
        | Constructor
        | number
        | string
        | undefined
        | U8
        | boolean
        | null
        | U8aFixed
        | any
      >
): Option<Codec> | Vec<Codec> {
  const chainQueryReturnTuple =
    chainQueryReturnTuples[outerQuery as string][innerQuery]

  // helper function to wrap values into a vector
  function wrapInVec() {
    return new Vec(
      TYPE_REGISTRY,
      chainQueryReturnTuple,
      mockValue as Constructor[]
    )
  }
  // helper function to wrap values into an option
  function wrapInOption() {
    return new Option(TYPE_REGISTRY, chainQueryReturnTuple, mockValue)
  }
  // check cases
  switch (outerQuery) {
    case 'mark': {
      if (innerQuery === 'delegatedMarks') {
        return wrapInVec()
      }
      return wrapInOption()
    }
    case 'schema': {
      return wrapInOption()
    }
    case 'delegation': {
      if (innerQuery === 'children') return wrapInVec()
      return wrapInOption()
    }
    case 'did': {
      return wrapInOption()
    }
    // case 'portablegabi': {
    //   if (innerQuery === 'accumulatorList') return wrapInOption()
    //   return chainQueryReturnTuple
    // }
    default:
      // should never occur
      throw new Error(
        `Missing module ${outerQuery}. 
        The following ones exist: mark, schema, delegation, did.`
      )
  }
}
