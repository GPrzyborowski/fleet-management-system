import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import NewEmployeeModal from './NewEmployeeModal'

vi.mock('flyonui/flyonui', () => ({
	HSStaticMethods: {
		autoInit: vi.fn(),
	},
	HSOverlay: {
		close: vi.fn(),
	},
}))

const mockAddHandler = vi.fn().mockResolvedValue(undefined)
const mockOnUpdate = vi.fn()

const defaultProps = {
	addHandler: mockAddHandler,
	onUpdate: mockOnUpdate,
}

describe('NewEmployeeModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders add button', () => {
		render(<NewEmployeeModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
	})

	it('renders modal title', () => {
		render(<NewEmployeeModal {...defaultProps} />)
		expect(screen.getByText('New employee')).toBeInTheDocument()
	})

	it('renders all input fields', () => {
		render(<NewEmployeeModal {...defaultProps} />)
		expect(screen.getByText('First name')).toBeInTheDocument()
		expect(screen.getByText('Last name')).toBeInTheDocument()
		expect(screen.getByText('Login')).toBeInTheDocument()
		expect(screen.getByText('Email')).toBeInTheDocument()
		expect(screen.getByText('Password')).toBeInTheDocument()
		expect(screen.getByText('Phone number')).toBeInTheDocument()
		expect(screen.getByText('Role')).toBeInTheDocument()
	})

	it('renders Save employee button', () => {
		render(<NewEmployeeModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: /save employee/i })).toBeInTheDocument()
	})

	it('renders Cancel button', () => {
		render(<NewEmployeeModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
	})

	it('renders role select with driver and manager options', () => {
		render(<NewEmployeeModal {...defaultProps} />)
		expect(screen.getByText('Driver')).toBeInTheDocument()
		expect(screen.getByText('Manager')).toBeInTheDocument()
	})

	it('calls addHandler and onUpdate on form submit', async () => {
		render(<NewEmployeeModal {...defaultProps} />)

		const inputs = screen.getAllByRole('textbox')
		fireEvent.change(inputs[0], { target: { value: 'Jan' } })
		fireEvent.change(inputs[1], { target: { value: 'Kowalski' } })
		fireEvent.change(inputs[2], { target: { value: 'jkowalski' } })
		fireEvent.change(inputs[3], { target: { value: 'jan@test.com' } })

		fireEvent.click(screen.getByRole('button', { name: /save employee/i }))

		await vi.waitFor(() => {
			expect(mockAddHandler).toHaveBeenCalled()
		})
	})
})
