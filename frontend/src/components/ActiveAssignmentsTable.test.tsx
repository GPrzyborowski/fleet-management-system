import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ActiveAssignmentsTable from './ActiveAssignmentsTable'

vi.mock('./ActiveAssignmentsRow', () => ({
	default: ({
		id,
		brand,
		model,
		startDate,
	}: {
		id: number
		licensePlate: string
		brand: string
		model: string
		startDate: string
		onReturn: () => void
	}) => (
		<tr data-testid={`row-${id}`}>
			<td data-testid={`brand-model-${id}`}>
				{brand} {model}
			</td>
			<td data-testid={`date-${id}`}>{startDate}</td>
		</tr>
	),
}))

const mockOnReturn = vi.fn()

const makeAssignment = (overrides = {}) => ({
	id: 1,
	vehicle_id: 10,
	driver_id: 5,
	start_time: '2024-01-01T08:00:00',
	end_time: null,
	start_mileage: 10000,
	end_mileage: null,
	start_fuel_level: 80,
	end_fuel_level: null,
	dashboard_image_url: 'https://example.com/dashboard.jpg',
	status: 'active',
	vehicles: {
		brand: 'Volvo',
		model: 'FH16',
		license_plate: 'GD 12345',
	},
	...overrides,
})

describe('ActiveAssignmentsTable', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders heading', () => {
		render(<ActiveAssignmentsTable activeAssignments={[]} onReturn={mockOnReturn} />)
		expect(screen.getByText('Your active assignments')).toBeInTheDocument()
	})

	it('renders all table headers', () => {
		render(<ActiveAssignmentsTable activeAssignments={[]} onReturn={mockOnReturn} />)
		expect(screen.getByText('License plate')).toBeInTheDocument()
		expect(screen.getByText('Brand and model')).toBeInTheDocument()
		expect(screen.getByText('Start time')).toBeInTheDocument()
		expect(screen.getByText('Actions')).toBeInTheDocument()
	})

	it('renders no rows when activeAssignments is empty', () => {
		render(<ActiveAssignmentsTable activeAssignments={[]} onReturn={mockOnReturn} />)
		expect(screen.queryByTestId(/^row-/)).not.toBeInTheDocument()
	})

	it('renders one row for a single assignment', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} onReturn={mockOnReturn} />)
		expect(screen.getByTestId('row-1')).toBeInTheDocument()
	})

	it('renders correct number of rows for multiple assignments', () => {
		const assignments = [makeAssignment({ id: 1 }), makeAssignment({ id: 2 }), makeAssignment({ id: 3 })]
		render(<ActiveAssignmentsTable activeAssignments={assignments} onReturn={mockOnReturn} />)
		expect(screen.getAllByTestId(/^row-/)).toHaveLength(3)
	})

	it('passes brand and model to row from vehicles', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} onReturn={mockOnReturn} />)
		expect(screen.getByTestId('brand-model-1')).toHaveTextContent('Volvo FH16')
	})

	it('passes startDate to row from start_time', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} onReturn={mockOnReturn} />)
		expect(screen.getByTestId('date-1')).toHaveTextContent('2024-01-01T08:00:00')
	})

	it('renders unique rows for each assignment id', () => {
		const assignments = [
			makeAssignment({ id: 1, vehicles: { brand: 'Volvo', model: 'FH16', license_plate: 'GD 12345' } }),
			makeAssignment({ id: 2, vehicles: { brand: 'Scania', model: 'R500', license_plate: 'PO 99999' } }),
		]
		render(<ActiveAssignmentsTable activeAssignments={assignments} onReturn={mockOnReturn} />)
		expect(screen.getByTestId('row-1')).toBeInTheDocument()
		expect(screen.getByTestId('row-2')).toBeInTheDocument()
	})
})
