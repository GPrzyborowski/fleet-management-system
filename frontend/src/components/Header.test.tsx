import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
	it('renders passed text', () => {
		render(<Header text="Fleet Management System" />)

		expect(screen.getByText('Fleet Management System')).toBeInTheDocument()
	})
})
