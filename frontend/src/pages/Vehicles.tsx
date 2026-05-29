import { useState, useEffect } from 'react'
import Header from '../components/Header'
import VehicleRow from '../components/VehicleRow'
import PageTransition from '../components/PageTransition'
import { API_URL } from '../config/api'

type Vehicle = {
	id: number
	license_plate: string
	brand: string
	model: string
	year_of_manufacture: string
	current_mileage: number
	status: string
}

export default function Vehicles() {
	const token = localStorage.getItem('token')
	const [vehicles, setVehicles] = useState<Vehicle[]>([])
	const [pending, setPending] = useState(true)
	const [refreshTrigger, setRefreshTrigger] = useState(0)

	useEffect(() => {
		const getEmployees = async () => {
			try {
				const res = await fetch(`${API_URL}/vehicles`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await res.json()
				setVehicles(res.ok ? data : [])
				setPending(false)
			} catch (err) {
				console.error(err)
				setPending(false)
			}
		}
		getEmployees()
	}, [refreshTrigger, token])

	const updateVehicle = async (
		id: number,
		licensePlate: string,
		brand: string,
		model: string,
		year: string,
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
				setVehicles(prev => prev.filter(veh => veh.id != id))
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
								{vehicles.map(vehicle => {
									return (
										<VehicleRow
											key={vehicle.id}
											id={vehicle.id}
											licensePlate={vehicle.license_plate}
											brand={vehicle.brand}
											model={vehicle.model}
											year={vehicle.year_of_manufacture}
											mileage={vehicle.current_mileage}
											status={vehicle.status}
											removeHandler={removeVehicle}
											updateHandler={updateVehicle}
											onUpdate={() => setRefreshTrigger(prev => prev + 1)}
										/>
									)
								})}
							</tbody>
						</table>
					</>
				)}
			</div>
		</PageTransition>
	)
}
