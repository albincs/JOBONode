import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jobo Structurals API',
      version: '1.0.0',
      description: 'API documentation for Jobo Structurals Backend (Node.js)',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
    security: [{
        bearerAuth: []
    }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        },
        schemas: {
            Project: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    start_date: { type: 'string', format: 'date' },
                    end_date: { type: 'string', format: 'date' },
                    cost_estimation: { type: 'number' },
                    is_completed: { type: 'boolean' }
                }
            },
            Contact: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone_number: { type: 'string' },
                    message: { type: 'string' },
                    captcha_token: { type: 'string' }
                },
                required: ['name', 'email', 'phone_number', 'message', 'captcha_token']
            },
            Team: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    qualification: { type: 'string' },
                    designation: { type: 'string' },
                    email: { type: 'string' },
                    phone_number: { type: 'string' },
                    image: { type: 'string' }
                }
            },
            Client: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    logo: { type: 'string' }
                }
            },
            Testimonial: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    role: { type: 'string' },
                    testimonial: { type: 'string' },
                    photo: { type: 'string' }
                }
            },
            ProjectCategory: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    parent_id: { type: 'integer' }
                }
            },
            CmsTable: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    image: { type: 'string' }
                }
            },
             Service: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    image: { type: 'string' }
                }
            },
            AboutUs: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    slug: { type: 'string' },
                     description: { type: 'string' }
                }
            },
            Award: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    date: { type: 'string', format: 'date' },
                    venue: { type: 'string' },
                    awarded_by: { type: 'string' },
                     description: { type: 'string' }
                }
            }
        }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;
