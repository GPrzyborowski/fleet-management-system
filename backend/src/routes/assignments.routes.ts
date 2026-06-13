import express from 'express'
import auth from '../middleware/auth'
import {
	getAssignmentsForVehicle,
	endAssignment,
	getActiveAssignmentsForEmployee,
	takeVehicle,
	getAvailableVehicles,
} from '../controllers/assignments.controller'

const router = express.Router()

router.get('/assignments-vehicle/:id', getAssignmentsForVehicle)
router.patch('/assignments-end/:id', endAssignment)
router.get('/assignments', auth, getActiveAssignmentsForEmployee)
router.get('/vehicles/available', auth, getAvailableVehicles)
router.post('/assignments/take/:vehicleId', auth, takeVehicle)

export default router
