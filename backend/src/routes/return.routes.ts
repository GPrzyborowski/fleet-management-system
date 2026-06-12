import express from 'express'
import auth from '../middleware/auth'
import { upload, uploadDashboardImage, returnVehicle } from '../controllers/return.controller'
import { getVehicleIncidents, resolveIncident, withdrawForIncident } from '../controllers/incidents.controller'

const router = express.Router()

router.post('/assignments/dashboard-image', auth, upload.single('image'), uploadDashboardImage)

router.post(
	'/assignments/return/:assignmentId',
	auth,
	upload.fields([
		{ name: 'frontImage', maxCount: 1 },
		{ name: 'leftImage', maxCount: 1 },
		{ name: 'rightImage', maxCount: 1 },
		{ name: 'backImage', maxCount: 1 },
	]),
	returnVehicle,
)

router.get('/vehicles/:id/incidents', auth, getVehicleIncidents)
router.patch('/incidents/:id/resolve', auth, resolveIncident)
router.patch('/incidents/:id/withdraw', auth, withdrawForIncident)

export default router
