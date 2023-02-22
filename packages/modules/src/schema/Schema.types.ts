import { JsonSchema } from '@cord.network/utils'

export const SchemaModelV1: JsonSchema.Schema & { $id: string } = {
  $id: 'http://cord.network/draft-01/schema#',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'CORD Metaschema (V1)',
  description: 'Describes a JSON schema for validating CORD stream types.',
  type: 'object',
  properties: {
    $id: {
      pattern: '^schema:cord:5[0-9a-zA-Z]+$',
      type: 'string',
    },
    $schema: {
      type: 'string',
    },
    title: { type: 'string' },
    type: { const: 'object', type: 'string' },
    properties: {
      patternProperties: {
        '^.+$': {
          oneOf: [
            {
              additionalProperties: false,
              properties: {
                $ref: {
                  pattern: '^schema:cord:5[0-9a-zA-Z]+(#/properties/.+)?$',
                  format: 'uri',
                  type: 'string',
                },
              },
              required: ['$ref'],
            },
            {
              additionalProperties: false,
              properties: {
                format: { enum: ['date', 'time', 'uri'], type: 'string' },
                type: {
                  enum: ['boolean', 'integer', 'number', 'string'],
                  type: 'string',
                },
              },
              required: ['type'],
            },
          ],
          type: 'object',
        },
      },
      type: 'object',
    },
    additionalProperties: { const: false, type: 'boolean' },
  },
  additionalProperties: false,
  required: [
    '$id',
    '$schema',
    'additionalProperties',
    'properties',
    'title',
    'type',
  ],
}

export const SchemaModel: JsonSchema.Schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  allOf: [
    {
      properties: {
        $schema: {
          type: 'string',
          const: SchemaModelV1.$id,
        },
      },
    },
    {
      $ref: SchemaModelV1.$id,
    },
  ],
  definitions: {
    [SchemaModelV1.$id]: SchemaModelV1,
  },
}

export const MetadataModel: JsonSchema.Schema = {
  $id: 'http://cord.network/draft-01/schema-metadata',
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
    schemaId: { type: 'string', minLength: 1 },
  },
  required: ['metadata', 'schemaId'],
  additionalProperties: false,
}
