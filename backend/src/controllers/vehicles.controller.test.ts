import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '../config/prisma-client'
import type { vehicles } from '../generated/prisma'
import type { users } from '../generated/prisma'

vi.mock('../config/prisma-client', () => ({
	default: {
		vehicles: {
			findMany: vi.fn(),
			create: vi.fn(),
			delete: vi.fn(),
			update: vi.fn(),
		},
		vehicle_assignments: {
			findMany: vi.fn(),
		},
		users: {
			findMany: vi.fn(),
			deleteMany: vi.fn(),
		},
	},
}))

const mockVehicle: vehicles = {
	id: 1,
	license_plate: 'GD 12345',
	brand: 'Volvo',
	model: 'FH16',
	year_of_manufacture: 2020,
	current_mileage: 150000,
	current_fuel_level: 80,
	status: 'available',
	created_at: new Date(),
}

describe('GET /api/vehicles', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 with list of vehicles', async () => {
		vi.mocked(prisma.vehicles.findMany).mockResolvedValue([mockVehicle])

		const response = await request(app).get('/api/vehicles').set('Authorization', 'Bearer test-token')

		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(1)
		expect(response.body[0].license_plate).toBe('GD 12345')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicles.findMany).mockRejectedValue(new Error('DB error'))

		const response = await request(app).get('/api/vehicles').set('Authorization', 'Bearer test-token')

		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Server error.')
	})
})

describe('POST /api/vehicles', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 201 and create vehicle', async () => {
		vi.mocked(prisma.vehicles.create).mockResolvedValue(mockVehicle)

		const response = await request(app).post('/api/vehicles').set('Authorization', 'Bearer test-token').send({
			licensePlate: 'GD 12345',
			brand: 'Volvo',
			model: 'FH16',
			year: 2020,
			mileage: 150000,
			fuelLevel: 80,
			status: 'available',
		})

		expect(response.status).toBe(201)
		expect(response.body.message).toBe('New vehicle was successfully added to database.')
		expect(prisma.vehicles.create).toHaveBeenCalled()
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicles.create).mockRejectedValue(new Error('DB error'))

		const response = await request(app).post('/api/vehicles').set('Authorization', 'Bearer test-token').send({
			licensePlate: 'GD 12345',
			brand: 'Volvo',
			model: 'FH16',
			year: 2020,
			mileage: 150000,
			fuelLevel: 80,
			status: 'available',
		})

		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Server error.')
	})
})

describe('DELETE /api/vehicles/:id', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 and delete vehicle with no assignments', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockResolvedValue([])
		vi.mocked(prisma.vehicles.delete).mockResolvedValue(mockVehicle)

		const response = await request(app).delete('/api/vehicles/1').set('Authorization', 'Bearer test-token')

		expect(response.status).toBe(200)
		expect(response.body.message).toBe('Vehicle deleted.')
		expect(prisma.vehicles.delete).toHaveBeenCalledWith({ where: { id: 1 } })
	})

	it('should delete inactive drivers with no remaining assignments', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockResolvedValue([
			{
				id: 1,
				vehicle_id: 1,
				driver_id: 2,
				start_time: new Date(),
				end_time: null,
				start_mileage: 0,
				end_mileage: null,
				start_fuel_level: 100,
				end_fuel_level: null,
				dashboard_image_url: null,
				status: 'completed',
			},
		])
		vi.mocked(prisma.vehicles.delete).mockResolvedValue(mockVehicle)
		vi.mocked(prisma.users.findMany).mockResolvedValue([{ id: 2 }] as users[])
		vi.mocked(prisma.users.deleteMany).mockResolvedValue({ count: 1 })

		const response = await request(app).delete('/api/vehicles/1').set('Authorization', 'Bearer test-token')

		expect(response.status).toBe(200)
		expect(prisma.users.deleteMany).toHaveBeenCalledWith({ where: { id: { in: [2] } } })
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_assignments.findMany).mockRejectedValue(new Error('DB error'))

		const response = await request(app).delete('/api/vehicles/1').set('Authorization', 'Bearer test-token')

		expect(response.status).toBe(500)
	})
})

describe('PATCH /api/vehicles/:id', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 and update vehicle', async () => {
		vi.mocked(prisma.vehicles.update).mockResolvedValue(mockVehicle)

		const response = await request(app).patch('/api/vehicles/1').set('Authorization', 'Bearer test-token').send({
			licensePlate: 'GD 99999',
			brand: 'Scania',
			model: 'R500',
			year: 2021,
			status: 'available',
		})

		expect(response.status).toBe(200)
		expect(response.body.message).toBe('Vehicle updated successfully.')
		expect(prisma.vehicles.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				license_plate: 'GD 99999',
				brand: 'Scania',
				model: 'R500',
				year_of_manufacture: 2021,
				status: 'available',
			},
		})
	})

	it('should return 400 for invalid id', async () => {
		const response = await request(app)
			.patch('/api/vehicles/abc')
			.set('Authorization', 'Bearer test-token')
			.send({ licensePlate: 'GD 99999' })

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicles.update).mockRejectedValue(new Error('DB error'))

		const response = await request(app).patch('/api/vehicles/1').set('Authorization', 'Bearer test-token').send({
			licensePlate: 'GD 99999',
			brand: 'Scania',
			model: 'R500',
			year: 2021,
			status: 'available',
		})

		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Server error.')
	})
})
