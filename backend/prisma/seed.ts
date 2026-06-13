import prisma from '../src/config/prisma-client'
import bcrypt from 'bcrypt'

async function main() {
	const password_hash = await bcrypt.hash('admin', 10)

	await prisma.users.createMany({
		data: [
			{
				login: 'admin',
				first_name: 'Admin',
				last_name: 'User',
				email: 'isitestuser@proton.me',
				password_hash,
				phone_number: '123456789',
				role: 'manager',
				is_active: false,
				is_employed: true,
			},
			{
				login: 'jkowalski',
				first_name: 'Jan',
				last_name: 'Kowalski',
				email: 'jkowalski@isiprojekt.com',
				password_hash,
				phone_number: '987654321',
				role: 'driver',
				is_active: false,
				is_employed: true,
			},
			{
				login: 'anowak',
				first_name: 'Anna',
				last_name: 'Nowak',
				email: 'anowak@isiprojekt.com',
				password_hash,
				phone_number: '457914838',
				role: 'driver',
				is_active: false,
				is_employed: true,
			},
		],
		skipDuplicates: true,
	})
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
