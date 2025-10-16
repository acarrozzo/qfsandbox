import { NextResponse } from 'next/server'

import { env } from '@mntn-dev/env'

export function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'QuickFrame API Documentation',
      version: '1.0.0',
      description:
        'API documentation for the QuickFrame platform - a marketplace that brings together Makers and Brands.',
    },
    servers: [
      {
        url: (() => {
          if (env.VERCEL_ENV === 'production') {
            return 'https://marketplace.quickframe.com'
          }
          if (env.VERCEL_ENV === 'preview') {
            return env.BASE_URL
          }
          return 'https://local.magicsky.dev'
        })(),
        description: (() => {
          if (env.VERCEL_ENV === 'production') {
            return 'Production'
          }
          if (env.VERCEL_ENV === 'preview') {
            return 'Preview'
          }
          return 'Development'
        })(),
      },
    ],
    paths: {
      '/api/credits': {
        get: {
          summary: 'Get credit balance',
          description:
            'Retrieve the current credit balance for a specific entity. Either entityId or QFM_ID__c must be provided.',
          tags: ['Credits'],
          parameters: [
            {
              name: 'entityId',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'uuid' },
              description:
                'The unique identifier of the finance entity (UUID format)',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            {
              name: 'QFM_ID__c',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'uuid' },
              description: 'Alternative QFM ID (UUID format)',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          ],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/GetCreditsResponse' },
                },
              },
            },
            '400': {
              description: 'Bad Request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '404': {
              description: 'Not Found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        post: {
          summary: 'Add credits',
          description:
            "Add credits to one or more entities' balances. The request body is an array; each element targets either an entityId or a QFM_ID__c.",
          tags: ['Credits'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AddCreditsRequest' },
                examples: {
                  arrayExample: {
                    summary: 'Batch add credits (JSON array)',
                    value: [
                      {
                        entityId: '123e4567-e89b-12d3-a456-426614174000',
                        amount: 500,
                        expirationDate: '2024-12-31T23:59:59.000Z',
                      },
                      {
                        QFM_ID__c: '123e4567-e89b-12d3-a456-426614174001',
                        amount: 250,
                      },
                    ],
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AddCreditsResponse' },
                  examples: {
                    arrayResult: {
                      summary: 'Per-item results',
                      value: [
                        {
                          entityId: '123e4567-e89b-12d3-a456-426614174000',
                          credits: 2000,
                        },
                        {
                          entityId: '123e4567-e89b-12d3-a456-426614174001',
                          credits: 1750,
                        },
                      ],
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad Request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '404': {
              description: 'Not Found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },

      '/api/credits/soap': {
        post: {
          summary: 'SOAP Credits API',
          description: `SOAP endpoint for credits operations. Supports GetCredits and AddCredits operations.

**Now supports arrays** for both operations via wrapped collections.

### Request Examples

#### Get Credits (multiple)
\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://marketplace.quickframe.com/credits">
  <soap:Body>
    <tns:GetCredits>
      <tns:Requests>
        <tns:Request>
          <tns:entityId>b3cb0f72-c312-4055-a2b3-3ecef6e6aa13</tns:entityId>
        </tns:Request>
        <tns:Request>
          <tns:QFM_ID__c>123e4567-e89b-12d3-a456-426614174000</tns:QFM_ID__c>
        </tns:Request>
      </tns:Requests>
    </tns:GetCredits>
  </soap:Body>
</soap:Envelope>
\`\`\`

#### Add Credits (multiple)
\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://marketplace.quickframe.com/credits">
  <soap:Body>
    <tns:AddCredits>
      <tns:Requests>
        <tns:Request>
          <tns:entityId>b3cb0f72-c312-4055-a2b3-3ecef6e6aa13</tns:entityId>
          <tns:amount>100</tns:amount>
          <tns:expirationDate>2024-12-31T23:59:59.000Z</tns:expirationDate>
        </tns:Request>
        <tns:Request>
          <tns:QFM_ID__c>123e4567-e89b-12d3-a456-426614174000</tns:QFM_ID__c>
          <tns:amount>250</tns:amount>
        </tns:Request>
      </tns:Requests>
    </tns:AddCredits>
  </soap:Body>
</soap:Envelope>
\`\`\``,
          tags: ['Credits'],
          requestBody: {
            required: true,
            content: {
              'text/xml': {
                schema: {
                  type: 'string',
                  description:
                    'SOAP XML request (supports arrays via wrapper elements)',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'text/xml': {
                  schema: { type: 'string' },
                  examples: {
                    'Get Credits Response (multiple)': {
                      summary: 'Multiple results',
                      value: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://marketplace.quickframe.com/credits">
  <soap:Body>
    <tns:GetCreditsResponse>
      <tns:Results>
        <tns:Result>
          <tns:credits>1500</tns:credits>
          <tns:entityId>b3cb0f72-c312-4055-a2b3-3ecef6e6aa13</tns:entityId>
        </tns:Result>
        <tns:Result>
          <tns:credits>900</tns:credits>
          <tns:entityId>123e4567-e89b-12d3-a456-426614174000</tns:entityId>
        </tns:Result>
      </tns:Results>
    </tns:GetCreditsResponse>
  </soap:Body>
</soap:Envelope>`,
                    },
                    'Add Credits Response (multiple)': {
                      summary: 'Multiple results',
                      value: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://marketplace.quickframe.com/credits">
  <soap:Body>
    <tns:AddCreditsResponse>
      <tns:Results>
        <tns:Result>
          <tns:credits>1600</tns:credits>
          <tns:entityId>b3cb0f72-c312-4055-a2b3-3ecef6e6aa13</tns:entityId>
        </tns:Result>
        <tns:Result>
          <tns:credits>1150</tns:credits>
          <tns:entityId>123e4567-e89b-12d3-a456-426614174000</tns:entityId>
        </tns:Result>
      </tns:Results>
    </tns:AddCreditsResponse>
  </soap:Body>
</soap:Envelope>`,
                    },
                  },
                },
              },
            },
            '500': {
              description: 'SOAP Fault',
              content: {
                'text/xml': {
                  schema: { type: 'string' },
                  examples: {
                    'Entity Not Found': {
                      summary: 'Entity Not Found Error',
                      value: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://marketplace.quickframe.com/credits">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>Entity not found</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`,
                    },
                    'Unsupported Operation': {
                      summary: 'Unsupported Operation Error',
                      value: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://marketplace.quickframe.com/credits">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>Unsupported SOAP operation</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`,
                    },
                  },
                },
              },
            },
          },
        },
      },

      '/api/credits/soap/wsdl': {
        get: {
          summary: 'Credits SOAP WSDL',
          description:
            'Get the WSDL (Web Services Description Language) document for the Credits SOAP API.',
          tags: ['Credits'],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/xml': {
                  schema: { type: 'string', description: 'WSDL document' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        GetCreditsResponse: {
          type: 'object',
          properties: {
            entityId: {
              type: 'string',
              format: 'uuid',
              description:
                'The unique identifier of the finance entity (UUID format)',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            credits: {
              type: 'number',
              description: 'The current credit balance',
              example: 1500,
            },
          },
          required: ['entityId', 'credits'],
        },

        AddCreditsRequestItem: {
          oneOf: [
            {
              type: 'object',
              properties: {
                entityId: {
                  type: 'string',
                  format: 'uuid',
                  description:
                    'The unique identifier of the finance entity (UUID format)',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
                amount: {
                  type: 'number',
                  description: 'The amount of credits to add.',
                  example: 500,
                },
                expirationDate: {
                  type: 'string',
                  format: 'date-time',
                  description:
                    'Optional expiration date for the credits (ISO 8601 format)',
                  example: '2024-12-31T23:59:59.000Z',
                },
              },
              required: ['entityId', 'amount'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                QFM_ID__c: {
                  type: 'string',
                  format: 'uuid',
                  description:
                    'The unique identifier of the QFM entity (UUID format)',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
                amount: {
                  type: 'number',
                  description: 'The amount of credits to add.',
                  example: 500,
                },
                expirationDate: {
                  type: 'string',
                  format: 'date-time',
                  description:
                    'Optional expiration date for the credits (ISO 8601 format)',
                  example: '2024-12-31T23:59:59.000Z',
                },
              },
              required: ['QFM_ID__c', 'amount'],
              additionalProperties: false,
            },
          ],
          description:
            'Exactly one of entityId or QFM_ID__c is required, along with amount.',
        },

        // NEW: array request schema
        AddCreditsRequest: {
          type: 'array',
          items: { $ref: '#/components/schemas/AddCreditsRequestItem' },
          minItems: 1,
          description:
            'Array of credit additions. Each item targets one entity (by entityId or QFM_ID__c).',
        },

        // Single item response (your original shape)
        AddCreditsResponseItem: {
          type: 'object',
          properties: {
            entityId: {
              type: 'string',
              format: 'uuid',
              description:
                'The unique identifier of the finance entity (UUID format)',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            credits: {
              type: 'number',
              description: 'The updated credit balance after adding credits',
              example: 2000,
            },
          },
          required: ['entityId', 'credits'],
        },

        AddCreditsResponse: {
          type: 'array',
          items: { $ref: '#/components/schemas/AddCreditsResponseItem' },
          description:
            'Per-item results for each credit addition request in the same order as submitted.',
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error description',
              example: 'Invalid entityId format. Expected a valid UUID.',
            },
          },
          required: ['message'],
        },
      },
    },
  }

  return NextResponse.json(openApiSpec)
}
