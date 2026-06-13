import express from 'express'
import auth from '../middleware/auth'
import requireRole from '../middleware/requireRole'
import { upload, uploadDashboardImage, returnVehicle } from '../controllers/return.controller'
import { getVehicleIncidents, resolveIncident, withdrawForIncident } from '../controllers/incidents.controller'

const router = express.Router()

router.post('/assignments/dashboard-image', auth, requireRole('driver'), upload.single('image'), uploadDashboardImage)

router.post(
	'/assignments/return/:assignmentId',
	auth,
	requireRole('driver'),
	upload.fields([
		{ name: 'frontImage', maxCount: 1 },
		{ name: 'leftImage', maxCount: 1 },
		{ name: 'rightImage', maxCount: 1 },
		{ name: 'backImage', maxCount: 1 },
	]),
	returnVehicle,
)

router.get('/vehicles/:id/incidents', auth, requireRole('manager'), getVehicleIncidents)
router.patch('/incidents/:id/resolve', auth, requireRole('manager'), resolveIncident)
router.patch('/incidents/:id/withdraw', auth, requireRole('manager'), withdrawForIncident)

export default router
