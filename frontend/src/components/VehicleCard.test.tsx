import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import VehicleCard from './VehicleCard'

const mockOnTake = vi.fn()

const defaultProps = {
	id: 1,
	licensePlate: 'GD 12345',
	brand: 'Volvo',
	model: 'FH16',
	fuelLevel: 80,
	onTake: mockOnTake,
}

describe('VehicleCard', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders brand and model', () => {
		render(<VehicleCard {...defaultProps} />)
		expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
	})

	it('renders license plate', () => {
		render(<VehicleCard {...defaultProps} />)
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('renders fuel level', () => {
		render(<VehicleCard {...defaultProps} />)
		expect(screen.getByText('Fuel level: 80%')).toBeInTheDocument()
	})

	it('renders Take vehicle button', () => {
		render(<VehicleCard {...defaultProps} />)
		expect(screen.getByRole('button', { name: /take vehicle/i })).toBeInTheDocument()
	})

	it('modal is not visible before opening', () => {
		const { container } = render(<VehicleCard {...defaultProps} />)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('opens confirmation modal on Take vehicle click', () => {
		const { container } = render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-100', 'visible')
	})

	it('renders vehicle info in confirmation modal', () => {
		render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		expect(screen.getByText(/GD 12345/)).toBeInTheDocument()
	})

	it('closes modal on Cancel click', () => {
		const { container } = render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on backdrop click', () => {
		const { container } = render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		fireEvent.click(container.querySelector('.fixed.inset-0.bg-black\\/50')!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('calls onTake with correct vehicle id on Confirm click', () => {
		render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
		expect(mockOnTake).toHaveBeenCalledWith(1)
	})

	it('closes modal after Confirm click', () => {
		const { container } = render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('does not call onTake when Cancel is clicked', () => {
		render(<VehicleCard {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /take vehicle/i }))
		fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
		expect(mockOnTake).not.toHaveBeenCalled()
	})

	it('renders different vehicle data', () => {
		render(<VehicleCard {...defaultProps} brand="Scania" model="R500" licensePlate="PO 99999" fuelLevel={45} />)
		expect(screen.getByText('Scania R500')).toBeInTheDocument()
		expect(screen.getByText('PO 99999')).toBeInTheDocument()
		expect(screen.getByText('Fuel level: 45%')).toBeInTheDocument()
	})
})
