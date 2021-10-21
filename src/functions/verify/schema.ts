export default {
  type: 'object',
  properties: {
    phoneNumber: { type: 'string' },
    code: { type: 'string' },
  },
  required: ['phoneNumber', 'code'],
} as const;
