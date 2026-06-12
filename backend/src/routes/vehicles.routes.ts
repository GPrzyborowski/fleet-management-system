import express from 'express'
import multer from 'multer'
import {
	getVehicles,
	addVehicle,
	updateVehicle,
	returnToFleet,
	withdrawFromFleet,
	deleteVehicle,
} from '../controllers/vehicles.controller'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/vehicles', getVehicles)
router.post(
	'/vehicles',
	upload.fields([
		{ name: 'frontImage', maxCount: 1 },
		{ name: 'leftImage', maxCount: 1 },
		{ name: 'rightImage', maxCount: 1 },
		{ name: 'backImage', maxCount: 1 },
	]),
	addVehicle,
)
router.patch('/vehicles/:id', updateVehicle)
router.patch('/vehicles/:id/return', returnToFleet)
router.patch('/vehicles/:id/withdraw', withdrawFromFleet)
router.delete('/vehicles/:id', deleteVehicle)

export default router
