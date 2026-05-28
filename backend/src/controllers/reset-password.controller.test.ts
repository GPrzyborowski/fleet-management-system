import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi } from 'vitest'
import prisma from '../config/prisma-client'
import redis from '../config/redis-client'
import type { users } from '../generated/prisma'

vi.mock('../config/prisma-client', () => ({
	default: {
		users: {
			update: vi.fn(),
		},
	},
}))

vi.mock('../config/redis-client', () => ({
	default: {
		get: vi.fn(),
		del: vi.fn(),
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

describe('POST /api/reset-password', () => {
	it('should return 400 if token is invalid or expired', async () => {
		vi.mocked(redis.get).mockResolvedValue(null)

		const response = await request(app)
			.post('/api/reset-password')
			.send({ token: 'invalid-token', newPassword: 'testpassword123' })

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Token is invalid or has expired.')
	})

	it('should return 200 and update password if token is valid', async () => {
		vi.mocked(redis.get).mockResolvedValue('1')
		vi.mocked(prisma.users.update).mockResolvedValue({
			id: 1,
			email: 'user@test.com',
			login: 'testuser',
			first_name: 'Test',
			last_name: 'User',
			password_hash: 'hash',
			phone_number: null,
			role: 'driver',
			is_active: true,
			is_employed: true,
			created_at: new Date(),
		} as users)
		vi.mocked(redis.del).mockResolvedValue(1)

		const response = await request(app)
			.post('/api/reset-password')
			.send({ token: 'valid-token', newPassword: 'testpassword123' })

		expect(response.status).toBe(200)
		expect(prisma.users.update).toHaveBeenCalled()
		expect(redis.del).toHaveBeenCalledWith('reset:valid-token')
		expect(response.body.message).toBe('Successfully reset the password.')
	})
})
