import { render, screen } from '@testing-library/react'
import ActionCard from './ActionCard'

describe('ActionCard', () => {
	it('renders action card', () => {
		render(<ActionCard title="Mock title" description="Mock description" icon="icon-[tabler--user]" />)
		expect(screen.getByText('Mock title')).toBeInTheDocument()
		expect(screen.getByText('Mock description')).toBeInTheDocument()
	})
	it('renders passed icon class', () => {
		const { container } = render(
			<ActionCard title="Mock title" description="Mock description" icon="icon-[tabler--user]" />,
		)
		const icon = container.querySelector('.icon-\\[tabler--user\\]')
		expect(icon).toBeInTheDocument()
	})
	it('has hover styles', () => {
		const { container } = render(
			<ActionCard title="Mock title" description="Mock description" icon="icon-[tabler--user]" />,
		)
		expect(container.firstChild).toHaveClass('hover:border-blue-500', 'hover:shadow-md')
	})
})
