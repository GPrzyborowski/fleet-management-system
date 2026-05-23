import { Request, Response } from 'express'
import prisma from '../config/prisma-client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

type LoginData = {
	login: string
	password: string
}

export const login = async (req: Request, res: Response) => {
	const { login, password }: LoginData = req.body

	const user = await prisma.users.findUnique({ where: { login: login } })
	if (!user) {
		return res.status(400).json({ error: 'Invalid login or password.' })
	}
	const valid = await bcrypt.compare(password, user.password_hash)
	if (!valid) {
		return res.status(400).json({ error: 'Invalid login or password.' })
	}
	const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET as string, { expiresIn: '45m' })
	res.json({ token })
}
