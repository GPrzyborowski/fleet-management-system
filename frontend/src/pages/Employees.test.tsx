import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Employees from './Employees'

vi.mock('../config/api', () => ({
	API_URL: 'http://localhost:3000',
}))

vi.mock('../components/Header', () => ({
	default: ({ text }: { text: string }) => <div>{text}</div>,
}))

vi.mock('../components/PageTransition', () => ({
	default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../components/NewEmployeeModal', () => ({
	default: () => <div>New employee modal</div>,
}))

describe('Employees page', () => {
	beforeEach(() => {
		localStorage.setItem('token', 'mocked token')
		globalThis.fetch = vi.fn(
			async () =>
				({
					ok: true,
					json: async () => [
						{
							id: 1,
							first_name: 'Gabriel',
							last_name: 'Przyborowski',
							email: 'gprzyborowski@example.com',
							role: 'driver',
							login: 'gprzyborowski',
							phone_number: '123456789',
							is_active: true,
						},
					],
				}) as Response,
		)
	})

	it('renders employees page title', async () => {
		render(<Employees />)
		expect(screen.getByText('Employees')).toBeInTheDocument()
	})

	it('renders fetched employee data', async () => {
		render(<Employees />)
		await waitFor(() => {
			expect(screen.getByText('Gabriel Przyborowski')).toBeInTheDocument()
		})
	})

	it('renders new employee modal', async () => {
		render(<Employees />)
		await waitFor(() => {
			expect(screen.getByText('New employee modal')).toBeInTheDocument()
		})
	})

	it('shows loading spinner initially', () => {
		render(<Employees />)
		expect(document.querySelector('.loading-spinner')).toBeInTheDocument()
	})

	it('calls fetch with authorization header', async () => {
		render(<Employees />)
		await waitFor(() => {
			expect(globalThis.fetch).toHaveBeenCalled()
		})
		expect(globalThis.fetch).toHaveBeenCalledWith(
			'http://localhost:3000/employees',
			expect.objectContaining({
				headers: {
					Authorization: 'Bearer mocked token',
				},
			}),
		)
	})
})
