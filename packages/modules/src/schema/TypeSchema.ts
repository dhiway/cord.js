/**
 * @packageDocumentation
 * @module TypeSchema
 */

import { JsonSchema } from '@cord.network/utils'

export const SchemaModel: JsonSchema.Schema = {
  $id: 'http://dway.io/draft-01/schema#',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    $id: {
      type: 'string',
      format: 'uri',
      // pattern: '^schema:cord:0x[0-9a-f]+$',
    },
    $schema: {
      type: 'string',
      format: 'uri',
      const: 'http://json-schema.org/draft-07/schema#',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    $metadata: {
      version: { type: ['string', 'null'] },
      discoverable: { type: 'boolean' },
    },
    type: {
      type: 'string',
      const: 'object',
    },
    properties: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['string', 'integer', 'number', 'boolean'],
            },
            $ref: {
              type: 'string',
              format: 'uri',
            },
            format: {
              type: 'string',
              enum: ['date', 'time', 'uri'],
            },
          },
          additionalProperties: false,
          oneOf: [
            {
              required: ['type'],
            },
            {
              required: ['$ref'],
            },
          ],
        },
      },
    },
  },
  additionalProperties: false,
  required: ['$id', 'title', '$schema', 'properties', 'type'],
}

export const SchemaWrapperModel = {
  $id: 'http://dway.io/draft-01/schema-wrapper#',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    schema: {
      type: 'object',
      properties: SchemaModel.properties,
      required: SchemaModel.required,
    },
    id: {
      type: 'string',
      format: 'uri',
      // pattern: '^schema:cord:0x[0-9a-f]+$',
    },
    hash: {
      type: 'string',
    },
    controller: { type: ['string', 'null'] },
    version: {
      type: 'string',
    },
    permissioned: { type: 'boolean' },
  },
  additionalProperties: false,
  required: ['schema', 'id', 'hash'],
}

export const MetadataModel = {
  $id: 'http://dway.io/draft-01/schema-metadata',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    metadata: {
      type: 'object',
      properties: {
        title: {
          type: 'object',
          properties: {
            default: {
              type: 'string',
            },
          },
          patternProperties: {
            '^.*$': {
              type: 'string',
            },
          },
          required: ['default'],
        },
        description: {
          type: 'object',
          properties: {
            default: {
              type: 'string',
            },
          },
          patternProperties: {
            '^.*$': {
              type: 'string',
            },
          },
          required: ['default'],
        },
        properties: {
          type: 'object',
          properties: {},
          patternProperties: {
            '^.*$': {
              type: 'object',
              properties: {
                title: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'string',
                    },
                  },
                  patternProperties: {
                    '^.*$': {
                      type: 'string',
                    },
                  },
                  required: ['default'],
                },
                description: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'string',
                    },
                  },
                  patternProperties: {
                    '^.*$': {
                      type: 'string',
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['title'],
              additionalProperties: false,
            },
          },
        },
      },
      required: ['title', 'properties'],
      additionalProperties: false,
    },
    id: { type: 'string', minLength: 1 },
    hash: { type: 'string', minLength: 1 },
    version: { type: 'string', minLength: 1 },
    permissioned: { type: 'boolean' },
  },
  required: ['metadata', 'id', 'hash'],
  additionalProperties: false,
}
