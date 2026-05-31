type Props = {
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

export default function AssignmentRow({
	id,
	vehicle_id,
	driver_id,
	start_time,
	end_time,
	start_mileage,
	end_mileage,
	start_fuel_level,
	end_fuel_level,
	dashboard_image_url,
	status,
	users: { first_name, last_name },
}: Props) {
	const formatDate = (date: string | null) => {
		if (!date) return '-'
		return new Date(date).toLocaleString('pl-PL', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<tr className="border-b border-base-content/10">
			<td className="py-3 text-base-content/80">
				{first_name} {last_name}
			</td>
			<td className="py-3 text-base-content/80">{formatDate(start_time)}</td>
			<td className="py-3 text-base-content/80">{formatDate(end_time)}</td>
			<td className="py-3 text-base-content/80">{start_mileage}</td>
			<td className="py-3 text-base-content/80">{end_mileage}</td>
			<td className="py-3 text-base-content/80">{start_fuel_level}</td>
			<td className="py-3 text-base-content/80">{end_fuel_level}</td>
			<td className="py-3 text-base-content/80">{dashboard_image_url || '-'}</td>
			<td className="py-3 text-base-content/80">{status}</td>
		</tr>
	)
}
