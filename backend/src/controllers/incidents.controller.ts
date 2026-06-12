import { Request, Response } from 'express'
import prisma from '../config/prisma-client'

export const getVehicleIncidents = async (req: Request, res: Response) => {
	const vehicleId = Number(req.params.id)
	if (!vehicleId || isNaN(vehicleId)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}

	try {
		const incidents = await prisma.vehicle_incidents.findMany({
			where: { vehicle_id: vehicleId, status: 'pending' },
			include: { vehicle_incident_images: true },
			orderBy: { created_at: 'desc' },
		})
		res.json(incidents)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}

export const resolveIncident = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}

	try {
		await prisma.vehicle_incidents.update({
			where: { id },
			data: { status: 'resolved' },
		})
		res.json({ success: true })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}

export const withdrawForIncident = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}

	try {
		const incident = await prisma.vehicle_incidents.update({
			where: { id },
			data: { status: 'withdrawn' },
		})
		await prisma.vehicles.update({
			where: { id: incident.vehicle_id },
			data: { status: 'in_service' },
		})
		res.json({ success: true })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error.' })
	}
}
