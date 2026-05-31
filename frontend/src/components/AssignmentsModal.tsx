import { useState } from 'react'
import AssignmentRow from './AssignmentRow'

export type Assignment = {
	id: number
	vehicle_id: number
	driver_id: number
	start_time: string
	end_time: string | null
	start_mileage: number
	end_mileage: number | null
	start_fuel_level: number
	end_fuel_level: number | null
	dashboard_image_url: string | null
	status: string
	users: {
		first_name: string
		last_name: string
	}
}

type Props = {
	assignments: Assignment[]
	vehicleId: string | undefined
}

export default function AssignmentsModal({ assignments }: Props) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<button type="button" className="btn btn-soft btn-sm" onClick={() => setIsOpen(true)}>
				<span className="icon-[tabler--users] size-4"></span>
				View Assignments
			</button>

			<div
				className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
					isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
				}`}>
				<div
					className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
						isOpen ? 'opacity-100' : 'opacity-0'
					}`}
					onClick={() => setIsOpen(false)}
				/>

				<div
					className={`relative z-10 bg-base-100 rounded-lg shadow-xl w-full max-w-7xl mx-4 transition-all duration-300 ${
						isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
					}`}>
					<div className="p-4 border-b border-base-content/25 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Assignment Log</h3>
						<button type="button" className="btn btn-text btn-circle btn-sm" onClick={() => setIsOpen(false)}>
							<span className="icon-[tabler--x] size-4"></span>
						</button>
					</div>

					<div className="p-4 max-h-96 overflow-y-auto overflow-x-auto">
						<table className="w-full text-sm min-w-max">
							<thead>
								<tr className="border-b border-base-content/25">
									<th className="pb-3 text-left font-medium text-base-content min-w-32">Employee</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-36">From</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-36">To</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-28">Start mileage</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-24">End mileage</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-24">Start fuel level</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-24">End fuel level</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-24">Dashboard</th>
									<th className="pb-3 text-left font-medium text-base-content min-w-24">Status</th>
								</tr>
							</thead>

							<tbody>
								{assignments.map(assignment => (
									<AssignmentRow key={assignment.id} {...assignment} />
								))}
							</tbody>
						</table>
					</div>

					<div className="p-4 border-t border-base-content/25 flex justify-end">
						<button type="button" className="btn btn-soft btn-secondary" onClick={() => setIsOpen(false)}>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
