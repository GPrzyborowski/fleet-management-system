import ActiveAssignmentsRow from './ActiveAssignmentsRow'

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

interface Props {
	activeAssignments: Assignment[]
	onReturn: () => void
}

export default function ActiveAssignmentsTable({ activeAssignments, onReturn }: Props) {
	return (
		<div className="w-full px-4 sm:px-12 lg:px-24 xl:px-32 overflow-x-auto flex flex-col justify-center">
			<h2 className="text-2xl font-medium tracking-tight text-base-content mb-10 text-center">
				Your active assignments
			</h2>
			<table className="table w-full max-w-4xl mx-auto">
				<thead>
					<tr>
						<th>License plate</th>
						<th>Brand and model</th>
						<th>Start time</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{activeAssignments.map(assignment => (
						<ActiveAssignmentsRow
							key={assignment.id}
							id={assignment.id}
							licensePlate={assignment.vehicles.license_plate}
							brand={assignment.vehicles.brand}
							model={assignment.vehicles.model}
							startDate={assignment.start_time}
							onReturn={onReturn}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}
