import express from 'express'
import auth from '../middleware/auth'
import requireRole from '../middleware/requireRole'
import {
	getAssignmentsForVehicle,
	endAssignment,
	getActiveAssignmentsForEmployee,
	takeVehicle,
	getAvailableVehicles,
} from '../controllers/assignments.controller'

const router = express.Router()

router.get('/assignments-vehicle/:id', auth, requireRole('manager'), getAssignmentsForVehicle)
router.patch('/assignments-end/:id', auth, requireRole('manager'), endAssignment)
router.get('/assignments', auth, requireRole('driver'), getActiveAssignmentsForEmployee)
router.get('/vehicles/available', auth, requireRole('driver'), getAvailableVehicles)
router.post('/assignments/take/:vehicleId', auth, requireRole('driver'), takeVehicle)

export default router
