import express from 'express'
import {
	getVehicles,
	addVehicle,
	updateVehicle,
	returnToFleet,
    withdrawFromFleet,
	deleteVehicle,
} from '../controllers/vehicles.controller'

const router = express.Router()

router.get('/vehicles', getVehicles)
router.post('/vehicles', addVehicle)
router.patch('/vehicles/:id', updateVehicle)
router.patch('/vehicles/:id/return', returnToFleet)
router.patch('/vehicles/:id/withdraw', withdrawFromFleet)
router.delete('/vehicles/:id', deleteVehicle)

export default router
