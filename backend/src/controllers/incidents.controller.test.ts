import { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '../config/prisma-client'

vi.mock('../middleware/auth', () => ({
	default: vi.fn((req, res, next) => next()),
}))

vi.mock('../middleware/requireRole', () => ({
	default: vi.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
}))

vi.mock('../config/prisma-client', () => ({
	default: {
		vehicle_incidents: {
			findMany: vi.fn(),
			update: vi.fn(),
		},
		vehicles: {
			update: vi.fn(),
		},
	},
}))

const mockIncident = {
	id: 1,
	vehicle_id: 1,
	assignment_id: 1,
	ai_description: 'Scratch on left door.',
	status: 'pending',
	created_at: new Date('2025-01-01T10:00:00'),
	vehicle_incident_images: [
		{ id: 1, incident_id: 1, side: 'left', image_url: 'https://example.com/left.jpg', image_type: 'new' },
		{ id: 2, incident_id: 1, side: 'left', image_url: 'https://example.com/left-base.jpg', image_type: 'base' },
	],
}

describe('GET /api/vehicles/:id/incidents', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 with incidents for a vehicle', async () => {
		vi.mocked(prisma.vehicle_incidents.findMany).mockResolvedValue([mockIncident])

		const response = await request(app).get('/api/vehicles/1/incidents')

		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(1)
		expect(response.body[0].id).toBe(1)
	})

	it('should return empty array when no incidents', async () => {
		vi.mocked(prisma.vehicle_incidents.findMany).mockResolvedValue([])

		const response = await request(app).get('/api/vehicles/1/incidents')

		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(0)
	})

	it('should return 400 for invalid vehicle id', async () => {
		const response = await request(app).get('/api/vehicles/abc/incidents')

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_incidents.findMany).mockRejectedValue(new Error('DB error'))

		const response = await request(app).get('/api/vehicles/1/incidents')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})

	it('should query only pending incidents', async () => {
		vi.mocked(prisma.vehicle_incidents.findMany).mockResolvedValue([])

		await request(app).get('/api/vehicles/1/incidents')

		expect(prisma.vehicle_incidents.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({ status: 'pending' }),
			}),
		)
	})
})

describe('PATCH /api/incidents/:id/resolve', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 when incident is resolved', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockResolvedValue({
			...mockIncident,
			status: 'resolved',
		})

		const response = await request(app).patch('/api/incidents/1/resolve')

		expect(response.status).toBe(200)
		expect(response.body.success).toBe(true)
	})

	it('should update incident status to resolved', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockResolvedValue({
			...mockIncident,
			status: 'resolved',
		})

		await request(app).patch('/api/incidents/1/resolve')

		expect(prisma.vehicle_incidents.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { status: 'resolved' },
		})
	})

	it('should return 400 for invalid id', async () => {
		const response = await request(app).patch('/api/incidents/abc/resolve')

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockRejectedValue(new Error('DB error'))

		const response = await request(app).patch('/api/incidents/1/resolve')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})
})

describe('PATCH /api/incidents/:id/withdraw', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 when vehicle is withdrawn for incident', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockResolvedValue({
			...mockIncident,
			status: 'withdrawn',
		})
		vi.mocked(prisma.vehicles.update).mockResolvedValue({
			id: 1,
			license_plate: 'GD 12345',
			brand: 'Volvo',
			model: 'FH16',
			year_of_manufacture: 2020,
			current_mileage: 150000,
			current_fuel_level: 80,
			status: 'in_service',
			created_at: new Date(),
		})

		const response = await request(app).patch('/api/incidents/1/withdraw')

		expect(response.status).toBe(200)
		expect(response.body.success).toBe(true)
	})

	it('should update incident status to withdrawn', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockResolvedValue({
			...mockIncident,
			status: 'withdrawn',
		})
		vi.mocked(prisma.vehicles.update).mockResolvedValue({
			id: 1,
			license_plate: 'GD 12345',
			brand: 'Volvo',
			model: 'FH16',
			year_of_manufacture: 2020,
			current_mileage: 150000,
			current_fuel_level: 80,
			status: 'in_service',
			created_at: new Date(),
		})

		await request(app).patch('/api/incidents/1/withdraw')

		expect(prisma.vehicle_incidents.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { status: 'withdrawn' },
		})
	})

	it('should update vehicle status to in_service', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockResolvedValue({
			...mockIncident,
			status: 'withdrawn',
		})
		vi.mocked(prisma.vehicles.update).mockResolvedValue({
			id: 1,
			license_plate: 'GD 12345',
			brand: 'Volvo',
			model: 'FH16',
			year_of_manufacture: 2020,
			current_mileage: 150000,
			current_fuel_level: 80,
			status: 'in_service',
			created_at: new Date(),
		})

		await request(app).patch('/api/incidents/1/withdraw')

		expect(prisma.vehicles.update).toHaveBeenCalledWith({
			where: { id: mockIncident.vehicle_id },
			data: { status: 'in_service' },
		})
	})

	it('should return 400 for invalid id', async () => {
		const response = await request(app).patch('/api/incidents/abc/withdraw')

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_incidents.update).mockRejectedValue(new Error('DB error'))

		const response = await request(app).patch('/api/incidents/1/withdraw')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})
})
