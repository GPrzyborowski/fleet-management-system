import express from 'express'
import { downloadImg } from '../controllers/media.controller'
import auth from '../middleware/auth'
const router = express.Router()

router.get('/download', auth, downloadImg)

export default router
