import { Request, Response } from 'express'
import prisma from '../config/prisma-client'

export const getAssignmentsForVehicle = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	try {
		const assignments = await prisma.vehicle_assignments.findMany({
			where: { vehicle_id: id },
			include: {
				users: {
					select: {
						first_name: true,
						last_name: true,
					},
				},
			},
			orderBy: { start_time: 'desc' },
		})
		const assigned = await prisma.vehicle_assignments.findFirst({
			where: { vehicle_id: id, end_time: { equals: null } },
			include: {
				users: {
					select: {
						first_name: true,
						last_name: true,
					},
				},
			},
		})
		return res.status(200).json({ assignments, assigned })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}

export const endAssignment = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	try {
		const assignment = await prisma.vehicle_assignments.findFirst({
			where: { vehicle_id: id, end_time: { equals: null } },
		})
		if (!assignment) {
			return res.status(404).json({ message: 'No active assignment was found.' })
		}
		await prisma.vehicle_assignments.update({
			where: { id: assignment.id },
			data: { end_time: new Date(), status: 'completed' },
		})
		return res.status(200).json({ message: 'Assignment ended.' })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}

export const getActiveAssignmentsForEmployee = async (req: Request, res: Response) => {
	const id = req.user!.id
	try {
		const activeAssignments = await prisma.vehicle_assignments.findMany({
			where: {
				driver_id: id,
				end_time: null,
			},
			include: {
				vehicles: {
					select: {
						license_plate: true,
						brand: true,
						model: true,
					},
				},
			},
			orderBy: { start_time: 'desc' },
		})
		return res.status(200).json(activeAssignments)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}

export const takeVehicle = async (req: Request, res: Response) => {
	const driverId = req.user!.id
	const vehicleId = Number(req.params.vehicleId)

	if (!vehicleId || isNaN(vehicleId)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}

	try {
		await prisma.$transaction(async tx => {
			const vehicle = await tx.vehicles.findUnique({
				where: { id: vehicleId },
			})

			if (!vehicle) {
				throw Object.assign(new Error('Vehicle not found.'), { status: 404 })
			}

			if (vehicle.status !== 'available') {
				throw Object.assign(new Error('Vehicle is not available.'), { status: 409 })
			}

			const existingAssignment = await tx.vehicle_assignments.findFirst({
				where: { driver_id: driverId, end_time: null },
			})

			if (existingAssignment) {
				throw Object.assign(new Error('You already have an active assignment.'), { status: 409 })
			}

			await tx.vehicles.update({
				where: { id: vehicleId, status: 'available' },
				data: { status: 'in_use' },
			})

			await tx.vehicle_assignments.create({
				data: {
					vehicle_id: vehicleId,
					driver_id: driverId,
					start_mileage: vehicle.current_mileage,
					start_fuel_level: vehicle.current_fuel_level,
					status: 'active',
				},
			})
		})

		res.status(201).json({ message: 'Vehicle assigned successfully.' })
	} catch (err) {
		const error = err as Error & { status?: number }
		if (error.status) {
			res.status(error.status).json({ message: error.message })
			return
		}
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}

export const getAvailableVehicles = async (req: Request, res: Response) => {
	try {
		const vehicles = await prisma.vehicles.findMany({
			where: { status: 'available' },
			orderBy: { brand: 'asc' },
		})
		res.status(200).json(vehicles)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}
