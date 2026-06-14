import express from 'express'
import auth from '../middleware/auth'
import requireRole from '../middleware/requireRole'
import { upload, uploadDashboardImage, returnVehicle } from '../controllers/return.controller'
import { getVehicleIncidents, resolveIncident, withdrawForIncident } from '../controllers/incidents.controller'

const router = express.Router()

/**
 * @swagger
 * /assignments/dashboard-image:
 *   post:
 *     summary: Upload dashboard image for OCR processing
 *     description: Uploads a dashboard photo to Cloudinary and queues an OCR job. The result (mileage and fuel level) is sent back to the client via WebSocket.
 *     tags: [Return]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - socketId
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Dashboard photo
 *               socketId:
 *                 type: string
 *                 description: Socket.IO client ID for sending OCR result back
 *     responses:
 *       200:
 *         description: Image uploaded successfully, OCR job queued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: https://res.cloudinary.com/example/image/upload/v123/dashboards/abc.jpg
 *       400:
 *         description: No file provided
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - driver role required
 *       500:
 *         description: Server error
 */
router.post('/assignments/dashboard-image', auth, requireRole('driver'), upload.single('image'), uploadDashboardImage)

/**
 * @swagger
 * /assignments/return/{assignmentId}:
 *   post:
 *     summary: Return a vehicle
 *     description: Uploads 4 vehicle photos, updates assignment and vehicle status, and queues an AI damage detection job comparing photos with base reference images.
 *     tags: [Return]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - mileage
 *               - fuelLevel
 *             properties:
 *               mileage:
 *                 type: integer
 *                 example: 150500
 *               fuelLevel:
 *                 type: integer
 *                 example: 75
 *               dashboardImageUrl:
 *                 type: string
 *                 description: URL of the previously uploaded dashboard image
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
 *       200:
 *         description: Vehicle returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid assignment ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - driver role required
 *       500:
 *         description: Server error
 */
router.post(
	'/assignments/return/:assignmentId',
	auth,
	requireRole('driver'),
	upload.fields([
		{ name: 'frontImage', maxCount: 1 },
		{ name: 'leftImage', maxCount: 1 },
		{ name: 'rightImage', maxCount: 1 },
		{ name: 'backImage', maxCount: 1 },
	]),
	returnVehicle,
)

/**
 * @swagger
 * /vehicles/{id}/incidents:
 *   get:
 *     summary: Get pending incidents for a vehicle
 *     tags: [Incidents]
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
 *         description: List of pending incidents with images
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
 *                     example: pending
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
router.get('/vehicles/:id/incidents', auth, requireRole('manager'), getVehicleIncidents)

/**
 * @swagger
 * /incidents/{id}/resolve:
 *   patch:
 *     summary: Resolve an incident
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Incident ID
 *     responses:
 *       200:
 *         description: Incident resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid incident ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/incidents/:id/resolve', auth, requireRole('manager'), resolveIncident)

/**
 * @swagger
 * /incidents/{id}/withdraw:
 *   patch:
 *     summary: Withdraw vehicle from fleet due to incident
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Incident ID
 *     responses:
 *       200:
 *         description: Incident withdrawn and vehicle status set to in_service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid incident ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/incidents/:id/withdraw', auth, requireRole('manager'), withdrawForIncident)

export default router
