import express from 'express'
import { login } from '../controllers/auth.controller'

const router = express()

router.post("/login", login)

export default router