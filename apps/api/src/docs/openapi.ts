import { connectionHealth } from '../connections/index.js';

export function buildOpenApiSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'InterviewFlow AI API',
      version: '1.0.0',
      description: 'Production-style API skeleton for the InterviewFlow AI platform.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: {
            200: { description: 'Healthy response' },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          summary: 'Issue JWT token',
          responses: {
            200: { description: 'JWT token response' },
          },
        },
      },
      '/api/v1/users': {
        get: {
          summary: 'List users',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Users list' },
          },
        },
      },
      '/api/v1/interviews': {
        get: {
          summary: 'List interviews',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Interviews list' },
          },
        },
      },
      '/api/v1/questions': {
        get: {
          summary: 'List questions',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Questions list' },
          },
        },
      },
      '/api/v1/evaluations': {
        get: {
          summary: 'List evaluations',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Evaluations list' },
          },
        },
      },
      '/api/v1/analytics/overview': {
        get: {
          summary: 'Analytics overview',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Analytics response' },
          },
        },
      },
      '/api/v1/search': {
        get: {
          summary: 'Search endpoint',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Search response' },
          },
        },
      },
    },
    'x-runtime': {
      connections: connectionHealth(),
    },
  };
}
