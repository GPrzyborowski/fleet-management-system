import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '../config/prisma-client'

vi.mock('../config/prisma-client', () => ({
	default: {
		users: {
			findUnique: vi.fn(),
		},
	},
}))

describe('POST /api/login', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return 400 for invalid credentials', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue(null)

		const response = await request(app).post('/api/login').send({
			login: 'wrong',
			password: 'wrong',
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Invalid login or password.')
	})
})
