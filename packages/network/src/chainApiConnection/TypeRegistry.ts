import { types05 as CORD_TYPES } from '@cord.network/type-definitions'
import { TypeRegistry } from '@polkadot/types'

const TYPE_REGISTRY = new TypeRegistry()
TYPE_REGISTRY.register(CORD_TYPES)

export { CORD_TYPES, TYPE_REGISTRY }
