export default {
  type: 'object',
  properties: {
    phoneNumber: { type: 'string' },
  },
  required: ['phoneNumber'],
} as const;
