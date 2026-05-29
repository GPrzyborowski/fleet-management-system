import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/prisma-client'
import redis from '../config/redis-client'

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token, newPassword }: { token: string; newPassword: string } = req.body

		const userId = await redis.get(`reset:${token}`)
		if (!userId) {
			return res.status(400).json({ error: 'Token is invalid or has expired.' })
		}

		const hash = await bcrypt.hash(newPassword, 10)

		await prisma.users.update({
			where: { id: Number(userId) },
			data: { password_hash: hash },
		})

		await redis.del(`reset:${token}`)
		return res.status(200).json({ message: 'Password has been reset. You can now log in.' })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}
