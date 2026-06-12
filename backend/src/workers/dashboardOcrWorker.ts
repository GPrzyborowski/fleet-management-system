import { Worker } from 'bullmq'
import OpenAI from 'openai'
import { io } from '../config/socket'

const connection = {
	host: process.env.REDIS_HOST ?? 'localhost',
	port: Number(process.env.REDIS_PORT ?? 6379),
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const startDashboardOcrWorker = () => {
	new Worker(
		'dashboard-ocr',
		async job => {
			const { imageUrl, socketId } = job.data

			const response = await openai.chat.completions.create({
				model: 'gpt-4o',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'image_url',
								image_url: { url: imageUrl },
							},
							{
								type: 'text',
								text: 'From this vehicle dashboard image extract: 1) the current odometer reading as a whole number, 2) the fuel level as a percentage 0-100. Respond ONLY with valid JSON, no markdown: {"mileage": number, "fuelLevel": number}. If you cannot read a value use null.',
							},
						],
					},
				],
				max_tokens: 100,
			})

			const content = response.choices[0].message.content ?? ''
			const clean = content.replace(/```json|```/g, '').trim()

			let parsed: { mileage: number | null; fuelLevel: number | null }

			try {
				parsed = JSON.parse(clean)
			} catch {
				parsed = { mileage: null, fuelLevel: null }
			}

			io.to(socketId).emit('dashboard-ocr-result', parsed)
		},
		{ connection },
	)
}
