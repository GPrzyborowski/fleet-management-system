import { Request, Response } from 'express'
import crypto from 'crypto'
import prisma from '../config/prisma-client'
import redis from '../config/redis-client'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email }: { email: string } = req.body

		const user = await prisma.users.findUnique({ where: { email: email } })
		if (!user) {
			return res.status(200).json({ message: 'If this email is correct, password reset link will be sent.' })
		}
		const token = crypto.randomBytes(32).toString('hex')
		await redis.set(`reset:${token}`, user.id, 'EX', 3600)

		await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL as string,
			to: email,
			subject: 'Fleet Management System | Password reset request',
			template: {
				id: process.env.RESEND_TEMPLATE_PASSWORD_RESET as string,
				variables: {
					reset_url: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
				},
			},
		})
		return res.status(200).json({ message: 'If this email is correct, password reset link will be sent.' })
	} catch (err) {
        console.error(err)
		return res.status(500).json({ error: 'Server error.' })
	}
}
