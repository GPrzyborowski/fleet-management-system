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
