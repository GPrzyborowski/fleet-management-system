import express from 'express'
import auth from '../middleware/auth'
import requireRole from '../middleware/requireRole'
import {
	addEmployee,
	getEmployees,
	getEmployee,
	updateEmployee,
	removeEmployee,
} from '../controllers/employees.controller'

const router = express.Router()

router.post('/employees', auth, requireRole('manager'), addEmployee)
router.get('/employees', auth, requireRole('manager'), getEmployees)
router.get('/employees/:id', auth, requireRole('manager'), getEmployee)
router.patch('/employees/:id', auth, requireRole('manager'), updateEmployee)
router.patch('/employees/:id/remove', auth, requireRole('manager'), removeEmployee)

export default router
