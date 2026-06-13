import { Request, Response } from 'express'
import multer from 'multer'
import prisma from '../config/prisma-client'
import { uploadToCloudinary } from '../config/cloudinary'
import { dashboardOcrQueue, damageCheckQueue } from '../config/queues'

export const upload = multer({ storage: multer.memoryStorage() })

export const uploadDashboardImage = async (req: Request, res: Response) => {
	try {
		const file = req.file
		if (!file) {
			res.status(400).json({ error: 'No file provided.' })
			return
		}

		const imageUrl = await uploadToCloudinary(file.buffer, 'dashboards')

		await dashboardOcrQueue.add('ocr', {
			imageUrl,
			socketId: req.body.socketId,
		})

		res.json({ imageUrl })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}

export const returnVehicle = async (req: Request, res: Response) => {
	const assignmentId = Number(req.params.assignmentId)
	if (!assignmentId || isNaN(assignmentId)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}

	try {
		const { mileage, fuelLevel, dashboardImageUrl } = req.body
		const files = req.files as Record<string, Express.Multer.File[]>

		const SIDES = ['front', 'left', 'right', 'back'] as const
		const sideToField: Record<string, string> = {
			front: 'frontImage',
			left: 'leftImage',
			right: 'rightImage',
			back: 'backImage',
		}

		const newImages: Record<string, string> = {}
		for (const side of SIDES) {
			const field = sideToField[side]
			if (files[field]?.[0]) {
				const url = await uploadToCloudinary(files[field][0].buffer, 'returns')
				newImages[side] = url
			}
		}

		const assignment = await prisma.vehicle_assignments.update({
			where: { id: assignmentId },
			data: {
				end_mileage: Number(mileage),
				end_fuel_level: Number(fuelLevel),
				end_time: new Date(),
				dashboard_image_url: dashboardImageUrl,
				status: 'completed',
			},
		})

		if (!assignment.vehicle_id) {
			res.status(500).json({ error: 'Assignment has no vehicle.' })
			return
		}

		const activeAssignments = await prisma.vehicle_assignments.findFirst({
			where: {
				driver_id: assignment.driver_id,
				end_time: null,
			},
		})

		await prisma.vehicles.update({
			where: { id: assignment.vehicle_id },
			data: {
				status: 'available',
				current_mileage: Number(mileage),
				current_fuel_level: Number(fuelLevel),
			},
		})

		if (!activeAssignments && assignment.driver_id) {
			await prisma.users.update({
				where: { id: assignment.driver_id },
				data: { is_active: false },
			})
		}

		const baseImages = await prisma.vehicle_status_images.findMany({
			where: { vehicle_id: assignment.vehicle_id },
			select: { side: true, azure_blob_url: true },
		})

		if (baseImages.length > 0) {
			await damageCheckQueue.add('check', {
				assignmentId,
				vehicleId: assignment.vehicle_id,
				newImages,
				baseImages,
			})
		}

		res.json({ success: true })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}
