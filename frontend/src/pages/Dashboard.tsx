import { useState, useEffect, useMemo, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import PageTransition from '../components/PageTransition'
import Header from '../components/Header'
import ActionCard from '../components/ActionCard'
import ActiveAssignmentsTable from '../components/ActiveAssignmentsTable'
import VehicleCard from '../components/VehicleCard'
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

interface AvailableVehicle {
	id: number
	license_plate: string
	brand: string
	model: string
	current_fuel_level: number
}

export default function Dashboard() {
	const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([])
	const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicle[]>([])
	const token = localStorage.getItem('token')

	const decoded = useMemo(() => {
		if (!token) return
		try {
			return jwtDecode<TokenPayload>(token)
		} catch (err) {
			console.error(err)
			return null
		}
	}, [token])

	const login = decoded?.login ?? ''
	const role = decoded?.role ?? ''

	const getActiveAssignments = useCallback(
		(signal: AbortSignal) => {
			fetch(`${API_URL}/assignments`, {
				headers: { Authorization: `Bearer ${token}` },
				signal,
			})
				.then(res => res.json().then((data: Assignment[]) => ({ ok: res.ok, data })))
				.then(({ ok, data }) => setActiveAssignments(ok ? data : []))
				.catch(err => {
					if ((err as Error).name !== 'AbortError') console.error(err)
				})
		},
		[token],
	)

	const getAvailableVehicles = useCallback(
		(signal: AbortSignal) => {
			fetch(`${API_URL}/vehicles/available`, {
				headers: { Authorization: `Bearer ${token}` },
				signal,
			})
				.then(res => res.json().then((data: AvailableVehicle[]) => ({ ok: res.ok, data })))
				.then(({ ok, data }) => setAvailableVehicles(ok ? data : []))
				.catch(err => {
					if ((err as Error).name !== 'AbortError') console.error(err)
				})
		},
		[token],
	)

	const takeVehicle = async (vehicleId: number) => {
		try {
			const res = await fetch(`${API_URL}/assignments/take/${vehicleId}`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
			})
			if (res.ok) {
				const controller = new AbortController()
				getActiveAssignments(controller.signal)
				getAvailableVehicles(controller.signal)
			}
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		if (role !== 'driver') return
		const controller = new AbortController()
		getActiveAssignments(controller.signal)
		getAvailableVehicles(controller.signal)
		return () => controller.abort()
	}, [role, getActiveAssignments, getAvailableVehicles])

	return (
		<PageTransition>
			<Header text={`Hello ${login}`} />
			{role === 'manager' && (
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
			{role === 'driver' && (
				<div className="flex flex-col gap-12">
					{activeAssignments.length > 0 && (
						<ActiveAssignmentsTable
							activeAssignments={activeAssignments}
							onReturn={() => getActiveAssignments(new AbortController().signal)}
						/>
					)}
					{availableVehicles.length > 0 && (
						<div className="w-full mb-12 px-4 sm:px-12 lg:px-24 xl:px-32">
							<h2 className="text-2xl font-medium tracking-tight text-base-content mb-10 text-center">
								Available vehicles
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
								{availableVehicles.map(vehicle => (
									<VehicleCard
										key={vehicle.id}
										id={vehicle.id}
										licensePlate={vehicle.license_plate}
										brand={vehicle.brand}
										model={vehicle.model}
										fuelLevel={vehicle.current_fuel_level}
										onTake={takeVehicle}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</PageTransition>
	)
}
