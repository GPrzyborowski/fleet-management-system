export type IncidentData = {
	id: number
	ai_description: string
	status: string
	created_at: string
	vehicle_incident_images: {
		id: number
		side: string
		image_url: string
		image_type: string
	}[]
}

type Props = IncidentData & {
	onView: (incident: IncidentData) => void
}

export default function IncidentRow({
	id,
	ai_description,
	status,
	created_at,
	vehicle_incident_images,
	onView,
}: Props) {
	const formatDate = (date: string) => {
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
			<td className="py-3 text-base-content/80">{formatDate(created_at)}</td>
			<td className="py-3 text-base-content/80 max-w-xs truncate">{ai_description}</td>
			<td className="py-3 text-base-content/80 capitalize">{status}</td>
			<td className="py-3 text-base-content/80">
				<button
					type="button"
					className="btn btn-soft btn-sm"
					onClick={() => onView({ id, ai_description, status, created_at, vehicle_incident_images })}>
					<span className="icon-[tabler--eye] size-4" />
					View
				</button>
			</td>
		</tr>
	)
}
