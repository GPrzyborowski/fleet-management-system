import express from 'express'
import auth from '../middleware/auth'
import {
	addEmployee,
	getEmployees,
	getEmployee,
	updateEmployee,
	removeEmployee,
} from '../controllers/employees.controller'

const router = express.Router()

router.post('/employees', auth, addEmployee)
router.get('/employees', auth, getEmployees)
router.get('/employees/:id', auth, getEmployee)
router.patch('/employees/:id', auth, updateEmployee)
router.patch('/employees/:id/remove', auth, removeEmployee)

export default router
