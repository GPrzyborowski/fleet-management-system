import express from 'express'
import prisma from './config/prisma-client'
import auth from './routes/auth.routes'

const app = express()

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

app.listen(3000, () => {
	console.log('Server running on port 3000')
})
