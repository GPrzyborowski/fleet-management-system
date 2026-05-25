import { useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import PageTransition from '../components/PageTransition'
import Header from '../components/Header'
import ActionCard from '../components/ActionCard'

interface TokenPayload {
	id: number
	login: string
	role: string
	exp: number
}

export default function Dashboard() {
	const token = localStorage.getItem('token')
	const decoded = useMemo(() => {
		if (!token) {
			return
		}
		try {
			return jwtDecode<TokenPayload>(token)
		} catch (err) {
			console.error(err)
			return null
		}
	}, [token])

	const login = decoded?.login ?? ''
	const role = decoded?.role ?? ''

	return (
		<PageTransition>
			<Header text={`Hello ${login}`} />
			{role == 'manager' && (
				<div className="px-4 sm:px-12 md:px-18 lg:px-34 xl:px-54 xl:mt-34 grid grid-cols-1 gap-4 max-w-5xl mx-auto">
					<ActionCard
						title="Employees"
						description="Employees management panel."
						icon="icon-[tabler--user]"
						links="employees"
					/>
					<ActionCard
						title="Vehicles"
						description="Vehicles management panel."
						icon="icon-[tabler--truck]"
						links="vehicles"
					/>
				</div>
			)}
		</PageTransition>
	)
}
