import express from 'express'
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicles.controller'

const router = express.Router()

router.get('/vehicles', getVehicles)
router.post('/vehicles', addVehicle)
router.delete('/vehicles/:id', deleteVehicle)
router.patch('/vehicles/:id', updateVehicle)

export default router
