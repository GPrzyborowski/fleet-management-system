declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number
				first_name: string
				last_name: string
				email: string
				role: string | null
			}
		}
	}
}

export {}
