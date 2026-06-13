import { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '../config/prisma-client'
import type { users } from '../generated/prisma'

vi.mock('../middleware/auth', () => ({
	default: vi.fn((req, res, next) => next()),
}))

vi.mock('../middleware/requireRole', () => ({
	default: vi.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
}))

vi.mock('../config/prisma-client', () => ({
	default: {
		users: {
			create: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			update: vi.fn(),
		},
	},
}))

vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(function () {
		return {
			emails: {
				send: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
			},
		}
	}),
}))

vi.mock('../config/redis-client', () => ({
	default: {
		set: vi.fn(),
		get: vi.fn(),
		del: vi.fn(),
	},
}))

const mockUser: users = {
	id: 1,
	login: 'gprzyborowski',
	first_name: 'Gabriel',
	last_name: 'Przyborowski',
	email: 'gprzyborowski@example.com',
	password_hash: 'hash',
	phone_number: '123456789',
	role: 'driver',
	is_active: true,
	is_employed: true,
	created_at: new Date(),
}

describe('POST /api/employees', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 201 when employee is created successfully', async () => {
		vi.mocked(prisma.users.create).mockResolvedValue(mockUser)
		const response = await request(app).post('/api/employees').send({
			login: 'gprzyborowski',
			firstName: 'Gabriel',
			lastName: 'Przyborowski',
			email: 'gprzyborowski@example.com',
			password: 'password123',
			phone: '123456789',
			role: 'driver',
		})
		expect(response.status).toBe(201)
		expect(response.body.message).toBe('New employee was successfully added to database.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.users.create).mockRejectedValue(new Error('DB error'))
		const response = await request(app).post('/api/employees').send({
			login: 'gprzyborowski',
			firstName: 'Gabriel',
			lastName: 'Przyborowski',
			email: 'gprzyborowski@example.com',
			password: 'password123',
			phone: '123456789',
			role: 'driver',
		})
		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Server error.')
	})
})

describe('GET /api/employees', () => {
	beforeEach(() => vi.clearAllMocks())
	it('should return 200 with list of employees', async () => {
		vi.mocked(prisma.users.findMany).mockResolvedValue([mockUser])
		const response = await request(app).get('/api/employees')
		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(1)
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.users.findMany).mockRejectedValue(new Error('DB error'))
		const response = await request(app).get('/api/employees')
		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Server error.')
	})
})

describe('GET /api/employees/:id', () => {
	beforeEach(() => vi.clearAllMocks())
	it('should return 200 with employee data', async () => {
		vi.mocked(prisma.users.findUnique).mockResolvedValue(mockUser)
		const response = await request(app).get('/api/employees/1')
		expect(response.status).toBe(200)
		expect(response.body.login).toBe('gprzyborowski')
	})
	it('should return 400 for invalid id', async () => {
		const response = await request(app).get('/api/employees/abc')
		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})
})

describe('PATCH /api/employees/:id', () => {
	beforeEach(() => vi.clearAllMocks())
	it('should return 200 when employee is updated', async () => {
		vi.mocked(prisma.users.update).mockResolvedValue(mockUser)
		const response = await request(app).patch('/api/employees/1').send({
			login: 'gprzyborowski',
			firstName: 'Gabriel',
			lastName: 'Przyborowski',
			email: 'gprzyborowski@example.com',
			phone: '123456789',
			role: 'driver',
		})
		expect(response.status).toBe(200)
		expect(response.body.message).toBe('Employee updated successfully.')
	})

	it('should return 400 for invalid id', async () => {
		const response = await request(app).patch('/api/employees/abc').send({})
		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})
})

describe('PATCH /api/employees/:id/remove', () => {
	beforeEach(() => vi.clearAllMocks())
	it('should return 200 when employee is dismissed', async () => {
		vi.mocked(prisma.users.update).mockResolvedValue({ ...mockUser, is_employed: false })
		const response = await request(app).patch('/api/employees/1/remove')
		expect(response.status).toBe(200)
		expect(response.body.message).toBe('Employee dismissed successfully.')
	})

	it('should return 400 for invalid id', async () => {
		const response = await request(app).patch('/api/employees/abc/remove')
		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})
})
