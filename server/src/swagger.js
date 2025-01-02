const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Windsurfing Task Management API',
      version: '1.0.0',
      description: 'API documentation for the Windsurfing Task Management application',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated task ID',
            },
            subject: {
              type: 'string',
              description: 'The task subject',
            },
            userEmail: {
              type: 'string',
              description: 'Email of the user who owns the task',
            },
            completed: {
              type: 'boolean',
              description: 'Whether the task is completed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp',
            },
          },
          required: ['id', 'subject', 'userEmail'],
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, 'index.js')],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
