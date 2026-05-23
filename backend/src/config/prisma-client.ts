import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma'

const adapter = new PrismaPg(process.env.DATABASE_URL as string)

const prisma = new PrismaClient({
	adapter,
	log: ['query', 'info', 'warn', 'error'],
})

export default prisma
