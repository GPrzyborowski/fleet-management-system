import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import NewVehicleModal from './NewVehicleModal'

vi.mock('flyonui/flyonui', () => ({}))

const mockAddHandler = vi.fn()
const mockOnUpdate = vi.fn()

const defaultProps = {
	addHandler: mockAddHandler,
	onUpdate: mockOnUpdate,
}

describe('NewVehicleModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders trigger button', () => {
		const { container } = render(<NewVehicleModal {...defaultProps} />)
		expect(container.querySelector('.icon-\\[tabler--plus\\]')).toBeInTheDocument()
	})

	it('renders modal title', () => {
		render(<NewVehicleModal {...defaultProps} />)
		expect(screen.getByRole('heading', { name: 'Add vehicle' })).toBeInTheDocument()
	})

	it('renders all form labels', () => {
		render(<NewVehicleModal {...defaultProps} />)
		expect(screen.getByText('Brand')).toBeInTheDocument()
		expect(screen.getByText('Model')).toBeInTheDocument()
		expect(screen.getByText('License plate')).toBeInTheDocument()
		expect(screen.getByText('Year of manufacture')).toBeInTheDocument()
		expect(screen.getByText('Current mileage (km)')).toBeInTheDocument()
		expect(screen.getByText('Fuel level (%)')).toBeInTheDocument()
		expect(screen.getByText('Status')).toBeInTheDocument()
	})

	it('renders status select with correct options', () => {
		render(<NewVehicleModal {...defaultProps} />)
		expect(screen.getByRole('option', { name: 'Available' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Not available' })).toBeInTheDocument()
	})

	it('calls addHandler with FormData and calls onUpdate on form submit', async () => {
		mockAddHandler.mockResolvedValue(undefined)
		render(<NewVehicleModal {...defaultProps} />)

		const inputs = screen.getAllByRole('spinbutton')
		fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Volvo' } })
		fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'FH16' } })
		fireEvent.change(screen.getAllByRole('textbox')[2], { target: { value: 'GD 12345' } })
		fireEvent.change(inputs[0], { target: { value: '2020' } })
		fireEvent.change(inputs[1], { target: { value: '150000' } })
		fireEvent.change(inputs[2], { target: { value: '80' } })

		fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }))

		await waitFor(() => {
			expect(mockAddHandler).toHaveBeenCalledWith(expect.any(FormData))
			expect(mockOnUpdate).toHaveBeenCalled()
		})
	})

	it('renders Cancel and Add vehicle buttons', () => {
		render(<NewVehicleModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument()
	})

	it('renders base reference photos section', () => {
		render(<NewVehicleModal {...defaultProps} />)
		expect(screen.getByText('Base reference photos')).toBeInTheDocument()
		expect(screen.getByText('Front')).toBeInTheDocument()
		expect(screen.getByText('Left')).toBeInTheDocument()
		expect(screen.getByText('Right')).toBeInTheDocument()
		expect(screen.getByText('Back')).toBeInTheDocument()
	})

	it('renders four file inputs for base photos', () => {
		const { container } = render(<NewVehicleModal {...defaultProps} />)
		expect(container.querySelectorAll('input[type="file"]')).toHaveLength(4)
	})
})
