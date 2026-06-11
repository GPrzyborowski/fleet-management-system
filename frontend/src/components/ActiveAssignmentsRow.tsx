type Props = {
	id: number
	licensePlate: string
	brand: string
	model: string
	startDate: string
}

export default function ActiveAssignmentsRow({ licensePlate, brand, model, startDate }: Props) {
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
		<tr>
			<td className="font-medium">{licensePlate}</td>
			<td>
				{brand} {model}
			</td>
			<td>{formatDate(startDate)}</td>
			<td>
				<button className="btn btn-accent px-4 py-2 text-white shadow-md hover:bg-primary-focus transition-colors flex items-center justify-center">
					Return
				</button>
			</td>
		</tr>
	)
}
