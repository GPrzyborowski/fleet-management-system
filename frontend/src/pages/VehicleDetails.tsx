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

type IncidentImage = {
	id: number
	side: string
	azure_blob_url: string
	image_type: string
}

type Incident = {
	id: number
	ai_description: string
	created_at: string
	vehicle_incident_images: IncidentImage[]
}

export default function VehicleDetails() {
	const token = localStorage.getItem('token')
	const [assignments, setAssignments] = useState<Assignment[]>([])
	const [assigned, setAssigned] = useState<AssignedDriver>(null)
	const [refreshTrigger, setRefreshTrigger] = useState(0)
	const { id } = useParams()
	const { state } = useLocation()
	const [vehicleStatus, setVehicleStatus] = useState(state.status)
	const [incidents, setIncidents] = useState<Incident[]>([])
	const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

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
				headers: { Authorization: `Bearer ${token}` },
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

	const resolveIncident = async (incidentId: number) => {
		try {
			await fetch(`${API_URL}/incidents/${incidentId}/resolve`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` },
			})
			setSelectedIncident(null)
			setRefreshTrigger(prev => prev + 1)
		} catch (err) {
			console.error(err)
		}
	}

	const withdrawForIncident = async (incidentId: number) => {
		try {
			await fetch(`${API_URL}/incidents/${incidentId}/withdraw`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` },
			})
			setSelectedIncident(null)
			setVehicleStatus('in_service')
			setRefreshTrigger(prev => prev + 1)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		const fetchIncidents = async () => {
			try {
				const res = await fetch(`${API_URL}/vehicles/${id}/incidents`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				const data = await res.json()
				setIncidents(res.ok ? data : [])
			} catch (err) {
				console.error(err)
			}
		}
		fetchIncidents()
	}, [id, token, refreshTrigger])

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				const res = await fetch(`${API_URL}/assignments-vehicle/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
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
							<td className="py-5 flex gap-2 flex-wrap">
								{vehicleStatus === 'in_service' ? (
									<span className="badge badge-soft badge-error text-xs">Not applicable - withdrawn</span>
								) : incidents.length > 0 ? (
									incidents.map(incident => (
										<button
											key={incident.id}
											className="btn btn-soft btn-warning btn-sm"
											onClick={() => setSelectedIncident(incident)}>
											<span className="icon-[tabler--alert-triangle] size-4" />
											Damage detected
										</button>
									))
								) : (
									<span className="badge badge-soft badge-success">
										<span className="icon-[tabler--circle-check] size-4" />
										Everything OK
									</span>
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
										<span className="icon-[tabler--arrow-back] size-4" />
										Withdraw from Fleet
									</button>
								) : (
									<button className="btn btn-soft btn-sm" onClick={returnToFleet}>
										<span className="icon-[tabler--arrow-back] size-4" />
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
									<span className="icon-[tabler--history] size-4" />
									View History
								</button>
							</td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">Mileage</td>
							<td className="py-5 text-base-content/80">{state.mileage ? `${state.mileage} km` : '-'}</td>
							<td className="py-5 font-medium text-base-content">Assignment Log</td>
							<td className="py-5">
								<AssignmentsModal assignments={assignments} vehicleId={id} downloadHandler={downloadImage} />
							</td>
						</tr>
						<tr>
							<td className="py-5 font-medium text-base-content">Fuel level</td>
							<td className="py-5 text-base-content/80">{state.fuelLevel ? `${state.fuelLevel}%` : '-'}</td>
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
											<span className="icon-[tabler--user-minus] size-4" />
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

			{selectedIncident && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="fixed inset-0 bg-black/50" onClick={() => setSelectedIncident(null)} />
					<div className="relative z-10 bg-base-100 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
						<div className="flex items-start justify-between">
							<h3 className="text-lg font-semibold">Damage Report</h3>
							<button
								type="button"
								className="btn btn-text btn-circle btn-sm"
								onClick={() => setSelectedIncident(null)}>
								<span className="icon-[tabler--x] size-4" />
							</button>
						</div>
						<p className="text-base-content/80">{selectedIncident.ai_description}</p>
						<div className="grid grid-cols-2 gap-3">
							{selectedIncident.vehicle_incident_images.map(img => (
								<div key={img.id}>
									<p className="text-xs text-base-content/50 mb-1 capitalize">
										{img.image_type === 'base' ? 'Reference' : 'After trip'} - {img.side}
									</p>
									<img
										src={img.azure_blob_url}
										alt={`${img.image_type} ${img.side}`}
										className="rounded w-full object-cover aspect-video"
									/>
								</div>
							))}
						</div>
						<div className="flex justify-end gap-2 pt-2 border-t border-base-content/25">
							<button
								type="button"
								className="btn btn-soft btn-success btn-sm"
								onClick={() => resolveIncident(selectedIncident.id)}>
								<span className="icon-[tabler--circle-check] size-4" />
								Mark as OK
							</button>
							<button
								type="button"
								className="btn btn-soft btn-error btn-sm"
								onClick={() => withdrawForIncident(selectedIncident.id)}>
								<span className="icon-[tabler--arrow-back] size-4" />
								Withdraw from Fleet
							</button>
						</div>
					</div>
				</div>
			)}
		</PageTransition>
	)
}
