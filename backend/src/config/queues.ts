import { Queue } from 'bullmq'

const connection = process.env.REDIS_URL
	? { url: process.env.REDIS_URL }
	: {
			host: process.env.REDIS_HOST ?? 'localhost',
			port: Number(process.env.REDIS_PORT ?? 6379),
		}

export const dashboardOcrQueue = new Queue('dashboard-ocr', { connection })
export const damageCheckQueue = new Queue('damage-check', { connection })
