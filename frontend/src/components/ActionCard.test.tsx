import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ActionCard from './ActionCard'

describe('ActionCard', () => {
	it('renders action card', () => {
		render(
			<MemoryRouter>
				<ActionCard title="Mock title" description="Mock description" icon="icon-[tabler--user]" links="test" />
			</MemoryRouter>,
		)
		expect(screen.getByText('Mock title')).toBeInTheDocument()
		expect(screen.getByText('Mock description')).toBeInTheDocument()
	})
	it('renders passed icon class', () => {
		const { container } = render(
			<MemoryRouter>
				<ActionCard title="Mock title" description="Mock description" icon="icon-[tabler--user]" links="test" />
			</MemoryRouter>,
		)
		const icon = container.querySelector('.icon-\\[tabler--user\\]')
		expect(icon).toBeInTheDocument()
	})
	it('has hover styles', () => {
		const { container } = render(
			<MemoryRouter>
				<ActionCard title="Mock title" description="Mock description" icon="icon-[tabler--user]" links="test" />
			</MemoryRouter>,
		)
		const card = container.querySelector('.card')
		expect(card).toHaveClass('hover:border-blue-500', 'hover:shadow-md')
	})
})
