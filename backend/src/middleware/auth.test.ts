import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma-client'
import auth from './auth'

vi.mock('../config/prisma-client', () => ({
	default: {
		users: {
			findUnique: vi.fn(),
		},
	},
}))

vi.mock('jsonwebtoken', () => ({
	default: {
		verify: vi.fn(),
	},
}))

const mockReq = (headers = {}) =>
	({
		headers,
	}) as unknown as Request

const mockRes = () => {
	const res = {} as Response
	res.status = vi.fn().mockReturnValue(res)
	res.json = vi.fn().mockReturnValue(res)
	return res
}

const mockNext = vi.fn() as NextFunction

describe('auth middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		process.env.JWT_SECRET = 'testsecret'
	})

	it('should return 401 when no authorization header', async () => {
		const req = mockReq()
		const res = mockRes()

		await auth(req, res, mockNext)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ error: 'Token not provided.' })
	})

	it('should return 401 when header does not start with Bearer', async () => {
		const req = mockReq({ authorization: 'Basic token123' })
		const res = mockRes()

		await auth(req, res, mockNext)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ error: 'Token not provided.' })
	})

	it('should return 401 when token is invalid', async () => {
		const req = mockReq({ authorization: 'Bearer invalidtoken' })
		const res = mockRes()

		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new Error('invalid token')
		})

		await auth(req, res, mockNext)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' })
	})
})
