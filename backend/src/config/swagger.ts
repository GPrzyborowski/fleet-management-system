import swaggerJsdoc from 'swagger-jsdoc'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Fleet Management System API',
			version: '1.0.0',
			description: 'REST API for managing a logistics fleet',
		},
		servers: [
			{
				url: 'http://localhost:3000/api',
				description: 'Local development',
			},
			{
				url: 'https://fleet-management-system-production-fcf9.up.railway.app/api',
				description: 'Production',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
