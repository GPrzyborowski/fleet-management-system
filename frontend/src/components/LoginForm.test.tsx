import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
	it('renders inputs and button', () => {
		render(<LoginForm submitLogin={vi.fn()} errorMsg="" />)

		expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Super secret password')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
	})

	it('calls submitLogin with entered values', async () => {
		const mockSubmit = vi.fn()

		render(<LoginForm submitLogin={mockSubmit} errorMsg="" />)

		fireEvent.change(screen.getByPlaceholderText('John Doe'), {
			target: { value: 'admin' },
		})

		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'password123' },
		})

		fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

		expect(mockSubmit).toHaveBeenCalledWith('admin', 'password123')
	})

	it('renders error message', () => {
		render(<LoginForm submitLogin={vi.fn()} errorMsg="Invalid login or password." />)

		expect(screen.getByText('Invalid login or password.')).toBeInTheDocument()
	})
})
