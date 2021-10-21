export default {
  type: 'object',
  properties: {
    card: {
      type: 'object',
      properties: {
        last4: { type: 'string' },
        id: { type: 'string' },
        brand: { type: 'string' },
        exp_year: { type: 'number' },
        exp_month: { type: 'number' },
        funding: { type: 'string' },
        name: { type: 'string' },
      },
    },
    items: {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            Flavors: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  properties: {
                    Name: {
                      type: 'string',
                    },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    Name: {
                      type: 'string',
                    },
                  },
                },
              ],
            },
            Name: {
              type: 'string',
            },
            Quantity: {
              type: 'integer',
            },
            Price: {
              type: 'integer',
            },
            Addons: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  properties: {
                    Name: {
                      type: 'string',
                    },
                    Price: {
                      type: 'integer',
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },

    info: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        dropOffTime: { type: 'number' },
        contactNumber: { type: 'string' },
        driverTip: { type: 'number' },
        notes: { type: 'string' },
      },
    },
    paymentIntentId: {
      type: 'string',
    },
  },
} as const;
