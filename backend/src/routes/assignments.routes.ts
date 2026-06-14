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

/**
 * @swagger
 * /assignments-vehicle/{id}:
 *   get:
 *     summary: Get all assignments and current driver for a vehicle
 *     tags: [Assignments]
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
 *         description: Object with assignments array and assigned driver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       start_time:
 *                         type: string
 *                         format: date-time
 *                       end_time:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       users:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                 assigned:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.get('/assignments-vehicle/:id', auth, requireRole('manager'), getAssignmentsForVehicle)

/**
 * @swagger
 * /assignments-end/{id}:
 *   patch:
 *     summary: End active assignment for a vehicle
 *     tags: [Assignments]
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
 *         description: Assignment ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignment ended.
 *       400:
 *         description: Invalid vehicle ID
 *       404:
 *         description: No active assignment found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/assignments-end/:id', auth, requireRole('manager'), endAssignment)

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get active assignments for the logged-in driver
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active assignments with vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   vehicles:
 *                     type: object
 *                     properties:
 *                       license_plate:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       model:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - driver role required
 *       500:
 *         description: Server error
 */
router.get('/assignments', auth, requireRole('driver'), getActiveAssignmentsForEmployee)

/**
 * @swagger
 * /vehicles/available:
 *   get:
 *     summary: Get all available vehicles
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available vehicles
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
 *                   current_mileage:
 *                     type: integer
 *                   current_fuel_level:
 *                     type: integer
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - driver role required
 *       500:
 *         description: Server error
 */
router.get('/vehicles/available', auth, requireRole('driver'), getAvailableVehicles)

/**
 * @swagger
 * /assignments/take/{vehicleId}:
 *   post:
 *     summary: Take a vehicle as a driver
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       201:
 *         description: Vehicle assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle assigned successfully.
 *       400:
 *         description: Invalid vehicle ID
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Vehicle not available or driver already has active assignment
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - driver role required
 *       500:
 *         description: Server error
 */
router.post('/assignments/take/:vehicleId', auth, requireRole('driver'), takeVehicle)

export default router
