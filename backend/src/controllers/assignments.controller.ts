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
		})
		return res.status(200).json(assignments)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}
