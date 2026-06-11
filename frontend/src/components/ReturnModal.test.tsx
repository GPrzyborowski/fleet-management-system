import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ReturnModal from './ReturnModal'

const mockOnReturn = vi.fn()

const defaultProps = {
	licensePlate: 'GD 12345',
	onReturn: mockOnReturn,
}

describe('ReturnModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders Return trigger button', () => {
		render(<ReturnModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: /^return$/i })).toBeInTheDocument()
	})

	it('modal is not visible before opening', () => {
		const { container } = render(<ReturnModal {...defaultProps} />)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('opens modal on trigger button click', () => {
		const { container } = render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-100', 'visible')
	})

	it('renders license plate in heading', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('renders step 1 of 2 indicator', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
	})

	it('renders step 1 fields', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByText('Add dashboard picture')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('e.g. 150023')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('e.g. 75')).toBeInTheDocument()
	})

	it('renders Cancel button on step 1', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
	})

	it('renders Next button on step 1', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
	})

	it('closes modal on Cancel button click', () => {
		const { container } = render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on X button click', () => {
		const { container } = render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		const closeButton = screen.getAllByRole('button').find(btn => btn.querySelector('.icon-\\[tabler--x\\]'))
		fireEvent.click(closeButton!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on backdrop click', () => {
		const { container } = render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(container.querySelector('.fixed.inset-0.bg-black\\/50')!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('advances to step 2 on Next click', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		expect(screen.getByText('Step 2 of 2')).toBeInTheDocument()
	})

	it('renders step 2 fields', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		expect(screen.getByText('Front picture')).toBeInTheDocument()
		expect(screen.getByText('Left picture')).toBeInTheDocument()
		expect(screen.getByText('Right picture')).toBeInTheDocument()
		expect(screen.getByText('Back picture')).toBeInTheDocument()
	})

	it('renders Back button on step 2', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
	})

	it('renders Return vehicle button on step 2', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		expect(screen.getByRole('button', { name: /return vehicle/i })).toBeInTheDocument()
	})

	it('goes back to step 1 on Back button click', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		fireEvent.click(screen.getByRole('button', { name: /back/i }))
		expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
	})

	it('calls onReturn with formData on Return vehicle click', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.change(screen.getByPlaceholderText('e.g. 150023'), { target: { value: '150000' } })
		fireEvent.change(screen.getByPlaceholderText('e.g. 75'), { target: { value: '80' } })
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		fireEvent.click(screen.getByRole('button', { name: /return vehicle/i }))
		expect(mockOnReturn).toHaveBeenCalledWith({
			dashboardImage: null,
			mileage: '150000',
			fuelLevel: '80',
			frontImage: null,
			leftImage: null,
			rightImage: null,
			backImage: null,
		})
	})

	it('closes modal after Return vehicle click', () => {
		const { container } = render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.click(screen.getByRole('button', { name: /next/i }))
		fireEvent.click(screen.getByRole('button', { name: /return vehicle/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('resets form and step after closing', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.change(screen.getByPlaceholderText('e.g. 150023'), { target: { value: '999999' } })
		fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByPlaceholderText('e.g. 150023')).toHaveValue('')
		expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
	})

	it('updates mileage input value', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.change(screen.getByPlaceholderText('e.g. 150023'), { target: { value: '123456' } })
		expect(screen.getByPlaceholderText('e.g. 150023')).toHaveValue('123456')
	})

	it('updates fuel level input value', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		fireEvent.change(screen.getByPlaceholderText('e.g. 75'), { target: { value: '50' } })
		expect(screen.getByPlaceholderText('e.g. 75')).toHaveValue('50')
	})

	it('renders No file chosen when no file selected', () => {
		render(<ReturnModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
		expect(screen.getByText('No file chosen')).toBeInTheDocument()
	})
})
