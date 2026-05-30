import express from 'express'
import cors from 'cors'
import prisma from './config/prisma-client'
import auth from './routes/auth.routes'
import employees from './routes/employees.routes'
import vehicles from './routes/vehicles.routes'
import password from './routes/password.routes'

const app = express()

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean) as string[]

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Refused by cors'))
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
)

app.use(express.json())

app.get('/health', (req, res) => {
	res.status(200).send('ok')
})

app.get('/ready', async (req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`
		res.status(200).json({ status: 'ok', db: 'connected' })
	} catch {
		res.status(503).json({ status: 'error', db: 'disconnected' })
	}
})

app.use('/api', auth)
app.use('/api', employees)
app.use('/api', vehicles)
app.use('/api', password)

export default app
