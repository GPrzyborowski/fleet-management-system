import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import Login from './Login'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}))

describe('Login page', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	it('logs in successfully', async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						token: 'fake-token',
					}),
			}),
		) as Mock
		render(<Login />)
		fireEvent.change(screen.getByPlaceholderText('John Doe'), {
			target: { value: 'admin' },
		})
		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'password123' },
		})
		fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
		await waitFor(() => {
			expect(localStorage.getItem('token')).toBe('fake-token')
			expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
		})
	})

	it('shows error on failed login', async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				json: () => Promise.resolve({}),
			}),
		) as Mock
		render(<Login />)
		fireEvent.change(screen.getByPlaceholderText('John Doe'), {
			target: { value: 'admin' },
		})
		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'wrong-password' },
		})
		fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
		await waitFor(() => {
			expect(screen.getByText('Invalid login or password.')).toBeInTheDocument()
		})
	})
	it('renders hero image', () => {
		render(<Login />)
		const image = screen.getByAltText('truck with a lock')
		expect(image).toBeInTheDocument()
		expect(image).toHaveAttribute('src', '/hero_login.png')
	})
})
