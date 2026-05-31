import express from 'express'
import { getAssignmentsForVehicle } from '../controllers/assignments.controller'

const router = express.Router()

router.get('/assignments-vehicle/:id', getAssignmentsForVehicle)

export default router
