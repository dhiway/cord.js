/**
 * @packageDocumentation.
 * @module Schema/Types
 * Schema Definitions Module.
 *
 * This module contains a collection of constants that define various JSON schemas used within the SDK.
 * These schemas are fundamental in enforcing the structure and validation of data throughout the application.
 * Each constant represents a specific schema with a defined structure, catering to different aspects of the
 * system's needs.
 *
 * Included Constants:
 * - `SchemaModelV1`: This is the first version of the core schema model. It defines the structure for validating
 *   stream types and includes a comprehensive set of properties and validation rules specific to the application's
 *   requirements.
 *
 * - `SchemaModel`: Extends the `SchemaModelV1` and includes additional validation rules and structures. It is
 *   designed to ensure that schemas are not only compliant with `SchemaModelV1` but also include additional
 *   specifications required by the broader application context.
 *
 * - `MetadataModel`: Defines the schema for handling metadata associated with other schemas. It provides a
 *   structured format for capturing metadata details such as titles, descriptions, and custom properties,
 *   ensuring consistency and integrity of metadata across various schemas.
 *
 * These constants are marked as `@internal` and are intended for use within the SDK. They are not part of
 * the public API and are critical for the internal mechanisms of schema management and validation. The module
 * provides a centralized and standardized approach to handling schema definitions, streamlining the process
 * of schema usage and enforcement across the application.
 *
 * Usage of these constants should be limited to internal SDK functions and modules, as they are key to maintaining
 * the integrity and consistency of data structures within the application.
 */

import { JsonSchema } from '@cord.network/utils'

/**
 * (Internal Constant) SchemaModelV1 - Defines the JSON schema for CORD Metaschema.
 * This schema is used internally for validating stream types and includes various
 * properties and definitions. It specifies the structure of schema objects, including
 * their types, properties, and other validation rules. This constant combines the standard
 * JSON Schema structure with specific constraints and patterns relevant to CORD Metaschema.
 * It is not part of the public API and is intended for internal use within the SDK.
 *
 * The schema includes definitions for different data types like string, number, boolean,
 * array, object, and schema references. It enforces strict patterns and types for
 * schema properties, ensuring the integrity and consistency of the data.
 *
 * @internal
 * @type {JsonSchema.Schema & { $id: string }}
 */
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
    $metadata: {
      type: 'object',
      properties: {
        version: {
          type: 'string',
        },
        slug: {
          type: 'string',
        },
        discoverable: {
          type: 'boolean',
        },
      },
    },
    title: { type: 'string' },
    description: {
      type: 'string',
    },
    type: { const: 'object', type: 'string' },
    properties: {
      patternProperties: {
        '^.+$': {
          oneOf: [
            { $ref: '#/definitions/string' },
            { $ref: '#/definitions/number' },
            { $ref: '#/definitions/boolean' },
            { $ref: '#/definitions/schemaReference' },
            { $ref: '#/definitions/array' },
            { $ref: '#/definitions/object' },
          ],
        },
      },
      type: 'object',
    },
    additionalProperties: { const: false, type: 'boolean' },
    required: { type: 'array', items: { type: 'string' } },
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
  definitions: {
    schemaReference: {
      additionalProperties: false,
      properties: {
        $ref: {
          pattern: '^schema:cord:m[0-9a-zA-Z]+(#/properties/.+)?$',
          format: 'uri',
          type: 'string',
        },
      },
      required: ['$ref'],
    },
    string: {
      additionalProperties: false,
      properties: {
        type: {
          const: 'string',
        },
        format: { enum: ['date', 'time', 'uri'] },
        enum: {
          type: 'array',
          items: { type: 'string' },
        },
        minLength: {
          type: 'number',
        },
        maxLength: {
          type: 'number',
        },
      },
      required: ['type'],
    },
    boolean: {
      additionalProperties: false,
      properties: {
        type: {
          const: 'boolean',
        },
      },
      required: ['type'],
    },
    number: {
      additionalProperties: false,
      properties: {
        type: {
          enum: ['integer', 'number'],
        },
        enum: {
          type: 'array',
          items: { type: 'number' },
        },
        minimum: {
          type: 'number',
        },
        maximum: {
          type: 'number',
        },
      },
      required: ['type'],
    },
    array: {
      additionalProperties: false,
      properties: {
        type: { const: 'array' },
        items: {
          oneOf: [
            { $ref: '#/definitions/string' },
            { $ref: '#/definitions/number' },
            { $ref: '#/definitions/boolean' },
            { $ref: '#/definitions/schemaReference' },
          ],
        },
        minItems: {
          type: 'number',
        },
        maxItems: {
          type: 'number',
        },
      },
      required: ['type', 'items'],
    },
    object: {
      additionalProperties: false,
      properties: {
        type: { const: 'object' },
        properties: {
          type: 'object',
          patternProperties: {
            '^.+$': {
              oneOf: [
                { $ref: '#/definitions/string' },
                { $ref: '#/definitions/number' },
                { $ref: '#/definitions/boolean' },
                { $ref: '#/definitions/schemaReference' },
                { $ref: '#/definitions/array' },
                { $ref: '#/definitions/object' },
              ],
            },
          },
        },
        patternProperties: {
          '^.+$': {
            oneOf: [
              { $ref: '#/definitions/string' },
              { $ref: '#/definitions/number' },
              { $ref: '#/definitions/boolean' },
              { $ref: '#/definitions/schemaReference' },
              { $ref: '#/definitions/array' },
              { $ref: '#/definitions/object' },
            ],
          },
        },
      },
      required: ['type'],
    },
  },
}

/**
 * (Internal Constant) SchemaModel - Represents the JSON schema model for the SDK.
 * This constant is an extension of the standard JSON Schema, specifically tailored to
 * integrate with the SchemaModelV1. It is used internally to validate and manage schema
 * definitions within the system. Notably, it employs a combination of `allOf` and `$ref`
 * to ensure compliance with the SchemaModelV1, and it defines additional structures as
 * needed for the broader schema management context.
 *
 * The `allOf` property is used to combine multiple schema definitions, ensuring that
 * any schema validated against SchemaModel must also be valid according to the SchemaModelV1.
 * The `$ref` property references the SchemaModelV1 to maintain consistency and integrity
 * across schema definitions.
 *
 * This configuration is integral to maintaining a consistent and valid schema structure
 * across the SDK but is not intended for external use.
 *
 * @internal
 * @type {JsonSchema.Schema}
 */
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

/**
 * (Internal Constant) MetadataModel - Defines the JSON schema for metadata associated with other schemas in the SDK.
 * This model is specifically structured to capture metadata information such as titles, descriptions, and
 * properties of schemas. It is utilized internally for managing and validating metadata in a consistent and
 * structured format. The schema enforces a specific structure for metadata, ensuring all necessary fields are
 * present and correctly formatted.
 *
 * The `properties` object within the `metadata` property provides a flexible yet structured approach to defining
 * metadata. It allows for default values and pattern-based properties, ensuring broad applicability while maintaining
 * strict validation rules. This model is crucial for ensuring the integrity and usability of metadata across different
 * schemas in the system.
 *
 * This schema is an essential part of the internal mechanism of the SDK for handling schema metadata but is not
 * intended for external use. It plays a key role in maintaining the consistency and standardization of schema
 * metadata across the platform.
 *
 * @internal
 * @type {JsonSchema.Schema}
 */
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
