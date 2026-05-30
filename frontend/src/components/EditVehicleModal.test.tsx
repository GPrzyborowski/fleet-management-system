import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import EditVehicleModal from './EditVehicleModal'

const defaultProps = {
	id: 1,
	licensePlate: 'GD 12345',
	brand: 'Volvo',
	model: 'FH16',
	year: 2020,
	status: 'available',
	updateHandler: vi.fn().mockResolvedValue(undefined),
	onUpdate: vi.fn(),
}

describe('EditVehicleModal', () => {
	beforeEach(() => {
		window.HSOverlay = { autoInit: vi.fn() }
	})

	afterEach(() => vi.clearAllMocks())

	it('renders edit button', () => {
		render(<EditVehicleModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
	})

	it('renders form fields with correct default values', () => {
		render(<EditVehicleModal {...defaultProps} />)
		expect(screen.getByDisplayValue('GD 12345')).toBeInTheDocument()
		expect(screen.getByDisplayValue('Volvo')).toBeInTheDocument()
		expect(screen.getByDisplayValue('FH16')).toBeInTheDocument()
		expect(screen.getByDisplayValue('2020')).toBeInTheDocument()
	})

	it('renders available status by default', () => {
		render(<EditVehicleModal {...defaultProps} />)
		expect(screen.getByRole('option', { name: 'Available' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Not available' })).toBeInTheDocument()
	})

	it('calls updateHandler with updated values on submit', async () => {
		render(<EditVehicleModal {...defaultProps} />)

		fireEvent.change(screen.getByDisplayValue('Volvo'), { target: { value: 'Scania' } })
		fireEvent.submit(screen.getByRole('button', { name: /save changes/i }).closest('form')!)

		await waitFor(() => {
			expect(defaultProps.updateHandler).toHaveBeenCalledWith(1, 'GD 12345', 'Scania', 'FH16', 2020, 'available')
		})
	})

	it('calls onUpdate after successful submit', async () => {
		render(<EditVehicleModal {...defaultProps} />)
		fireEvent.submit(screen.getByRole('button', { name: /save changes/i }).closest('form')!)

		await waitFor(() => {
			expect(defaultProps.onUpdate).toHaveBeenCalled()
		})
	})

	it('calls HSOverlay.autoInit on mount', () => {
		render(<EditVehicleModal {...defaultProps} />)
		expect(window.HSOverlay.autoInit).toHaveBeenCalled()
	})

	it('renders modal with correct id', () => {
		render(<EditVehicleModal {...defaultProps} />)
		expect(document.getElementById('edit-vehicle-modal-1')).toBeInTheDocument()
	})

	it('updates status select correctly', () => {
		render(<EditVehicleModal {...defaultProps} />)
		const select = screen.getByRole('combobox')
		fireEvent.change(select, { target: { value: 'unavailable' } })
		expect((select as HTMLSelectElement).value).toBe('unavailable')
	})
})
