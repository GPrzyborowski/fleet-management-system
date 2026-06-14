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
		vehicle_assignments: {
			update: vi.fn(),
			findFirst: vi.fn(),
		},
		vehicles: {
			update: vi.fn(),
		},
		vehicle_status_images: {
			findMany: vi.fn(),
		},
		users: {
			update: vi.fn(),
		},
	},
}))

vi.mock('../config/cloudinary', () => ({
	uploadToCloudinary: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
}))

vi.mock('../config/queues', () => ({
	dashboardOcrQueue: { add: vi.fn().mockResolvedValue({ id: 'job-1' }) },
	damageCheckQueue: { add: vi.fn().mockResolvedValue({ id: 'job-2' }) },
}))

const mockAssignment = {
	id: 1,
	vehicle_id: 1,
	driver_id: 2,
	start_time: new Date('2025-01-10T08:00:00'),
	end_time: new Date('2025-01-10T16:00:00'),
	start_mileage: 149000,
	end_mileage: 150000,
	start_fuel_level: 90,
	end_fuel_level: 80,
	dashboard_image_url: 'https://example.com/dashboard.jpg',
	status: 'completed',
}

const mockVehicle = {
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

describe('POST /api/assignments/dashboard-image', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 400 when no file provided', async () => {
		const response = await request(app).post('/api/assignments/dashboard-image').field('socketId', 'test-socket-id')

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('No file provided.')
	})

	it('should return 200 with imageUrl when file uploaded', async () => {
		const response = await request(app)
			.post('/api/assignments/dashboard-image')
			.attach('image', Buffer.from('fake-image'), 'dashboard.jpg')
			.field('socketId', 'test-socket-id')

		expect(response.status).toBe(200)
		expect(response.body.imageUrl).toBe('https://example.com/image.jpg')
	})

	it('should add job to dashboardOcrQueue', async () => {
		const { dashboardOcrQueue } = await import('../config/queues')

		await request(app)
			.post('/api/assignments/dashboard-image')
			.attach('image', Buffer.from('fake-image'), 'dashboard.jpg')
			.field('socketId', 'test-socket-id')

		expect(dashboardOcrQueue.add).toHaveBeenCalledWith('ocr', {
			imageUrl: 'https://example.com/image.jpg',
			socketId: 'test-socket-id',
		})
	})

	it('should return 500 on cloudinary error', async () => {
		const { uploadToCloudinary } = await import('../config/cloudinary')
		vi.mocked(uploadToCloudinary).mockRejectedValueOnce(new Error('Cloudinary error'))

		const response = await request(app)
			.post('/api/assignments/dashboard-image')
			.attach('image', Buffer.from('fake-image'), 'dashboard.jpg')
			.field('socketId', 'test-socket-id')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})
})

describe('POST /api/assignments/return/:assignmentId', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 400 for invalid assignmentId', async () => {
		const response = await request(app)
			.post('/api/assignments/return/abc')
			.field('mileage', '150000')
			.field('fuelLevel', '80')

		expect(response.status).toBe(400)
		expect(response.body.message).toBe('Invalid data.')
	})

	it('should return 200 on successful return', async () => {
		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue(mockAssignment)
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)
		vi.mocked(prisma.vehicles.update).mockResolvedValue(mockVehicle)
		vi.mocked(prisma.vehicle_status_images.findMany).mockResolvedValue([])
		vi.mocked(prisma.users.update).mockResolvedValue({} as never)

		const response = await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(response.status).toBe(200)
		expect(response.body.success).toBe(true)
	})

	it('should update assignment status to completed', async () => {
		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue(mockAssignment)
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)
		vi.mocked(prisma.vehicles.update).mockResolvedValue(mockVehicle)
		vi.mocked(prisma.vehicle_status_images.findMany).mockResolvedValue([])
		vi.mocked(prisma.users.update).mockResolvedValue({} as never)

		await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(prisma.vehicle_assignments.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: 1 },
				data: expect.objectContaining({ status: 'completed' }),
			}),
		)
	})

	it('should update vehicle status to available', async () => {
		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue(mockAssignment)
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)
		vi.mocked(prisma.vehicles.update).mockResolvedValue(mockVehicle)
		vi.mocked(prisma.vehicle_status_images.findMany).mockResolvedValue([])
		vi.mocked(prisma.users.update).mockResolvedValue({} as never)

		await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(prisma.vehicles.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: mockAssignment.vehicle_id },
				data: expect.objectContaining({ status: 'available' }),
			}),
		)
	})

	it('should add damage check job when base images exist', async () => {
		const { damageCheckQueue } = await import('../config/queues')

		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue(mockAssignment)
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)
		vi.mocked(prisma.vehicles.update).mockResolvedValue(mockVehicle)
		vi.mocked(prisma.vehicle_status_images.findMany).mockResolvedValue([
			{ id: 1, vehicle_id: 1, side: 'front', image_url: 'https://example.com/front.jpg', updated_at: new Date() },
		])
		vi.mocked(prisma.users.update).mockResolvedValue({} as never)

		await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(damageCheckQueue.add).toHaveBeenCalledWith(
			'check',
			expect.objectContaining({
				assignmentId: 1,
				vehicleId: mockAssignment.vehicle_id,
			}),
		)
	})

	it('should not add damage check job when no base images', async () => {
		const { damageCheckQueue } = await import('../config/queues')

		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue(mockAssignment)
		vi.mocked(prisma.vehicle_assignments.findFirst).mockResolvedValue(null)
		vi.mocked(prisma.vehicles.update).mockResolvedValue(mockVehicle)
		vi.mocked(prisma.vehicle_status_images.findMany).mockResolvedValue([])
		vi.mocked(prisma.users.update).mockResolvedValue({} as never)

		await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(damageCheckQueue.add).not.toHaveBeenCalled()
	})

	it('should return 500 when assignment has no vehicle_id', async () => {
		vi.mocked(prisma.vehicle_assignments.update).mockResolvedValue({
			...mockAssignment,
			vehicle_id: null,
		})

		const response = await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Assignment has no vehicle.')
	})

	it('should return 500 on database error', async () => {
		vi.mocked(prisma.vehicle_assignments.update).mockRejectedValue(new Error('DB error'))

		const response = await request(app)
			.post('/api/assignments/return/1')
			.field('mileage', '150000')
			.field('fuelLevel', '80')
			.field('dashboardImageUrl', 'https://example.com/dashboard.jpg')

		expect(response.status).toBe(500)
		expect(response.body.error).toBe('Server error.')
	})
})
