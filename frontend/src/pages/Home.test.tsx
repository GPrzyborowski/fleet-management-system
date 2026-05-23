import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home page', () => {
	it('renders dashboard link', () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		)

		const link = screen.getByRole('link', {
			name: /go to dashboard/i,
		})

		expect(link).toBeInTheDocument()
		expect(link).toHaveAttribute('href', '/login')
	})

	it('renders hero image', () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		)

		const image = screen.getByAltText(/trucks standing next to each other/i)

		expect(image).toBeInTheDocument()
	})
})
