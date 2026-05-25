import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Navbar from './Navbar'
import { BrowserRouter } from 'react-router-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom')
	return { ...actual, useNavigate: () => mockNavigate }
})

describe('Navbar', () => {
	it('renders navigation links and logout button', () => {
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		expect(screen.getByText('Dashboard')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
	})
	it('removes token and navigates on logout', () => {
		localStorage.setItem('token', 'test')
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		fireEvent.click(screen.getByRole('button', { name: /log out/i }))
		expect(localStorage.getItem('token')).toBeNull()
		expect(mockNavigate).toHaveBeenCalledWith('/')
	})
	it('dashboard link points to dashboard route', () => {
		render(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>,
		)
		expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
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
