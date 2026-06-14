import express from 'express'
import { forgotPassword } from '../controllers/forgot-password.controller'
import { resetPassword } from '../controllers/reset-password.controller'

const router = express.Router()

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Password]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@fleetms.com
 *     responses:
 *       200:
 *         description: Always returns the same message regardless of whether the email exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: If this email is correct, password reset link will be sent.
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', forgotPassword)

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Password]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token received in the reset email
 *                 example: a1b2c3d4e5f6...
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password has been reset. You can now log in.
 *       400:
 *         description: Token is invalid or has expired
 *       500:
 *         description: Server error
 */
router.post('/reset-password', resetPassword)

export default router
