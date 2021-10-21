export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    status: { type: 'number' },
  },
  required: ['id', 'status'],
} as const;
