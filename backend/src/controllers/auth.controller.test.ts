import request from 'supertest'
import app from '../app'

describe('POST /api/login', () => {
	it('should return 400 for invalid credentials', async () => {
		const response = await request(app).post('/api/login').send({
			login: 'wrong',
			password: 'wrong',
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Invalid login or password.')
	})
})
