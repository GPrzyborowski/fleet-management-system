import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ResetPasswordForm from './ResetPasswordForm'

const mockSubmitPassword = vi.fn()

const defaultProps = {
	submitPassword: mockSubmitPassword,
	token: 'abc123',
	successMsg: '',
	errorMsg: '',
	pending: false,
}

describe('ResetPasswordForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders password input and submit button', () => {
		render(<ResetPasswordForm {...defaultProps} />)
		expect(screen.getByPlaceholderText('Super secret password')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /set new password/i })).toBeInTheDocument()
	})

	it('calls submitPassword with token and password on submit', async () => {
		render(<ResetPasswordForm {...defaultProps} />)

		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'newpassword123' },
		})
		fireEvent.click(screen.getByRole('button', { name: /set new password/i }))

		await waitFor(() => {
			expect(mockSubmitPassword).toHaveBeenCalledWith('abc123', 'newpassword123')
		})
	})

	it('clears input after submit', async () => {
		render(<ResetPasswordForm {...defaultProps} />)

		const input = screen.getByPlaceholderText('Super secret password')
		fireEvent.change(input, { target: { value: 'newpassword123' } })
		fireEvent.click(screen.getByRole('button', { name: /set new password/i }))

		await waitFor(() => {
			expect(input).toHaveValue('')
		})
	})

	it('shows spinner when pending', () => {
		render(<ResetPasswordForm {...defaultProps} pending={true} />)
		expect(screen.getByRole('button').querySelector('.loading')).toBeInTheDocument()
		expect(screen.queryByText('Set new password')).not.toBeInTheDocument()
	})

	it('shows success message', () => {
		render(<ResetPasswordForm {...defaultProps} successMsg="Password has been reset. You can now log in." />)
		expect(screen.getByText('Password has been reset. You can now log in.')).toBeInTheDocument()
	})

	it('shows error message', () => {
		render(<ResetPasswordForm {...defaultProps} errorMsg="Server error occured." />)
		expect(screen.getByText('Server error occured.')).toBeInTheDocument()
	})
})
