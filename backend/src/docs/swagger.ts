import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rabbitt Sales Insight API',
      version: '1.0.0',
      description: 'Upload CSV/XLSX sales data → AI generates summary → Email delivered',
      contact: {
        name: 'Rabbitt Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
