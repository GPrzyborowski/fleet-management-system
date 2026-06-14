import express from 'express'
import { downloadImg } from '../controllers/media.controller'
import auth from '../middleware/auth'

const router = express.Router()

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Download an image from Cloudinary by URL
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary image URL to download
 *         example: https://res.cloudinary.com/example/image/upload/v123/dashboard.jpg
 *     responses:
 *       200:
 *         description: Image file as binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="dashboard.jpg"
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: image/jpeg
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/download', auth, downloadImg)

export default router
