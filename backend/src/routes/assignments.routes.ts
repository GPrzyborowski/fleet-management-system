import express from 'express'
import auth from '../middleware/auth'
import { getAssignmentsForVehicle, endAssignment, getActiveAssignmentsForEmployee } from '../controllers/assignments.controller'

const router = express.Router()

router.get('/assignments-vehicle/:id', getAssignmentsForVehicle)
router.patch('/assignments-end/:id', endAssignment)
router.get('/assignments', auth, getActiveAssignmentsForEmployee)

export default router
