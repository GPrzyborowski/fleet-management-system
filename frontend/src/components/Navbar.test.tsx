import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Navbar from './Navbar'
import { BrowserRouter } from 'react-router-dom'

describe('LoginForm', () => {
	it('renders navigation links and logout button', () => {
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		expect(screen.getByText('Dashboard')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
	})
	it('calls logoutHandler when logout button is clicked', () => {
		const mockLogout = vi.fn()
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		fireEvent.click(screen.getByRole('button', { name: /log out/i }))
		expect(mockLogout).toHaveBeenCalledTimes(1)
	})
	it('dashboard link points to dashboard route', () => {
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
		expect(dashboardLink).toHaveAttribute('href', '/dashboard')
	})
	it('renders mobile menu toggle button', () => {
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		expect(screen.getByRole('button', { name: /toggle navigation/i })).toBeInTheDocument()
	})
})
