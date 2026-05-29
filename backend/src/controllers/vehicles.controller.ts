import { Request, Response } from 'express'
import prisma from '../config/prisma-client'

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

export const deleteVehicle = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const assignments = await prisma.vehicle_assignments.findMany({
			where: { vehicle_id: Number(id) },
			select: { driver_id: true },
		})
		const driverIds = [...new Set(assignments.map(a => a.driver_id).filter((id): id is number => id !== null))]
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
			where: { id: id },
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
