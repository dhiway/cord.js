/**
 * @packageDocumentation
 * @module TypeSchema
 */

export const SchemaModel = {
  $id: 'http://dway.io/draft-01/schema#',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
      $id: {
	  type: 'string',
      },
      $schema: {
	  type: 'string',
	  format: 'uri',
	  const: 'http://json-schema.org/draft-07/schema#'
      },
      name: {
	  type: 'string'
      },
      type: {
	  type: 'string',
	  const: 'object'
      },
      properties: {
	  type: 'object',
	  patternProperties: {
              '^.*$': {
		  type: 'object',
		  properties: {
		      type: {
			  type: 'string',
			  enum: ['string', 'integer', 'number', 'boolean', "object", "array"]
		      },
		      $ref: {
			  type: 'string',
			  format: 'uri'
		      },
		      format: {
			  type: 'string',
			  enum: ['date', 'time', 'uri', 'email', 'date-time']
		      },
		      items: {
			  type: 'object',
			  properties: {
			      type: {
				  type: 'string',
				  enum: ['string', 'integer', 'number', 'boolean', "object", "array"]
			      },
			      $ref: {
				  type: 'string',
				  format: 'uri'
			      },
			      format: {
				  type: 'string',
				  enum: ['date', 'time', 'uri', 'email', 'date-time']
			      }
			  }
		      },
		      additionalProperties: false,
		  },
	      },
	  },
      },
  },
    additionalProperties: false,
    required: ['$id', 'name', '$schema', 'properties', 'type'],
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
    creator: { type: ['string', 'null'] },
    id: { type: 'string', format: 'uri', pattern: '^cord:schema:0x[0-9a-f]+$' },
    hash: {
      type: 'string',
    },
    permissioned: { type: 'boolean' },
    revoked: { type: 'boolean' },
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
        name: {
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
                name: {
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
              required: ['name'],
              additionalProperties: false,
            },
          },
        },
      },
      required: ['name', 'properties'],
      additionalProperties: false,
    },
    id: { type: 'string', minLength: 1 },
    hash: { type: 'string', minLength: 1 },
    permissioned: { type: 'boolean' },
    revoked: { type: 'boolean' },
  },
  required: ['metadata', 'id', 'hash'],
  additionalProperties: false,
}
