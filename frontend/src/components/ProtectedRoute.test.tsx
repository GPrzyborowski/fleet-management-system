import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

describe('ProtectedRoute', () => {
	beforeEach(() => {
		localStorage.clear()
	})
	it('renders children when token exists', () => {
		const validPayload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))
		localStorage.setItem('token', `header.${validPayload}.signature`)

		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>Test protected route</div>
				</ProtectedRoute>
			</MemoryRouter>,
		)
		expect(screen.getByText('Test protected route')).toBeInTheDocument()
	})
	it('redirects to login page when token does not exist', () => {
		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>
						<p>Test protected route</p>
					</div>
				</ProtectedRoute>
			</MemoryRouter>,
		)
		expect(screen.queryByText('Test protected route')).not.toBeInTheDocument()
	})
})
