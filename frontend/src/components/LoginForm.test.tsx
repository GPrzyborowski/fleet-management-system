import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
	it('renders inputs and button', () => {
		render(<LoginForm submitLogin={vi.fn()} errorMsg="" pending={false} />)
		expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Super secret password')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
	})
	it('calls submitLogin with entered values', async () => {
		const mockSubmit = vi.fn()
		render(<LoginForm submitLogin={mockSubmit} errorMsg="" pending={false} />)
		fireEvent.change(screen.getByPlaceholderText('John Doe'), {
			target: { value: 'admin' },
		})
		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'password123' },
		})
		fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
		expect(mockSubmit).toHaveBeenCalledTimes(1)
		expect(mockSubmit).toHaveBeenCalledWith('admin', 'password123')
	})

	it('renders error message', () => {
		render(<LoginForm submitLogin={vi.fn()} errorMsg="Invalid login or password." pending={false} />)
		expect(screen.getByText('Invalid login or password.')).toBeInTheDocument()
	})
	it('shows loading spinner when pending', () => {
		render(<LoginForm submitLogin={vi.fn()} errorMsg="" pending={true} />)
		const button = screen.getByRole('button')
		expect(button).toHaveClass('btn-disabled')
		expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument()
	})
})
