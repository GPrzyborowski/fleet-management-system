import { render, screen } from '@testing-library/react'
import ActiveAssignmentsRow from './ActiveAssignmentsRow'

const defaultProps = {
	id: 1,
	licensePlate: 'GD 12345',
	brand: 'Volvo',
	model: 'FH16',
	startDate: '2024-01-01T08:00:00',
}

const renderRow = (props = {}) =>
	render(
		<table>
			<tbody>
				<ActiveAssignmentsRow {...defaultProps} {...props} />
			</tbody>
		</table>,
	)

describe('ActiveAssignmentsRow', () => {
	it('renders license plate', () => {
		renderRow()
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('renders brand and model', () => {
		renderRow()
		expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
	})

	it('renders formatted start date', () => {
		renderRow()
		expect(screen.getByText('01.01.2024, 08:00')).toBeInTheDocument()
	})

	it('renders dash when startDate is empty string', () => {
		renderRow({ startDate: '' })
		expect(screen.getByText('-')).toBeInTheDocument()
	})

	it('renders Return button', () => {
		renderRow()
		expect(screen.getByRole('button', { name: /return/i })).toBeInTheDocument()
	})

	it('renders different license plate', () => {
		renderRow({ licensePlate: 'PO 99999' })
		expect(screen.getByText('PO 99999')).toBeInTheDocument()
	})

	it('renders different brand and model', () => {
		renderRow({ brand: 'Scania', model: 'R500' })
		expect(screen.getByText('Scania R500')).toBeInTheDocument()
	})

	it('renders correct date format for different date', () => {
		renderRow({ startDate: '2025-12-31T23:59:00' })
		expect(screen.getByText('31.12.2025, 23:59')).toBeInTheDocument()
	})
})
