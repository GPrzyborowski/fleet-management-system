import { Request, Response } from 'express'
import prisma from '../config/prisma-client'
import bcrypt from 'bcrypt'

export const addEmployee = async (req: Request, res: Response) => {
	const { login, firstName, lastName, email, password, phone, role } = req.body
	try {
		const password_hash = await bcrypt.hash(password, 10)
		await prisma.users.create({
			data: {
				login,
				first_name: firstName,
				last_name: lastName,
				email,
				password_hash,
				phone_number: phone,
				role,
			},
		})
		res.status(201).json({ message: 'New employee was successfully added to database.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const getEmployees = async (req: Request, res: Response) => {
	try {
		const employees = await prisma.users.findMany({
			where: {
				is_employed: true,
			},
			omit: {
				password_hash: true,
			},
		})
		res.status(200).json(employees)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const getEmployee = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	try {
		const employee = await prisma.users.findUnique({
			where: { id: id },
		})
		res.status(200).json(employee)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const updateEmployee = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	const { login, firstName, lastName, email, phone, role } = req.body
	try {
		await prisma.users.update({
			where: { id: id },
			data: {
				login: login,
				first_name: firstName,
				last_name: lastName,
				email: email,
				phone_number: phone,
				role: role,
			},
		})
		res.status(200).json({ message: 'Employee updated successfully.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}

export const removeEmployee = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	if (!id || isNaN(id)) {
		res.status(400).json({ message: 'Invalid data.' })
		return
	}
	try {
		await prisma.users.update({
			where: { id },
			data: { is_employed: false },
		})
		res.status(200).json({ message: 'Employee dismissed successfully.' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Server error.' })
	}
}
