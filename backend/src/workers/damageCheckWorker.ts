import { Worker } from 'bullmq'
import OpenAI from 'openai'
import prisma from '../config/prisma-client'
import { sendDamageAlert } from '../config/mailer'

const connection = {
	host: process.env.REDIS_HOST ?? 'localhost',
	port: Number(process.env.REDIS_PORT ?? 6379),
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SIDES = ['front', 'left', 'right', 'back'] as const

export const startDamageCheckWorker = () => {
	new Worker(
		'damage-check',
		async job => {
			const { assignmentId, vehicleId, newImages, baseImages } = job.data as {
				assignmentId: number
				vehicleId: number
				newImages: Record<string, string>
				baseImages: { side: string; azure_blob_url: string }[]
			}

			const baseMap: Record<string, string> = {}
			for (const img of baseImages) {
				baseMap[img.side] = img.azure_blob_url
			}

			const imageContent: OpenAI.Chat.ChatCompletionContentPart[] = []

			for (const side of SIDES) {
				if (baseMap[side]) {
					imageContent.push({
						type: 'text',
						text: `BASE ${side.toUpperCase()} (reference - undamaged):`,
					})
					imageContent.push({
						type: 'image_url',
						image_url: { url: baseMap[side] },
					})
				}
				if (newImages[side]) {
					imageContent.push({
						type: 'text',
						text: `NEW ${side.toUpperCase()} (after trip):`,
					})
					imageContent.push({
						type: 'image_url',
						image_url: { url: newImages[side] },
					})
				}
			}

			imageContent.push({
				type: 'text',
				text: 'Compare each BASE and NEW pair. Look for new scratches, dents, broken lights, or any damage not present in the base images. Respond ONLY with valid JSON, no markdown: {"damaged": boolean, "description": "string or null"}',
			})

			const response = await openai.chat.completions.create({
				model: 'gpt-4o',
				messages: [{ role: 'user', content: imageContent }],
				max_tokens: 500,
			})

			const content = response.choices[0].message.content ?? ''
			const clean = content.replace(/```json|```/g, '').trim()

			let result: { damaged: boolean; description: string | null }

			try {
				result = JSON.parse(clean)
			} catch {
				result = { damaged: false, description: null }
			}

			if (!result.damaged || !result.description) return

			const incident = await prisma.vehicle_incidents.create({
				data: {
					vehicle_id: vehicleId,
					assignment_id: assignmentId,
					ai_description: result.description,
					status: 'pending',
				},
			})

			for (const side of SIDES) {
				if (newImages[side]) {
					await prisma.vehicle_incident_images.create({
						data: {
							incident_id: incident.id,
							side,
							azure_blob_url: newImages[side],
							image_type: 'new',
						},
					})
				}
				if (baseMap[side]) {
					await prisma.vehicle_incident_images.create({
						data: {
							incident_id: incident.id,
							side,
							azure_blob_url: baseMap[side],
							image_type: 'base',
						},
					})
				}
			}

			const vehicle = await prisma.vehicles.findUnique({
				where: { id: vehicleId },
				select: { brand: true, model: true, license_plate: true },
			})

			if (vehicle) {
				await sendDamageAlert(
					{
						brand: vehicle.brand,
						model: vehicle.model,
						licensePlate: vehicle.license_plate,
					},
					result.description,
				)
			}
		},
		{ connection },
	)
}
