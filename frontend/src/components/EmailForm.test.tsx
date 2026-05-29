import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import EmailForm from './EmailForm'

const mockSubmitEmail = vi.fn()

const defaultProps = {
	submitEmail: mockSubmitEmail,
	successMsg: '',
	errorMsg: '',
	pending: false,
}

describe('EmailForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders email input and submit button', () => {
		render(<EmailForm {...defaultProps} />)
		expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
	})

	it('calls submitEmail with email on submit', async () => {
		render(<EmailForm {...defaultProps} />)

		fireEvent.change(screen.getByPlaceholderText('user@example.com'), {
			target: { value: 'test@example.com' },
		})
		fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

		await waitFor(() => {
			expect(mockSubmitEmail).toHaveBeenCalledWith('test@example.com')
		})
	})

	it('clears input after submit', async () => {
		render(<EmailForm {...defaultProps} />)

		const input = screen.getByPlaceholderText('user@example.com')
		fireEvent.change(input, { target: { value: 'test@example.com' } })
		fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

		await waitFor(() => {
			expect(input).toHaveValue('')
		})
	})

	it('shows spinner when pending', () => {
		render(<EmailForm {...defaultProps} pending={true} />)
		expect(screen.getByRole('button').querySelector('.loading')).toBeInTheDocument()
		expect(screen.queryByText('Send reset link')).not.toBeInTheDocument()
	})

	it('shows success message', () => {
		render(<EmailForm {...defaultProps} successMsg="If this email is correct, password reset link will be sent." />)
		expect(screen.getByText('If this email is correct, password reset link will be sent.')).toBeInTheDocument()
	})

	it('shows error message', () => {
		render(<EmailForm {...defaultProps} errorMsg="Server error occured." />)
		expect(screen.getByText('Server error occured.')).toBeInTheDocument()
	})
})
