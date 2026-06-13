import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import VehicleRow from './VehicleRow'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./EditVehicleModal', () => ({
	default: () => <button>Edit</button>,
}))

const defaultProps = {
	id: 1,
	licensePlate: 'GD 12345',
	brand: 'Volvo',
	model: 'FH16',
	year: 2020,
	mileage: 150000,
	fuelLevel: 80,
	status: 'available',
	removeHandler: vi.fn(),
	updateHandler: vi.fn(),
	onUpdate: vi.fn(),
}

const renderRow = (props = {}) =>
	render(
		<MemoryRouter>
			<table>
				<tbody>
					<VehicleRow {...defaultProps} {...props} />
				</tbody>
			</table>
		</MemoryRouter>,
	)

describe('VehicleRow', () => {
	afterEach(() => vi.clearAllMocks())

	it('renders license plate', () => {
		renderRow()
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('renders brand and model', () => {
		renderRow()
		expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
	})

	it('renders year and mileage', () => {
		renderRow()
		expect(screen.getByText('2020')).toBeInTheDocument()
		expect(screen.getByText('150000')).toBeInTheDocument()
	})

	it('renders available badge', () => {
		renderRow()
		expect(screen.getByText('Available')).toBeInTheDocument()
	})

	it('renders not available badge when status is not available', () => {
		renderRow({ status: 'unavailable' })
		expect(screen.getByText('Not available')).toBeInTheDocument()
	})

	it('calls removeHandler with correct id on click', () => {
		renderRow()
		fireEvent.click(screen.getByLabelText('Remove employee'))
		expect(defaultProps.removeHandler).toHaveBeenCalledWith(1)
	})

	it('renders link to vehicle details', () => {
		renderRow()
		const link = screen.getByLabelText('Show vehicle details')
		expect(link).toHaveAttribute('href', '/vehicles/1')
	})

	it('renders edit modal', () => {
		renderRow()
		expect(screen.getByText('Edit')).toBeInTheDocument()
	})
})
