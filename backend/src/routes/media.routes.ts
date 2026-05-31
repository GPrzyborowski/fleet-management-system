import express from 'express'
import { downloadImg } from '../controllers/media.controller'
const router = express.Router()

router.get('/download', downloadImg)

export default router
