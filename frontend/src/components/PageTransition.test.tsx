import { render, screen } from '@testing-library/react'
import PageTransition from './PageTransition'

describe('PageTransition', () => {
	it('renders children', () => {
		render(
			<PageTransition>
				<div>Test Content</div>
			</PageTransition>,
		)

		expect(screen.getByText('Test Content')).toBeInTheDocument()
	})

	it('has full width and height classes', () => {
		const { container } = render(
			<PageTransition>
				<div>Test</div>
			</PageTransition>,
		)

		expect(container.firstChild).toHaveClass('w-full', 'h-full')
	})
})
