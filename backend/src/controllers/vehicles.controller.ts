import { Request, Response } from 'express'
import prisma from '../config/prisma-client'
import { uploadToCloudinary } from '../config/cloudinary'

export const getVehicles = async (req: Request, res: Response) => {
	try {
		const vehicles = await prisma.vehicles.findMany({
			orderBy: { status: 'asc' },
		})
		res.status(200).json(vehicles)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const getAllVehicleIncidents = async (req: Request, res: Response) => {
	const vehicleId = Number(req.params.id)
	if (!vehicleId || isNaN(vehicleId)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	try {
		const incidents = await prisma.vehicle_incidents.findMany({
			where: { vehicle_id: vehicleId },
			include: { vehicle_incident_images: true },
			orderBy: { created_at: 'desc' },
		})
		res.json(incidents)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}

export const addVehicle = async (req: Request, res: Response) => {
	const { licensePlate, brand, model, year, mileage, fuelLevel, status } = req.body
	const files = req.files as Record<string, Express.Multer.File[]>

	try {
		const vehicle = await prisma.vehicles.create({
			data: {
				license_plate: licensePlate,
				brand,
				model,
				year_of_manufacture: Number(year),
				current_mileage: Number(mileage),
				current_fuel_level: Number(fuelLevel),
				status,
				created_at: new Date(),
			},
		})

		const SIDES = ['front', 'left', 'right', 'back'] as const
		const sideToField: Record<string, string> = {
			front: 'frontImage',
			left: 'leftImage',
			right: 'rightImage',
			back: 'backImage',
		}

		for (const side of SIDES) {
			const field = sideToField[side]
			if (files?.[field]?.[0]) {
				const url = await uploadToCloudinary(files[field][0].buffer, 'base-images')
				await prisma.vehicle_status_images.create({
					data: {
						vehicle_id: vehicle.id,
						side,
						image_url: url,
					},
				})
			}
		}

		res.status(201).json({ message: 'New vehicle was successfully added to database.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const deleteVehicle = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const assignments = await prisma.vehicle_assignments.findMany({
			where: { vehicle_id: Number(id) },
			select: { driver_id: true },
		})

		const driverIds = [...new Set(assignments.map(a => a.driver_id).filter((id): id is number => id !== null))]

		await prisma.vehicle_assignments.deleteMany({
			where: { vehicle_id: Number(id) },
		})

		await prisma.vehicles.delete({
			where: { id: Number(id) },
		})

		if (driverIds.length > 0) {
			const driversToDelete = await prisma.users.findMany({
				where: {
					id: { in: driverIds },
					is_employed: false,
					vehicle_assignments: { none: {} },
				},
				select: { id: true },
			})
			if (driversToDelete.length > 0) {
				await prisma.users.deleteMany({
					where: { id: { in: driversToDelete.map(d => d.id) } },
				})
			}
		}

		return res.status(200).json({ message: 'Vehicle deleted.' })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}

export const updateVehicle = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	const { licensePlate, brand, model, year, status } = req.body
	try {
		await prisma.vehicles.update({
			where: { id },
			data: {
				license_plate: licensePlate,
				brand,
				model,
				year_of_manufacture: Number(year),
				status,
			},
		})
		res.status(200).json({ message: 'Vehicle updated successfully.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const returnToFleet = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	try {
		await prisma.vehicles.update({
			where: { id },
			data: { status: 'available' },
		})
		res.status(200).json({ message: 'Vehicle returned to fleet.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const withdrawFromFleet = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	try {
		await prisma.vehicles.update({
			where: { id },
			data: { status: 'in_service' },
		})
		res.status(200).json({ message: 'Vehicle withdrawed from fleet.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}
