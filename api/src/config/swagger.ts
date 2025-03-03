export default {
  openapi: '3.0.3',
  info: {
    title: 'Tower API',
    version: '1.0.0',
    description:
      'This is a the API documentation for the Tower API.  This API provides methods for performing actions on the products of our app [Tower](https://app.tower.fi/).\n\nYou can find out more about TowerFI [here](https://tower.fi/).\n\n'
  },
  servers: [
    {
      url: 'https://api.tower.fi'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health endpoint'
    },
    {
      name: 'Pools',
      description: 'Available pools'
    },
    {
      name: 'Assets',
      description: 'Available assets'
    },
    {
      name: 'Routes',
      description: 'Available swap routes for pairs'
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
                    name: 'tower-api',
                    version: '1.0.0'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/pools': {
      get: {
        tags: ['Pools'],
        summary: 'Get all pools info',
        description: 'Get all pools info',
        operationId: 'getPools',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    'status': {
                      'type': 'string',
                      'enum': ['success']
                    },
                    'data': {
                      'type': 'array',
                      'items': {
                        $ref: '#/components/schemas/pool'
                      }
                    }
                  },
                  example: {
                    'status': 'success',
                    'data': [{
                      pool_address: { type: 'string' },
                      token0: {
                        address: 'put_a_correct_address_example_here',
                        symbol: 'WBTC',
                        name: 'Wrapped Bitcoin',
                        reserve: '100000000000000'
                      },
                      token1: {
                        address: 'put_a_correct_address_example_here',
                        symbol: 'WETH',
                        name: 'Wrapped Ether',
                        reserve: '100000000000000'
                      },
                      fee_tier: 2,
                      liquidity_token: 'WBTC_WETH'
                    }]
                  }
                }
              }
            }
          }
        }
      }
    },
    '/assets': {
      get: {
        tags: ['Assets'],
        summary: 'Get all assets info',
        description: 'Get all assets info',
        operationId: 'getAssets',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    'status': {
                      'type': 'string',
                      'enum': ['success']
                    },
                    'data': {
                      'type': 'array',
                      'items': {
                        $ref: '#/components/schemas/asset'
                      }
                    }
                  },
                  example: {
                    'status': 'success',
                    'data': [{
                      address: 'put_a_correct_address_example_here',
                      symbol: 'WBTC',
                      denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
                      type: 'IBC',
                      decimals: 8,
                      current_price: '99999999999999',
                      name: 'Wrapped Bitcoin',
                      logo_uri: 'bitcoin_logo_uri'
                    }]
                  }
                }
              }
            }
          }
        }
      }
    },
  },
  components: {
    schemas: {
      health: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'tower-api'
          },
          version: {
            type: 'string',
            example: '1.0.0'
          }
        }
      },
      pool: {
        type: 'object',
        properties: {
          address: {
            type: 'string'
          },
          token0: {
            type: 'object',
            properties: {
              address: {
                type: 'string'
              },
              symbol: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              reserve: {
                type: 'string'
              }
            }
          },
          token1: {
            type: 'object',
            properties: {
              address: {
                type: 'string'
              },
              symbol: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              reserve: {
                type: 'string'
              }
            }
          },
          fee_tier: {
            type: 'integer',
            format: 'int32'
          },
          liquidity_token: {
            type: 'string'
          },
        }
      },
      asset: {
        type: 'object',
        properties: {
          address: {
            type: 'string'
          },
          symbol: {
            type: 'string'
          },
          denom: {
            type: 'string'
          },
          type: {
            type: 'string',
            enum: ['native', 'erc20', 'ibc']
          },
          decimals: {
            type: 'integer',
            format: 'int32'
          },
          price: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          logo_uri: {
            type: 'string'
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
