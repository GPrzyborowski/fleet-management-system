import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import ResetPassword from './ResetPassword'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async importOriginal => {
	const actual = (await importOriginal()) as Record<string, unknown>
	return {
		...actual,
		useNavigate: () => mockNavigate,
	}
})

describe('ResetPassword page', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('shows invalid link message when token is missing', () => {
		render(
			<MemoryRouter initialEntries={['/reset-password']}>
				<ResetPassword />
			</MemoryRouter>,
		)
		expect(screen.getByText('Invalid reset link')).toBeInTheDocument()
	})

	it('renders form when token is present', () => {
		render(
			<MemoryRouter initialEntries={['/reset-password?token=abc123']}>
				<ResetPassword />
			</MemoryRouter>,
		)
		expect(screen.getByRole('button', { name: /set new password/i })).toBeInTheDocument()
	})

	it('shows success message and redirects on success', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true })
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ message: 'Password has been reset. You can now log in.' }),
			}),
		) as Mock

		render(
			<MemoryRouter initialEntries={['/reset-password?token=abc123']}>
				<ResetPassword />
			</MemoryRouter>,
		)

		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'newpassword123' },
		})
		fireEvent.click(screen.getByRole('button', { name: /set new password/i }))

		await waitFor(() => {
			expect(screen.getByText('Password has been reset. You can now log in.')).toBeInTheDocument()
		})

		await vi.runAllTimersAsync()
		expect(mockNavigate).toHaveBeenCalledWith('/login')
		vi.useRealTimers()
	})

	it('shows error on server error', async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				json: () => Promise.resolve({}),
			}),
		) as Mock

		render(
			<MemoryRouter initialEntries={['/reset-password?token=abc123']}>
				<ResetPassword />
			</MemoryRouter>,
		)

		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'newpassword123' },
		})
		fireEvent.click(screen.getByRole('button', { name: /set new password/i }))

		await waitFor(() => {
			expect(screen.getByText('Server error occured.')).toBeInTheDocument()
		})
	})
})
