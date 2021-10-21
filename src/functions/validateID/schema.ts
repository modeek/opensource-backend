export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    isValid: { type: 'boolean' },
  },
  required: ['id', 'isValid'],
} as const;
