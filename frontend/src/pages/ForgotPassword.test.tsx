import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import ForgotPassword from './ForgotPassword'
import { MemoryRouter } from 'react-router-dom'

describe('ForgotPassword page', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders email input', () => {
		render(
			<MemoryRouter>
				<ForgotPassword />
			</MemoryRouter>,
		)
		expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
	})

	it('shows success message on valid email', async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ message: 'If this email is correct, password reset link will be sent.' }),
			}),
		) as Mock

		render(
			<MemoryRouter>
				<ForgotPassword />
			</MemoryRouter>,
		)

		fireEvent.change(screen.getByPlaceholderText('user@example.com'), {
			target: { value: 'test@example.com' },
		})
		fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

		await waitFor(() => {
			expect(screen.getByText('If this email is correct, password reset link will be sent.')).toBeInTheDocument()
		})
	})

	it('shows error on server error', async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				json: () => Promise.resolve({}),
			}),
		) as Mock

		render(
			<MemoryRouter>
				<ForgotPassword />
			</MemoryRouter>,
		)

		fireEvent.change(screen.getByPlaceholderText('user@example.com'), {
			target: { value: 'test@example.com' },
		})
		fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

		await waitFor(() => {
			expect(screen.getByText('Server error occured.')).toBeInTheDocument()
		})
	})

	it('renders hero image', () => {
		render(
			<MemoryRouter>
				<ForgotPassword />
			</MemoryRouter>,
		)
		const image = screen.getByAltText('')
		expect(image).toHaveAttribute('src', '/hero_reset.png')
	})
})
