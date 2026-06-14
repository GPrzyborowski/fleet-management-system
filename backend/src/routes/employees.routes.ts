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

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               login:
 *                 type: string
 *                 example: jkowalski
 *               firstName:
 *                 type: string
 *                 example: Jan
 *               lastName:
 *                 type: string
 *                 example: Kowalski
 *               email:
 *                 type: string
 *                 example: jkowalski@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: 500100200
 *               role:
 *                 type: string
 *                 enum: [driver, manager]
 *                 example: driver
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New employee was successfully added to database.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.post('/employees', auth, requireRole('manager'), addEmployee)

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employed employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees (password_hash excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   login:
 *                     type: string
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   role:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 *                   is_employed:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.get('/employees', auth, requireRole('manager'), getEmployees)

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee data
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.get('/employees/:id', auth, requireRole('manager'), getEmployee)

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Update employee data
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [driver, manager]
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee updated successfully.
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/employees/:id', auth, requireRole('manager'), updateEmployee)

/**
 * @swagger
 * /employees/{id}/remove:
 *   patch:
 *     summary: Dismiss an employee (set is_employed to false)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee dismissed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee dismissed successfully.
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - manager role required
 *       500:
 *         description: Server error
 */
router.patch('/employees/:id/remove', auth, requireRole('manager'), removeEmployee)

export default router
