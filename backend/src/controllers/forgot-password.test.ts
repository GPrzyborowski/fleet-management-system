import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi } from 'vitest'
import prisma from '../config/prisma-client'
import redis from '../config/redis-client'

vi.mock('../config/prisma-client', () => ({
	default: {
		users: {
			findUnique: vi.fn(),
		},
	},
}))

vi.mock('../config/redis-client', () => ({
	default: {
		set: vi.fn(),
	},
}))

vi.mock('resend', () => {
	return {
		Resend: vi.fn().mockImplementation(function () {
			return {
				emails: {
					send: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
				},
			}
		}),
	}
})

describe('POST /api/forgot-password', () => {
	it('should return 200 even if email does not exist', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue(null)

		const response = await request(app).post('/api/forgot-password').send({ email: 'test@test.test' })

		expect(response.status).toBe(200)
		expect(response.body.message).toBe('If this email is correct, password reset link will be sent.')
	})

	it('should return 200 and set redis token if user exists', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue({
			id: 1,
			email: 'user@test.com',
		} as any)
		vi.mocked(redis.set).mockResolvedValue('OK')

		const response = await request(app).post('/api/forgot-password').send({ email: 'test@test.test' })

		expect(response.status).toBe(200)
		expect(redis.set).toHaveBeenCalled()
		expect(response.body.message).toBe('If this email is correct, password reset link will be sent.')
	})
})
