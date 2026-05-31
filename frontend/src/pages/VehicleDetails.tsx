import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Header from '../components/Header'
import AssignmentsModal, { type Assignment } from '../components/AssignmentsModal'
import PageTransition from '../components/PageTransition'
import { API_URL } from '../config/api'

type AssignedDriver = {
	id: number
	users: {
		first_name: string
		last_name: string
	}
} | null

export default function VehicleDetails() {
	const token = localStorage.getItem('token')
	const [assignments, setAssignments] = useState<Assignment[]>([])
	const [assigned, setAssigned] = useState<AssignedDriver>(null)
	const [refreshTrigger, setRefreshTrigger] = useState(0)
	const { id } = useParams()
	const { state } = useLocation()
	const [vehicleStatus, setVehicleStatus] = useState(state.status)

	let statusFormatted = ''
	if (vehicleStatus === 'available') {
		statusFormatted = 'In fleet'
	} else if (vehicleStatus) {
		statusFormatted = 'Withdrawn'
	}

	const downloadImage = async (imageUrl: string) => {
		const res = await fetch(`${API_URL}/download?url=${encodeURIComponent(imageUrl)}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		const blob = await res.blob()
		const filename = imageUrl.split('/').pop() ?? 'image'
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = filename
		link.click()
		URL.revokeObjectURL(link.href)
	}

	const endAssignment = async () => {
		try {
			await fetch(`${API_URL}/assignments-end/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setRefreshTrigger(prev => prev + 1)
		} catch (err) {
			console.error(err)
		}
	}

	const returnToFleet = async () => {
		try {
			await fetch(`${API_URL}/vehicles/${id}/return`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` },
			})
			setVehicleStatus('available')
			setRefreshTrigger(prev => prev + 1)
		} catch (err) {
			console.error(err)
		}
	}

	const withdrawFromFleet = async () => {
		try {
			await fetch(`${API_URL}/vehicles/${id}/withdraw`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` },
			})
			setVehicleStatus('in_service')
			setRefreshTrigger(prev => prev + 1)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				const res = await fetch(`${API_URL}/assignments-vehicle/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await res.json()
				setAssignments(res.ok ? data.assignments : [])
				setAssigned(res.ok ? data.assigned : null)
			} catch (err) {
				console.error(err)
			}
		}

		fetchAssignments()
	}, [id, token, refreshTrigger])

	return (
		<PageTransition>
			<Header text="Vehicle details" />
			<div className="mx-4 md:mx-16 lg:mx-24">
				<table className="w-full text-base">
					<thead>
						<tr>
							<th className="pb-4 text-left text-2xl font-semibold text-base-content w-1/4">Vehicle Information</th>
							<th className="pb-4 text-left text-base-content/50 font-normal w-1/4"></th>
							<th className="pb-4 text-left text-2xl font-semibold text-base-content w-1/4">Actions</th>
							<th className="pb-4 w-1/4"></th>
						</tr>
					</thead>
					<tbody className="border-t border-base-content/25">
						<tr>
							<td className="py-5 font-medium text-base-content">Brand and model</td>
							<td className="py-5 text-base-content/80">
								{state.brand ?? '-'} {state.model ?? '-'}
							</td>
							<td className="py-5 font-medium text-base-content">Issues</td>
							<td className="py-5 flex gap-2">
								{vehicleStatus === 'unavailable' ? (
									<span className="badge badge-soft badge-error text-xs">Not Applicable - withdrawn</span>
								) : (
									<>
										{' '}
										<span className="badge badge-soft badge-success">
											<span className="icon-[tabler--circle-check] size-4"></span>
											Everything OK
										</span>
										<button className="btn btn-soft btn-warning btn-sm">
											<span className="icon-[tabler--alert-triangle] size-4"></span>
											Issue
										</button>
									</>
								)}
							</td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">License plate</td>
							<td className="py-5 text-base-content/80">{state.licensePlate ?? '-'}</td>
							<td className="py-5 font-medium text-base-content">Availability</td>
							<td className="py-5">
								{vehicleStatus === 'available' ? (
									<button className="btn btn-soft btn-sm" onClick={withdrawFromFleet}>
										<span className="icon-[tabler--arrow-back] size-4"></span>
										Withdraw from Fleet
									</button>
								) : (
									<button className="btn btn-soft btn-sm" onClick={returnToFleet}>
										<span className="icon-[tabler--arrow-back] size-4"></span>
										Return to Fleet
									</button>
								)}
							</td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">Year</td>
							<td className="py-5 text-base-content/80">{state.year ?? '-'}</td>
							<td className="py-5 font-medium text-base-content">Incident History</td>
							<td className="py-5">
								<button className="btn btn-soft btn-sm">
									<span className="icon-[tabler--history] size-4"></span>
									View History
								</button>
							</td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">Mileage</td>
							<td className="py-5 text-base-content/80">{state.mileage ? `${state.mileage} km` : `-`}</td>
							<td className="py-5 font-medium text-base-content">Assignment Log</td>
							<td className="py-5">
								<AssignmentsModal assignments={assignments} vehicleId={id} downloadHandler={downloadImage} />
							</td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">Fuel level</td>
							<td className="py-5 text-base-content/80">{state.fuelLevel ? `${state.fuelLevel}%` : `-`}</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">Status</td>
							<td className="py-5 text-base-content/80 capitalize">{statusFormatted || '-'}</td>
							<td></td>
							<td></td>
						</tr>
						{vehicleStatus === 'available' ? (
							<tr>
								<td className="py-5 font-medium text-base-content">Assigned to</td>
								<td className="py-5 text-base-content/80 flex items-center gap-4">
									{assigned ? `${assigned.users.first_name} ${assigned.users.last_name}` : 'Not assigned'}
									{assigned && (
										<button className="btn btn-soft btn-error btn-sm" onClick={endAssignment}>
											<span className="icon-[tabler--user-minus] size-4"></span>
											End
										</button>
									)}
								</td>
								<td></td>
								<td></td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</PageTransition>
	)
}
