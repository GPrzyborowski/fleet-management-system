import ReturnModal from './ReturnModal'

type Props = {
	id: number
	licensePlate: string
	brand: string
	model: string
	startDate: string
	onReturn: () => void
}

export default function ActiveAssignmentsRow({ id, licensePlate, brand, model, startDate, onReturn }: Props) {
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
				<ReturnModal licensePlate={licensePlate} assignmentId={id} onReturn={onReturn} />
			</td>
		</tr>
	)
}
