import { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '../config/prisma-client'
import bcrypt from 'bcrypt'

vi.mock('../config/prisma-client', () => ({
	default: {
		users: {
			findUnique: vi.fn(),
		},
	},
}))

vi.mock('../middleware/requireRole', () => ({
	default: vi.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
}))

vi.mock('bcrypt', () => ({
	default: {
		compare: vi.fn(),
	},
}))

describe('POST /api/login', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		process.env.JWT_SECRET = 'testsecret'
	})

	it('should return 400 when user does not exist', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue(null)

		const response = await request(app).post('/api/login').send({
			login: 'wrong',
			password: 'wrong',
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Invalid login or password.')
	})

	it('should return 400 when password is invalid', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue({
			id: 1,
			login: 'admin',
			password_hash: 'hashed',
			first_name: 'Admin',
			last_name: 'User',
			email: 'admin@test.com',
			phone_number: null,
			role: 'manager',
			is_active: true,
			is_employed: true,
			created_at: new Date(),
		})
		vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

		const response = await request(app).post('/api/login').send({
			login: 'admin',
			password: 'wrongpassword',
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Invalid login or password.')
	})

	it('should return 200 with token when credentials are valid', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue({
			id: 1,
			login: 'admin',
			password_hash: 'hashed',
			first_name: 'Admin',
			last_name: 'User',
			email: 'admin@test.com',
			phone_number: null,
			role: 'manager',
			is_active: true,
			is_employed: true,
			created_at: new Date(),
		})
		vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

		const response = await request(app).post('/api/login').send({
			login: 'admin',
			password: 'correctpassword',
		})

		expect(response.status).toBe(200)
		expect(response.body.token).toBeDefined()
	})
})
