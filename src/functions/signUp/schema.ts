export default {
  type: 'object',
  properties: {
    token: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    birthday: { type: 'string' },
    acceptTerms: { type: 'boolean' },
  },
  required: ['token', 'firstName', 'lastName', 'birthday', 'acceptTerms'],
} as const;
