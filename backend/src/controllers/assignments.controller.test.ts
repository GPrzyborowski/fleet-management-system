import { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '../config/prisma-client'
import type { vehicle_assignments } from '../generated/prisma'

vi.mock('../middleware/auth', () => ({
	default: vi.fn((req, res, next) => {
		req.user = { id: 2, login: 'test', role: 'driver' }
		next()
	}),
}))

vi.mock('../middleware/requireRole', () => ({
	default: vi.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
}))

vi.mock('../config/prisma-client', () => ({
	default: {
		$transaction: vi.fn(),
		vehicle_assignments: {
			findMany: vi.fn(),
			findFirst: vi.fn(),
			update: vi.fn(),
			create: vi.fn(),
		},
		vehicles: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			update: vi.fn(),
		},
		users: {
			update: vi.fn(),
		},
	},
}))

const mockAssignment: vehicle_assignments = {
	id: 1,
	vehicle_id: 1,
	driver_id: 2,
	start_time: new Date('2025-01-10T08:00:00'),
	end_time: new Date('2025-01-10T16:00:00'),
	start_mileage: 149000,
	end_mileage: 150000,
	start_fuel_level: 90,
	end_fuel_level: 80,
	dashboard_image_url:
		'https://www.racv.com.au/royalauto/transport/cars/what-do-the-car-dashboard-symbols-mean-and-warning-lights/_jcr_content/root/container/articlepagecontent/image.coreimg.jpeg/1745367448392/1400x600-car-dashboard-lights-gettyimages-519216518.jpeg',
	status: 'completed',
}

const mockActiveAssignment: vehicle_assignments = {
	id: 3,
	vehicle_id: 3,
	driver_id: 4,
	start_time: new Date('2025-03-20T06:00:00'),
	end_time: null,
	start_mileage: 89500,
	end_mileage: null,
	start_fuel_level: 100,
	end_fuel_level: null,
	dashboard_image_url: null,
	status: 'active',
}

describe('GET /api/assignments-vehicle/:id', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 with assignments and assigned driver', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockResolvedValue([mockAssignment])
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)

		const response = await request(app).get('/api/assignments-vehicle/1')

		expect(response.status).toBe(200)
		expect(response.body.assignments).toHaveLength(1)
		expect(response.body.assigned).toBeNull()
	})

	it('should return assigned driver when active assignment exists', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockResolvedValue([mockActiveAssignment])
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(mockActiveAssignment)

		const response = await request(app).get('/api/assignments-vehicle/3')

		expect(response.status).toBe(200)
		expect(response.body.assigned).not.toBeNull()
		expect(response.body.assigned.id).toBe(3)
	})

	it('should return empty assignments array when vehicle has no assignments', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockResolvedValue([])
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)

		const response = await request(app).get('/api/assignments-vehicle/5')

		expect(response.status).toBe(200)
		expect(response.body.assignments).toHaveLength(0)
		expect(response.body.assigned).toBeNull()
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockRejectedValue(new Error('DB error'))

		const response = await request(app).get('/api/assignments-vehicle/1')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})
})

describe('PATCH /api/assignments-end/:id', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 when assignment is ended successfully', async () => {
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(mockActiveAssignment)
		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue({
			...mockActiveAssignment,
			end_time: new Date(),
			status: 'completed',
		})

		const response = await request(app).patch('/api/assignments-end/3')

		expect(response.status).toBe(200)
		expect(response.body.message).toBe('Assignment ended.')
	})

	it('should return 404 when no active assignment found', async () => {
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)

		const response = await request(app).patch('/api/assignments-end/1')

		expect(response.status).toBe(404)
		expect(response.body.message).toBe('No active assignment was found.')
	})

	it('should return 400 for invalid id', async () => {
		const response = await request(app).patch('/api/assignments-end/abc')

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_assignments.findFirst).mockRejectedValue(new Error('DB error'))

		const response = await request(app).patch('/api/assignments-end/3')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})

	it('should call update with end_time and completed status', async () => {
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(mockActiveAssignment)
		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue({
			...mockActiveAssignment,
			end_time: new Date(),
			status: 'completed',
		})

		await request(app).patch('/api/assignments-end/3')

		expect(prisma.vehicle_assignments.update).toHaveBeenCalledWith({
			where: { id: mockActiveAssignment.id },
			data: expect.objectContaining({ status: 'completed' }),
		})
	})
})

