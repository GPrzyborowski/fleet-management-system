import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { jwtDecode } from 'jwt-decode'
import Dashboard from './Dashboard'

vi.mock('jwt-decode', () => ({
	jwtDecode: vi.fn(),
}))

describe('Home page', () => {
	it('renders decoded user name from token', () => {
		localStorage.setItem('token', 'test token')
		vi.mocked(jwtDecode).mockReturnValue({
			id: 1,
			login: 'test',
			role: 'driver',
		})
		render(
			<MemoryRouter>
				<Dashboard></Dashboard>
			</MemoryRouter>,
		)
		expect(screen.getByText('Hello test')).toBeInTheDocument()
	})
	it('renders manager action cards for manager role', () => {
		localStorage.setItem('token', 'test token')
		vi.mocked(jwtDecode).mockReturnValue({
			id: 1,
			login: 'test',
			role: 'manager',
		})
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		)
		expect(screen.getByText('Employees')).toBeInTheDocument()
		expect(screen.getByText('Vehicles')).toBeInTheDocument()
	})
	it('does not renders manager action cards for driver role', () => {
		localStorage.setItem('token', 'test token')
		vi.mocked(jwtDecode).mockReturnValue({
			id: 1,
			login: 'test',
			role: 'driver',
		})
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		)
		expect(screen.queryByText('Employees')).not.toBeInTheDocument()
		expect(screen.queryByText('Vehicles')).not.toBeInTheDocument()
	})
	it('removes jwt token on logout', () => {
		localStorage.setItem('token', 'test token')
		vi.mocked(jwtDecode).mockReturnValue({
			id: 1,
			login: 'test',
			role: 'driver',
		})
		render(
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>,
		)
		fireEvent.click(screen.getByRole('button', { name: /log out/i }))
		expect(localStorage.getItem('token')).toBeNull()
	})
})
