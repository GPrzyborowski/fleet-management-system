import express from 'express'
import { getVehicles, updateVehicle, deleteVehicle } from '../controllers/vehicles.controller'

const router = express.Router()

router.get('/vehicles', getVehicles)
router.delete('/vehicles/:id', deleteVehicle)
router.patch('/vehicles/:id', updateVehicle)

export default router