describe('GET /api/vehicles/available', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 with available vehicles', async () => {
		vi.mocked(prisma.vehicles.findMany).mockResolvedValue([
			{
				id: 1,
				license_plate: 'GD 12345',
				brand: 'Volvo',
				model: 'FH16',
				year_of_manufacture: 2020,
				current_mileage: 150000,
				current_fuel_level: 80,
				status: 'available',
				created_at: new Date(),
			},
		])

		const response = await request(app).get('/api/vehicles/available')

		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(1)
	})

	it('should return empty array when no vehicles available', async () => {
		vi.mocked(prisma.vehicles.findMany).mockResolvedValue([])

		const response = await request(app).get('/api/vehicles/available')

		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(0)
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicles.findMany).mockRejectedValue(new Error('DB error'))

		const response = await request(app).get('/api/vehicles/available')

		expect(response.status).toBe(500)
	})
})

describe('POST /api/assignments/take/:vehicleId', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 201 when vehicle is taken successfully', async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async callback => {
			return callback({
				vehicles: {
					findUnique: vi.fn().mockResolvedValue({
						id: 1,
						license_plate: 'GD 12345',
						brand: 'Volvo',
						model: 'FH16',
						year_of_manufacture: 2020,
						current_mileage: 150000,
						current_fuel_level: 80,
						status: 'available',
						created_at: new Date(),
					}),
					update: vi.fn().mockResolvedValue({}),
				},
				vehicle_assignments: {
					findFirst: vi.fn().mockResolvedValue(null),
					create: vi.fn().mockResolvedValue({}),
				},
				users: {
					update: vi.fn().mockResolvedValue({}),
				},
			} as never)
		})

		const response = await request(app).post('/api/assignments/take/1')

		expect(response.status).toBe(201)
		expect(response.body.message).toBe('Vehicle assigned successfully.')
	})

	it('should return 400 for invalid vehicleId', async () => {
		const response = await request(app).post('/api/assignments/take/abc')

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 404 when vehicle not found', async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async callback => {
			return callback({
				vehicles: {
					findUnique: vi.fn().mockResolvedValue(null),
					update: vi.fn(),
				},
				vehicle_assignments: {
					findFirst: vi.fn(),
					create: vi.fn(),
				},
			} as never)
		})

		const response = await request(app).post('/api/assignments/take/99')

		expect(response.status).toBe(404)
		expect(response.body.message).toBe('Vehicle not found.')
	})

	it('should return 409 when vehicle is not available', async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async callback => {
			return callback({
				vehicles: {
					findUnique: vi.fn().mockResolvedValue({
						id: 1,
						status: 'in_use',
						current_mileage: 150000,
						current_fuel_level: 80,
					}),
					update: vi.fn(),
				},
				vehicle_assignments: {
					findFirst: vi.fn(),
					create: vi.fn(),
				},
			} as never)
		})

		const response = await request(app).post('/api/assignments/take/1')

		expect(response.status).toBe(409)
		expect(response.body.message).toBe('Vehicle is not available.')
	})

	it('should return 409 when driver already has active assignment', async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async callback => {
			return callback({
				vehicles: {
					findUnique: vi.fn().mockResolvedValue({
						id: 1,
						status: 'available',
						current_mileage: 150000,
						current_fuel_level: 80,
					}),
					update: vi.fn(),
				},
				vehicle_assignments: {
					findFirst: vi.fn().mockResolvedValue({ id: 3, status: 'active' }),
					create: vi.fn(),
				},
			} as never)
		})

		const response = await request(app).post('/api/assignments/take/1')

		expect(response.status).toBe(409)
		expect(response.body.message).toBe('You already have an active assignment.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.$transaction).mockRejectedValue(new Error('db error'))

		const response = await request(app).post('/api/assignments/take/1')

		expect(response.status).toBe(500)
	})
})
