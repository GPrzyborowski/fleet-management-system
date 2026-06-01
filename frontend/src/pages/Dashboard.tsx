import { useState, useEffect, useMemo, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import PageTransition from '../components/PageTransition'
import Header from '../components/Header'
import ActionCard from '../components/ActionCard'
import ActiveAssignmentsTable from '../components/ActiveAssignmentsTable'
import { API_URL } from '../config/api'

interface TokenPayload {
	id: number
	login: string
	role: string
	exp: number
}

interface Vehicle {
	brand: string
	license_plate: string
	model: string
}

interface Assignment {
	dashboard_image_url: string
	driver_id: number
	end_fuel_level: number | null
	end_mileage: number | null
	end_time: string | null
	id: number
	start_fuel_level: number
	start_mileage: number
	start_time: string
	status: string
	vehicle_id: number
	vehicles: Vehicle
}

export default function Dashboard() {
	const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([])
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

	const getActiveAssignments = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/assignments`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()
			setActiveAssignments(res.ok ? data : [])
		} catch (err) {
			console.error(err)
		}
	}, [token])

	useEffect(() => {
		if (role == 'driver') {
			getActiveAssignments()
		}
	}, [role, getActiveAssignments])

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
			{role == 'driver' && (
				<>
					<ActiveAssignmentsTable activeAssignments={activeAssignments} />
				</>
			)}
		</PageTransition>
	)
}
