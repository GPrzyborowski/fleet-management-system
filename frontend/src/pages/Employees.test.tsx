import { render, screen, waitFor, fireEvent } from '@testing-library/react'
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

vi.mock('../components/EmployeeRow', () => ({
	default: ({
		firstName,
		lastName,
		removeHandler,
		id,
	}: {
		firstName: string
		lastName: string
		id: number
		removeHandler: (id: number) => void
		updateHandler: () => void
		onUpdate: () => void
		email: string
		role: string
		login: string
		phone: string
		isActive: boolean
	}) => (
		<tr>
			<td>
				{firstName} {lastName}
			</td>
			<td>
				<button onClick={() => removeHandler(id)}>Remove</button>
			</td>
		</tr>
	),
}))

const mockAddHandler = vi.fn()
const mockOnUpdate = vi.fn()

vi.mock('../components/NewEmployeeModal', () => ({
	default: ({ addHandler, onUpdate }: { addHandler: typeof mockAddHandler; onUpdate: typeof mockOnUpdate }) => (
		<div>
			<div>New employee modal</div>
			<button
				onClick={() => {
					addHandler('login', 'Jan', 'Kowalski', 'jan@test.com', 'pass', '123', 'driver')
					onUpdate()
				}}>
				Add Employee
			</button>
		</div>
	),
}))

const mockEmployee = {
	id: 1,
	first_name: 'Gabriel',
	last_name: 'Przyborowski',
	email: 'gprzyborowski@example.com',
	role: 'driver',
	login: 'gprzyborowski',
	phone_number: '123456789',
	is_active: true,
}

describe('Employees page', () => {
	beforeEach(() => {
		localStorage.setItem('token', 'mocked token')
		globalThis.fetch = vi.fn(
			async () =>
				({
					ok: true,
					json: async () => [mockEmployee],
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
				headers: { Authorization: 'Bearer mocked token' },
			}),
		)
	})

	it('calls addEmployee and refreshes list on add', async () => {
		render(<Employees />)
		await waitFor(() => {
			expect(screen.getByText('New employee modal')).toBeInTheDocument()
		})
		fireEvent.click(screen.getByRole('button', { name: /add employee/i }))
		await waitFor(() => {
			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/employees',
				expect.objectContaining({ method: 'POST' }),
			)
		})
	})

	it('removes employee from list on remove', async () => {
		globalThis.fetch = vi.fn(async (url, options) => {
			if ((options as RequestInit)?.method === 'PATCH' && String(url).includes('/remove')) {
				return { ok: true, json: async () => ({}) } as Response
			}
			return { ok: true, json: async () => [mockEmployee] } as Response
		})

		render(<Employees />)
		await waitFor(() => {
			expect(screen.getByText('Gabriel Przyborowski')).toBeInTheDocument()
		})
		fireEvent.click(screen.getByRole('button', { name: /remove/i }))
		await waitFor(() => {
			expect(screen.queryByText('Gabriel Przyborowski')).not.toBeInTheDocument()
		})
	})
})
