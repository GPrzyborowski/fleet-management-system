import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ActiveAssignmentsTable from './ActiveAssignmentsTable'

vi.mock('./ActiveAssignmentsRow', () => ({
	default: ({
		id,
		licensePlate,
		brand,
		model,
		startDate,
	}: {
		id: number
		licensePlate: string
		brand: string
		model: string
		startDate: string
	}) => (
		<tr data-testid={`row-${id}`}>
			<td>{licensePlate}</td>
			<td>
				{brand} {model}
			</td>
			<td>{startDate}</td>
		</tr>
	),
}))

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
	it('renders heading', () => {
		render(<ActiveAssignmentsTable activeAssignments={[]} />)
		expect(screen.getByText('Your active assignments')).toBeInTheDocument()
	})

	it('renders all table headers', () => {
		render(<ActiveAssignmentsTable activeAssignments={[]} />)
		expect(screen.getByText('License plate')).toBeInTheDocument()
		expect(screen.getByText('Brand and model')).toBeInTheDocument()
		expect(screen.getByText('Start time')).toBeInTheDocument()
		expect(screen.getByText('Actions')).toBeInTheDocument()
	})

	it('renders no rows when activeAssignments is empty', () => {
		render(<ActiveAssignmentsTable activeAssignments={[]} />)
		expect(screen.queryByTestId(/^row-/)).not.toBeInTheDocument()
	})

	it('renders one row for a single assignment', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} />)
		expect(screen.getByTestId('row-1')).toBeInTheDocument()
	})

	it('renders correct number of rows for multiple assignments', () => {
		const assignments = [makeAssignment({ id: 1 }), makeAssignment({ id: 2 }), makeAssignment({ id: 3 })]
		render(<ActiveAssignmentsTable activeAssignments={assignments} />)
		expect(screen.getAllByTestId(/^row-/)).toHaveLength(3)
	})

	it('passes licensePlate to row from vehicles', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} />)
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('passes brand and model to row from vehicles', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} />)
		expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
	})

	it('passes startDate to row from start_time', () => {
		render(<ActiveAssignmentsTable activeAssignments={[makeAssignment()]} />)
		expect(screen.getByText('2024-01-01T08:00:00')).toBeInTheDocument()
	})

	it('renders unique rows for each assignment id', () => {
		const assignments = [
			makeAssignment({ id: 1, vehicles: { brand: 'Volvo', model: 'FH16', license_plate: 'GD 12345' } }),
			makeAssignment({ id: 2, vehicles: { brand: 'Scania', model: 'R500', license_plate: 'PO 99999' } }),
		]
		render(<ActiveAssignmentsTable activeAssignments={assignments} />)
		expect(screen.getByTestId('row-1')).toBeInTheDocument()
		expect(screen.getByTestId('row-2')).toBeInTheDocument()
	})
})
