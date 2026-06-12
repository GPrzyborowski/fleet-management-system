import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ActiveAssignmentsRow from './ActiveAssignmentsRow'

vi.mock('./ReturnModal', () => ({
	default: ({ licensePlate, assignmentId }: { licensePlate: string; assignmentId: number; onReturn: () => void }) => (
		<button data-testid={`return-modal-${assignmentId}`}>{licensePlate}</button>
	),
}))

const mockOnReturn = vi.fn()

const defaultProps = {
	id: 1,
	licensePlate: 'GD 12345',
	brand: 'Volvo',
	model: 'FH16',
	startDate: '2024-01-01T08:00:00',
	onReturn: mockOnReturn,
}

describe('ActiveAssignmentsRow', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders license plate', () => {
		render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('renders brand and model', () => {
		render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
	})

	it('renders formatted start date', () => {
		render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText(/01\.01\.2024/)).toBeInTheDocument()
	})

	it('renders dash when startDate is null', () => {
		render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} startDate={null as unknown as string} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('-')).toBeInTheDocument()
	})

	it('renders ReturnModal with correct assignmentId', () => {
		render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByTestId('return-modal-1')).toBeInTheDocument()
	})

	it('renders ReturnModal with correct licensePlate', () => {
		render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByTestId('return-modal-1')).toHaveTextContent('GD 12345')
	})

	it('renders four table cells', () => {
		const { container } = render(
			<table>
				<tbody>
					<ActiveAssignmentsRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(container.querySelectorAll('td')).toHaveLength(4)
	})
})
