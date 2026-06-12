import { createServer } from 'http'
import app from './app'
import { initSocket } from './config/socket'
import { startDashboardOcrWorker } from './workers/dashboardOcrWorker'
import { startDamageCheckWorker } from './workers/damageCheckWorker'

const PORT = process.env.PORT ?? 3000

const httpServer = createServer(app)

initSocket(httpServer)

startDashboardOcrWorker()
startDamageCheckWorker()

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
