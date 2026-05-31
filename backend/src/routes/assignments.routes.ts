import express from 'express'
import { getAssignmentsForVehicle, endAssignment } from '../controllers/assignments.controller'

const router = express.Router()

router.get('/assignments-vehicle/:id', getAssignmentsForVehicle)
router.patch('/assignments-end/:id', endAssignment)

export default router
