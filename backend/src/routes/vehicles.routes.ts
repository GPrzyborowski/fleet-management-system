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

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles ordered by status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   license_plate:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year_of_manufacture:
 *                     type: integer
 *                   current_mileage:
 *                     type: integer
 *                   current_fuel_level:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [available, in_use, in_service]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.get('/vehicles', auth, requireRole('manager'), getVehicles)

/**
 * @swagger
 * /vehicles/{id}/incidents/all:
 *   get:
 *     summary: Get all incidents for a vehicle (all statuses)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: List of all incidents with images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   ai_description:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, resolved, withdrawn]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   vehicle_incident_images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         side:
 *                           type: string
 *                         image_url:
 *                           type: string
 *                         image_type:
 *                           type: string
 *                           enum: [base, new]
 *       400:
 *         description: Invalid vehicle ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.get('/vehicles/:id/incidents/all', auth, requireRole('manager'), getAllVehicleIncidents)

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Add a new vehicle with optional base reference photos
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - licensePlate
 *               - brand
 *               - model
 *               - year
 *               - mileage
 *               - fuelLevel
 *               - status
 *             properties:
 *               licensePlate:
 *                 type: string
 *                 example: GD 12345
 *               brand:
 *                 type: string
 *                 example: Volvo
 *               model:
 *                 type: string
 *                 example: FH16
 *               year:
 *                 type: integer
 *                 example: 2020
 *               mileage:
 *                 type: integer
 *                 example: 150000
 *               fuelLevel:
 *                 type: integer
 *                 example: 80
 *               status:
 *                 type: string
 *                 enum: [available, in_service]
 *                 example: available
 *               frontImage:
 *                 type: string
 *                 format: binary
 *               leftImage:
 *                 type: string
 *                 format: binary
 *               rightImage:
 *                 type: string
 *                 format: binary
 *               backImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New vehicle was successfully added to database.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /vehicles/{id}:
 *   patch:
 *     summary: Update vehicle data
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle updated successfully.
 *       400:
 *         description: Invalid vehicle ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/vehicles/:id', auth, requireRole('manager'), updateVehicle)

/**
 * @swagger
 * /vehicles/{id}/return:
 *   patch:
 *     summary: Return vehicle to fleet (set status to available)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle returned to fleet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle returned to fleet.
 *       400:
 *         description: Invalid vehicle ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/vehicles/:id/return', auth, requireRole('manager'), returnToFleet)

/**
 * @swagger
 * /vehicles/{id}/withdraw:
 *   patch:
 *     summary: Withdraw vehicle from fleet (set status to in_service)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle withdrawn from fleet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle withdrawed from fleet.
 *       400:
 *         description: Invalid vehicle ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/vehicles/:id/withdraw', auth, requireRole('manager'), withdrawFromFleet)

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle and its assignments
 *     description: Deletes the vehicle, all its assignments, and any dismissed drivers with no remaining assignments.
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle deleted.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.delete('/vehicles/:id', auth, requireRole('manager'), deleteVehicle)

export default router
