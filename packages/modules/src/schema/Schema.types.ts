import { JsonSchema } from '@cord.network/utils'

export const SchemaModelV1: JsonSchema.Schema & { $id: string } = {
  $id: 'http://cord.network/draft-01/schema#',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'CORD Metaschema',
  description: 'Describes a JSON schema for validating  stream types.',
  type: 'object',
  properties: {
    $id: {
      pattern: '^schema:cord:s[0-9a-zA-Z]+$',
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
                  pattern: '^schema:cord:s[0-9a-zA-Z]+(#/properties/.+)?$',
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

// export const SchemaModelV1: JsonSchema.Schema & { $id: string } = {
//   $id: 'http://cord.network/draft-01/schema#',
//   $schema: 'http://json-schema.org/draft-07/schema#',
//   title: 'CType Metaschema (draft-01)',
//   description: `Describes a Schema, which is a JSON schema for validating stream types. This version has known issues, the use of schema ${SchemaModelV2.$id} is recommended instead.`,
//   type: 'object',
//   properties: {
//     $id: {
//       type: 'string',
//       format: 'uri',
//       pattern: '^schema:cord:5[0-9a-zA-Z]+$',
//     },
//     $schema: {
//       type: 'string',
//       format: 'uri',
//       const: 'http://json-schema.org/draft-07/schema#',
//     },
//     title: {
//       type: 'string',
//     },
//     description: {
//       type: 'string',
//     },
//     type: {
//       type: 'string',
//       const: 'object',
//     },
//     properties: {
//       type: 'object',
//       patternProperties: {
//         '^.*$': {
//           type: 'object',
//           properties: {
//             type: {
//               type: 'string',
//               enum: ['string', 'integer', 'number', 'boolean'],
//             },
//             $ref: {
//               type: 'string',
//               format: 'uri',
//             },
//             format: {
//               type: 'string',
//               enum: ['date', 'time', 'uri'],
//             },
//           },
//           additionalProperties: false,
//           oneOf: [
//             {
//               required: ['type'],
//             },
//             {
//               required: ['$ref'],
//             },
//           ],
//         },
//       },
//     },
//   },
//   additionalProperties: false,
//   required: ['$id', 'title', '$schema', 'properties', 'type'],
// }

export const SchemaModel: JsonSchema.Schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  // oneOf: [
  //   // Option A): conforms to draft-01 of the CType meta sschema, which defines that the CType's $schema property must be equal to the CType meta schema's $id.
  //   { $ref: SchemaModelV1.$id },
  //   {
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
  //   },
  // ],
  definitions: {
    [SchemaModelV1.$id]: SchemaModelV1,
    // [SchemaModelV2.$id]: SchemaModelV2,
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
