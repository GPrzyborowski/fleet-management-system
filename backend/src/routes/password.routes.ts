import express from 'express'
import { forgotPassword } from '../controllers/forgot-password.controller'
import { resetPassword } from '../controllers/reset-password.controller'

const router = express.Router()

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
