export default {
  openapi: '3.0.3',
  info: {
    title: 'Quasar API',
    version: '1.0.0',
    description:
      'This is a sample API documentation for the Vaults API.  This API provides methods for performing GET actions on the products of our app [Quasar](https://app.quasar.fi/).\n\nYou can find out more about QuasarFI [here](https://quasar.fi/).\n\nSome useful links:\n- [Telegram contact](https://t.me/quasarfi)\n- [Discord contact](https://discord.com/invite/quasarfi)'
  },
  servers: [
    {
      url: 'https://api.quasar.fi'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health endpoint'
    },
    {
      name: 'Vaults',
      description: 'Everything about our vaults'
    },
    {
      name: 'Quasar',
      description: 'Usefull endpoints for Quasar app'
    },
    {
      name: 'User',
      description: 'Operations about user'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check that the service is working',
        description: 'Check that the service is working',
        operationId: 'health',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  items: {
                    $ref: '#/components/schemas/health'
                  },
                  example: {
                    name: 'quasar-api',
                    version: '1.0.0'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/vaults': {
      get: {
        tags: ['Vaults'],
        summary: 'Get all vaults info',
        description: 'Get all vaults info',
        operationId: 'vaults',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    },
    '/vaults/{slug}/info': {
      get: {
        tags: ['Vaults'],
        summary: 'Get Vault info by slug',
        description: 'Get Vault info by slug',
        operationId: 'quasarVaultsSlugInfo',
        responses: {
          '200': {
            description: 'successful operation'
          }
        }
      },
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'stdydx-dydx-dynamic-s'
          }
        }
      ]
    },
    '/vaults/by_pool/{poolID}': {
      get: {
        tags: ['Vaults'],
        summary: 'Get Vault info by Osmosis Pool ID',
        description: 'Get Vault info by Osmosis Pool ID',
        operationId: 'vaultsByPoolPoolid',
        responses: {
          '200': {
            description: 'successful operation'
          }
        }
      },
      parameters: [
        {
          name: 'poolID',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 1423
          }
        }
      ]
    },
    '/vaults/total_tvl': {
      get: {
        tags: ['Vaults'],
        summary: 'Gets the sum of the TVL of all Quasar vaults.',
        description: 'Gets the sum of the TVL of all Quasar vaults.',
        operationId: 'vaultsTotalTvl',
        responses: {
          '200': {
            description: ''
          }
        }
      }
    },
    '/vaults/{vaultAddress}/balances/{userAddress}': {
      get: {
        tags: ['User'],
        summary: 'Get user balance from a specified vault',
        description: 'Get user balance from a specified vault',
        operationId: 'quasarVaultsVaultaddressBalancesUseraddressNow',
        responses: {
          '200': {
            description: 'successful operation'
          }
        }
      },
      parameters: [
        {
          name: 'vaultAddress',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'osmo1zvyemtz9tuyhucq6vqfk556zzz62pznya6pch2ndqxtq7amlxkdq3zkl54'
          }
        },
        {
          name: 'userAddress',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'osmo16nsxukkff43y703xzj4p7mcg9z7enuher6h4t4'
          }
        }
      ]
    },
    '/vaults/by_user/{userAddress}': {
      get: {
        tags: ['User'],
        summary: 'Get all vaults where user have balance or rewards',
        description: 'Get all vaults where user have balance or rewards',
        operationId: 'quasarVaultsByUser',
        responses: {
          '200': {
            description: 'successful operation'
          }
        }
      },
      parameters: [
        {
          name: 'userAddress',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'osmo16nsxukkff43y703xzj4p7mcg9z7enuher6h4t4'
          }
        }
      ]
    },
    '/quasar/token_price': {
      get: {
        tags: ['Quasar'],
        summary: 'Get Quasar token price',
        description: 'Get Quasar token price',
        operationId: 'quasarTokenPrice',
        responses: {
          '200': {
            description: ''
          }
        }
      }
    }
  },
  components: {
    schemas: {
      health: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'quasar-api'
          },
          version: {
            type: 'string',
            example: '1.0.0'
          }
        }
      }
    },
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic'
      }
    }
  },
  security: [
    {
      basicAuth: []
    }
  ]
};
