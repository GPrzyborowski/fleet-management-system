import { useState, useEffect } from 'react'
import Header from '../components/Header'
import VehicleRow from '../components/VehicleRow'
import NewVehicleModal from '../components/NewVehicleModal'
import PageTransition from '../components/PageTransition'
import { API_URL } from '../config/api'

type Vehicle = {
	id: number
	license_plate: string
	brand: string
	model: string
	year_of_manufacture: number
	current_mileage: number
	current_fuel_level: number
	status: string
}

export default function Vehicles() {
	const token = localStorage.getItem('token')
	const [vehicles, setVehicles] = useState<Vehicle[]>([])
	const [pending, setPending] = useState(true)
	const [refreshTrigger, setRefreshTrigger] = useState(0)

	useEffect(() => {
		const getVehicles = async () => {
			try {
				const res = await fetch(`${API_URL}/vehicles`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				const data = await res.json()
				setVehicles(res.ok ? data : [])
				setPending(false)
			} catch (err) {
				console.error(err)
				setPending(false)
			}
		}
		getVehicles()
	}, [refreshTrigger, token])

	const addVehicle = async (body: FormData) => {
		try {
			const res = await fetch(`${API_URL}/vehicles`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body,
			})
			if (res.ok) {
				const { HSOverlay } = await import('flyonui/flyonui')
				HSOverlay.close('#new-vehicle-modal')
			}
		} catch (err) {
			console.error(err)
		}
	}

	const updateVehicle = async (
		id: number,
		licensePlate: string,
		brand: string,
		model: string,
		year: number,
		status: string,
	) => {
		try {
			const res = await fetch(`${API_URL}/vehicles/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ licensePlate, brand, model, year, status }),
			})
			if (res.ok) {
				const { HSOverlay } = await import('flyonui/flyonui')
				HSOverlay.close(`#edit-vehicle-modal-${id}`)
			}
		} catch (err) {
			console.error(err)
		}
	}

	const removeVehicle = async (id: number) => {
		try {
			const res = await fetch(`${API_URL}/vehicles/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` },
			})
			if (res.ok) {
				setVehicles(prev => prev.filter(veh => veh.id !== id))
			}
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<PageTransition>
			<Header text="Vehicles" />
			<div className="w-full px-4 sm:px-12 lg:px-24 xl:px-32 overflow-x-auto flex flex-col justify-center">
				{pending ? (
					<div className="flex justify-center">
						<span className="loading loading-spinner loading-xl"></span>
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<NewVehicleModal addHandler={addVehicle} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />
						</div>
						<table className="table">
							<thead>
								<tr>
									<th>License plate</th>
									<th>Brand and model</th>
									<th>Year</th>
									<th>Mileage</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{vehicles.map(vehicle => (
									<VehicleRow
										key={vehicle.id}
										id={vehicle.id}
										licensePlate={vehicle.license_plate}
										brand={vehicle.brand}
										model={vehicle.model}
										year={vehicle.year_of_manufacture}
										mileage={vehicle.current_mileage}
										fuelLevel={vehicle.current_fuel_level}
										status={vehicle.status}
										removeHandler={removeVehicle}
										updateHandler={updateVehicle}
										onUpdate={() => setRefreshTrigger(prev => prev + 1)}
									/>
								))}
							</tbody>
						</table>
					</>
				)}
			</div>
		</PageTransition>
	)
}
