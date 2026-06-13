import Redis from 'ioredis'

const redis = process.env.REDIS_URL
	? new Redis(process.env.REDIS_URL)
	: new Redis({
			host: process.env.REDIS_HOST ?? 'localhost',
			port: Number(process.env.REDIS_PORT ?? 6379),
		})

redis.on('error', err => console.error(`Redis connection error: ${err}`))

export default redis
