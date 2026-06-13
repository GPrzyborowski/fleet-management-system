import express from 'express'
import multer from 'multer'
import auth from '../middleware/auth'
import requireRole from '../middleware/requireRole'
import {
	getVehicles,
	getAllVehicleIncidents,
	addVehicle,
	updateVehicle,
	returnToFleet,
	withdrawFromFleet,
	deleteVehicle,
} from '../controllers/vehicles.controller'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/vehicles', auth, requireRole('manager'), getVehicles)
router.get('/vehicles/:id/incidents/all', auth, requireRole('manager'), getAllVehicleIncidents)
router.post(
	'/vehicles',
	auth,
	requireRole('manager'),
	upload.fields([
		{ name: 'frontImage', maxCount: 1 },
		{ name: 'leftImage', maxCount: 1 },
		{ name: 'rightImage', maxCount: 1 },
		{ name: 'backImage', maxCount: 1 },
	]),
	addVehicle,
)
router.patch('/vehicles/:id', auth, requireRole('manager'), updateVehicle)
router.patch('/vehicles/:id/return', auth, requireRole('manager'), returnToFleet)
router.patch('/vehicles/:id/withdraw', auth, requireRole('manager'), withdrawFromFleet)
router.delete('/vehicles/:id', auth, requireRole('manager'), deleteVehicle)

export default router
