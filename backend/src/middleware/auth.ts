import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from '../config/prisma-client'
import { Request, Response, NextFunction } from 'express'

const auth = async (req: Request, res: Response, next: NextFunction) => {
	const header = req.headers.authorization
	if (!header || !header.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Token not provided.' })
	}
	const token = header.split(' ')[1]

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
		const user = await prisma.users.findUnique({
			where: {
				id: decoded.id,
			},
		})
		if (!user) {
			return res.status(401).json({ error: 'User does not exist.' })
		}
		req.user = user
		next()
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token.' })
	}
}

export default auth
